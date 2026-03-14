
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Sentiment = require("sentiment");
const { connectDB } = require("./config/db");
const ChatHistory = require("./models/ChatHistory");

dotenv.config();
console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "❌ Not Loaded");

connectDB();

const apiKey = process.env.GEMINI_API_KEY;
const placesApiKey = process.env.PLACES_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction:
    "behave as a human therapist. Purpose: It is designed to provide supportive, empathetic, and non-judgmental responses to users seeking guidance, emotional support, and mental well-being advice.",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

const analyzeSentiment = (text) => {
  try {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    const sentimentScore = result.score;
    if (sentimentScore <= -2) return "critical";
    if (sentimentScore > -2 && sentimentScore < 0) return "negative";
    return "positive";
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return "neutral";
  }
};

async function findNearbyTherapists(latitude, longitude) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&type=health&keyword=therapist&key=${placesApiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating || "No rating available",
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching places data:", error);
    return [];
  }
}

const suggestOnlineTherapy = () => [
  { name: "BetterHelp", url: "https://www.betterhelp.com", description: "Online counseling and therapy." },
  { name: "Talkspace", url: "https://www.talkspace.com", description: "Affordable therapy with licensed professionals." },
];

// Save chat history
app.post("/chat", async (req, res) => {
  try {
    const { inputText, location, userId } = req.body;

    if (!inputText || !userId) {
      return res.status(400).json({ error: "Input text and user ID are required" });
    }

    const criticalKeywords = ["suicide", "self-harm", "depression", "crisis"];
    const keywordMatch = criticalKeywords.some((keyword) =>
      inputText.toLowerCase().includes(keyword)
    );

    const sentimentCategory = analyzeSentiment(inputText);
    const isCritical = keywordMatch || sentimentCategory === "critical";

    let therapists = [];
    if (isCritical && location && location.latitude && location.longitude) {
      therapists = await findNearbyTherapists(location.latitude, location.longitude);
    }

    const therapySuggestions = therapists.length > 0 ? therapists : suggestOnlineTherapy();

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: inputText }],
        },
      ],
    });

    const result = await chatSession.sendMessage(inputText);
    const aiResponse = await result.response.text();

    // Save chat history
    const userChatHistory = await ChatHistory.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: [
            { role: "user", text: inputText },
            { role: "bot", text: aiResponse },
          ],
        },
      },
      { upsert: true, new: true }
    );

    if (isCritical) {
      return res.json({
        response: `${aiResponse} It seems like you're going through a tough time. Here are some therapy options that might help:`,
        therapists: therapySuggestions,
      });
    }

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error interacting with generative AI:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch chat history
app.get("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const chatHistory = await ChatHistory.findOne({ userId });
    if (chatHistory) {
      res.status(200).json({ messages: chatHistory.messages });
    } else {
      res.status(200).json({ messages: [] }); // Return empty array if no history exists
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete chat history on logout
app.delete("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await ChatHistory.deleteOne({ userId });
    res.status(200).json({ message: "Chat history deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});