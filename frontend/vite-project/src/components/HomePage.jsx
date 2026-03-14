


import React, { useState, lazy, Suspense } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react"; // Import Clerk hooks
import chatbotIcon from "../Chatbot/Chatbot.png";

const LazyChatbot = lazy(() => import("../Chatbot/Chatbot"));

const HomePage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isSignedIn } = useUser(); // Check if user is signed in

  return (
    <>
      <header className="pt-12 pb-1 text-center">
        <h1 className="text-5xl font-bold mb-6 gradient-text">
          Your Mental Health Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Find peace, support, and guidance on your journey to better mental well-being. 
          We&apos;re here to help you every step of the way.
        </p>
      </header>

      {/* Chatbot Button */}
      <div className="flex justify-center items-center py-5">
        {isSignedIn ? (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center space-x-3"
            aria-label="Open Chatbot"
          >
            <img src={chatbotIcon} alt="Chatbot" className="h-8 w-8" />
            <span>Open Chatbot</span>
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-all">
              Sign in to Open Chatbot
            </button>
          </SignInButton>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transform hover:translate-y-[-5px] transition-all">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">AI Chat Support</h3>
            <p className="text-gray-600">
              24/7 compassionate AI assistant ready to listen and provide guidance.
            </p>
          </div>
          <div className="card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transform hover:translate-y-[-5px] transition-all">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Mood Tracking</h3>
            <p className="text-gray-600">
              Track your emotional well-being and identify patterns over time.
            </p>
          </div>
          <div className="card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transform hover:translate-y-[-5px] transition-all">
            <div className="text-3xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-semibold mb-2">Guided Exercises</h3>
            <p className="text-gray-600">
              Access meditation, breathing exercises, and relaxation techniques.
            </p>
          </div>
        </div>
      </main>

      {isChatbotOpen && (
        <Suspense fallback={<div>Loading chatbot...</div>}>
          <LazyChatbot onClose={() => setIsChatbotOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default HomePage;
