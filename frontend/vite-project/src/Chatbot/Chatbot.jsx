

import React from "react";

import  { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    // Fetch chat history when the chatbot loads
    const fetchChatHistory = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:3000/chat/${user.id}`);
          const data = await response.json();
          setMessages(data.messages || []);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };

    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: "Unable to access your location. Sharing your location helps find nearby therapists." },
          ]);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Location services are not supported in your browser." },
      ]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: input, location: userLocation, userId: user.id }),
      });

      const data = await response.json();
      const botMessage = { role: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);

      if (data.therapists && data.therapists.length > 0) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Here are some nearby therapists:" },
          ...data.therapists.map((therapist) => ({
            role: "bot",
            text: `${therapist.name}, ${therapist.address} (${therapist.rating})`,
          })),
        ]);
      } else if (data.therapists && data.therapists.length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "No therapists found nearby. You can consider online therapy options like BetterHelp or Talkspace." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "An error occurred. Please try again later." }]);
    }
  };

  const deleteChatHistory = async () => {
    if (user) {
      try {
        await fetch(`http://localhost:3000/chat/${user.id}`, {
          method: "DELETE",
        });
        setMessages([]); // Clear the chat UI
        alert("Chat history deleted successfully!");
      } catch (error) {
        console.error("Error deleting chat history:", error);
        alert("Failed to delete chat history.");
      }
    }
  };

  return (
    <div className="fixed bottom-2 right-5 bg-white shadow-lg rounded-lg w-96 h-[600px] flex flex-col z-50">
      <div className="bg-red-500 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h2 className="text-lg font-semibold">AI THERAPIST</h2>
        <button onClick={onClose} className="text-white">✕</button>
      </div>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field and delete button */}
      <div className="p-4 border-t bg-white flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Send
        </button>
      </div>

      {/* Delete chat history button */}
      <div className="p-1 border-t bg-white flex justify-center">
        <button
          onClick={deleteChatHistory}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Delete History
        </button>
      </div>
    </div>
  );
};

export default Chatbot;