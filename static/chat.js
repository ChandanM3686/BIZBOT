// chat.js

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const chatOutput = document.getElementById("chatOutput");
  
    chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = messageInput.value.trim();
      if (!message) return;
  
      // Display the user's message
      appendMessage("You", message);
      messageInput.value = "";
  
      try {
        // Send the message to the Flask chat endpoint via POST
        const response = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ message: message }),
        });
        const data = await response.json();
  
        if (data.response) {
          appendMessage("AI", data.response);
        } else if (data.error) {
          appendMessage("Error", data.error);
        }
      } catch (error) {
        appendMessage("Error", "Failed to fetch AI response.");
        console.error("Error:", error);
      }
    });
  
    // Function to append a message to the chat output
    function appendMessage(sender, message) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("chat-message");
      messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
      chatOutput.appendChild(messageElement);
      chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to the bottom
    }
  });
  