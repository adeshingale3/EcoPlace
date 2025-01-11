import React, { useState } from "react";

const ChatBot = ({ onClose }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const sendMessageToChatbot = async () => {
    if (!chatInput.trim()) {
      setChatError("Please enter a message.");
      return;
    }

    setChatError("");
    setChatLoading(true);

    // Add user message immediately for better UX
    const userMessage = chatInput.trim();
    setChatHistory(prev => [...prev, { role: "user", message: userMessage }]);
    setChatInput(""); // Clear input immediately

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include", // Important for CORS
        mode: "cors", // Explicitly state CORS mode
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      setChatHistory(prev => [...prev, { 
        role: "bot", 
        message: data.answer || "Sorry, I couldn't process that request." 
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { 
        role: "bot", 
        message: "Sorry, I'm having trouble connecting to the server. Please try again." 
      }]);
      setChatError(error.message || "Failed to communicate with the chatbot.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !chatLoading) {
      sendMessageToChatbot();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  const chatContainerRef = React.useRef(null);
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="fixed bottom-16 right-6 bg-white border shadow-lg rounded-lg w-80 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Chat Assistant</h3>
        <button
          className="text-gray-600 hover:text-gray-800 transition-colors"
          onClick={onClose}
          aria-label="Close chat"
        >
          ✖
        </button>
      </div>

      <div 
        ref={chatContainerRef}
        className="space-y-4 mb-4 max-h-96 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Start a conversation!
          </div>
        )}
        
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                chat.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-black rounded-bl-none"
              }`}
            >
              {chat.message}
            </div>
          </div>
        ))}
        
        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black rounded-lg rounded-bl-none px-4 py-2">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={chatLoading}
          />
          <button
            className={`px-4 py-2 rounded-r-lg transition-colors ${
              chatLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={sendMessageToChatbot}
            disabled={chatLoading}
          >
            {chatLoading ? "..." : "Send"}
          </button>
        </div>
        
        {chatError && (
          <p className="text-red-500 text-sm px-2">{chatError}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBot;