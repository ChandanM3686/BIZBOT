from flask import Flask, render_template, session, redirect, request, url_for, jsonify, make_response
import psycopg2
import google.generativeai as genai
import PyPDF2
import pandas as pd
import docx
import os

app = Flask(__name__)
app.secret_key = "your_secret_key"

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ✅ PostgreSQL connection for Render DB (adjust parameters as needed)
db = psycopg2.connect(
    dbname="bizbot",
    user="bizbot_user",
    password="MjqN6ghqHgIMUkUPyJNvlA5qMpcTx32P",
    host="dpg-cvinr456ubrc7389s4s0-a",  # Replace with your Render DB host
    port="5432"
)
db.autocommit = True

# ✅ Create necessary tables if they don’t exist
with db.cursor() as cursor:
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            gmail VARCHAR(100) UNIQUE,
            password VARCHAR(100),
            api_key VARCHAR(255),
            bg_color VARCHAR(50) DEFAULT '#ffffff',
            text_color VARCHAR(50) DEFAULT '#000000'
        );
        
        CREATE TABLE IF NOT EXISTS user_docs (
            id SERIAL PRIMARY KEY,
            gmail VARCHAR(100),
            doc_text TEXT
        );

        CREATE TABLE IF NOT EXISTS user_widget_settings (
            id SERIAL PRIMARY KEY,
            gmail VARCHAR(255) NOT NULL,
            bg_color VARCHAR(50) DEFAULT '#ffffff',
            text_color VARCHAR(50) DEFAULT '#000000'
        );
    """)
    print("✅ Database tables created (if not already present)")

# ✅ Extraction functions
def extract_text(file_path):
    file_extension = file_path.split('.')[-1].lower()
    if file_extension == "pdf":
        return extract_text_from_pdf(file_path)
    elif file_extension == "docx":
        return extract_text_from_docx(file_path)
    elif file_extension == "csv":
        return extract_text_from_csv(file_path)
    return ""

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(docx_path):
    document = docx.Document(docx_path)
    return "\n".join([para.text for para in document.paragraphs])

def extract_text_from_csv(csv_path):
    df = pd.read_csv(csv_path)
    return df.to_string()

# ✅ Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        gmail = request.form['Gmail']
        password = request.form['password']

        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE gmail=%s", (gmail,))
            existing = cursor.fetchone()

            if existing:
                return "User already exists, please log in."

            cursor.execute("INSERT INTO users (name, gmail, password) VALUES (%s, %s, %s)",
                           (name, gmail, password))
        session['user'] = gmail
        return redirect(url_for('setup_page'))
    
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        gmail = request.form['email']
        password = request.form['password']

        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE gmail=%s AND password=%s", (gmail, password))
            user = cursor.fetchone()

            if user:
                session['user'] = gmail
                return redirect(url_for('setup_page'))
            else:
                return "Invalid login credentials."
    
    return render_template('login.html')

@app.route('/setup', methods=['GET', 'POST'])
def setup_page():
    if 'user' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        gemini_key = request.form.get('api_key')
        with db.cursor() as cursor:
            cursor.execute("UPDATE users SET api_key=%s WHERE gmail=%s", (gemini_key, session['user']))

            # Process multiple file uploads using field 'files'
            if 'files' in request.files:
                files = request.files.getlist('files')
                for file in files:
                    if file and file.filename != "":
                        filename = file.filename
                        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                        file.save(file_path)
                        extracted_text = extract_text(file_path)
                        cursor.execute("INSERT INTO user_docs (gmail, doc_text) VALUES (%s, %s)",
                                       (session['user'], extracted_text))
            # Fallback for single file upload using 'file'
            elif 'file' in request.files:
                file = request.files['file']
                if file and file.filename != "":
                    filename = file.filename
                    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                    file.save(file_path)
                    extracted_text = extract_text(file_path)
                    cursor.execute("INSERT INTO user_docs (gmail, doc_text) VALUES (%s, %s)",
                                   (session['user'], extracted_text))
        return redirect(url_for('chat_page'))
    
    return render_template('setup.html')

@app.route('/chat', methods=['GET', 'POST'])
def chat_page():
    if 'user' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        user_message = request.form.get('message', '')

        with db.cursor() as cursor:
            # Get the API key
            cursor.execute("SELECT api_key FROM users WHERE gmail=%s", (session['user'],))
            row = cursor.fetchone()
            if not row or not row[0]:
                return jsonify({"error": "No API key set. Please go to setup."}), 400
            api_key = row[0]

            # Retrieve uploaded documents
            cursor.execute("SELECT doc_text FROM user_docs WHERE gmail=%s", (session['user'],))
            doc_rows = cursor.fetchall()
            context_data = "\n".join([r[0] for r in doc_rows])

        # Configure the generative AI with the provided API key
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")

        # Determine agent role based on context keywords
        lower_context = context_data.lower()
        if "appointment" in lower_context:
            agent_role = (
                "You are a professional Clinic Assistant AI. "
                "Handle appointment bookings, doctor availability, and scheduling. "
                "Ensure responses are clear, structured, and professional."
            )
        elif "employee" in lower_context:
            agent_role = (
                "You are an HR Assistant AI. "
                "Answer HR-related queries, policies, and employee concerns using the uploaded data. "
                "Maintain a formal and professional tone."
            )
        elif "product" in lower_context:
            agent_role = (
                "You are a Business Consultant AI. "
                "Provide product information, service details, and sales inquiries based on user data. "
                "Keep responses engaging and business-oriented."
            )
        else:
            agent_role = (
                "You are a Knowledgeable AI Assistant. "
                "Answer user queries professionally and use the uploaded data if relevant."
            )

        prompt = (
            f"Role: {agent_role}\n\n"
            f"Context (extracted from your uploaded business documents):\n{context_data}\n\n"
            f"User: {user_message}\n\n"
            "Instructions: If the user's question relates directly to the uploaded data, base your answer solely on that context. "
            "Otherwise, provide a comprehensive answer using your general knowledge."
        )

        response = model.generate_content(prompt)
        return jsonify({"response": response.text})

    return render_template('chat.html')

@app.route('/widget')
def widget():
    return render_template('weight.html')

@app.route('/widget-code')
def widget_code():
    embed_code = """
<!-- Begin Chatbot Widget -->
<iframe src="http://YOUR_DOMAIN/widget" style="border:none;width:350px;height:500px;"></iframe>
<!-- End Chatbot Widget -->
    """
    response = make_response(embed_code)
    response.headers["Content-Type"] = "text/plain"
    return response

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)
