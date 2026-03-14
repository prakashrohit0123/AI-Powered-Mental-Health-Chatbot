import React from "react";

export default function About() {
    return (
        <div className="bg-gradient-to-r from-blue-200 to-purple-300 min-h-screen flex flex-col items-center justify-center p-6">
            <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Us</h1>
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                    Welcome to <span className="text-blue-600 font-semibold">PeaceinMe</span>, your dedicated mental health companion. Our mission is to provide emotional support and mindfulness guidance through meaningful and compassionate interactions.
                </p>
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                    Our AI-driven chatbot is designed to assist with stress, anxiety, and emotional well-being by offering a safe, confidential, and judgment-free space where you can express yourself freely.
                </p>
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                    We believe that mental wellness should be accessible to all, and we are here to help you on your journey towards inner peace and self-care.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed font-medium italic">
                    "You are not alone. Find peace within."
                </p>
            </div>
        </div>
    );
}
