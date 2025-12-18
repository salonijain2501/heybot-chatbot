import Bot from "../Models/bot.model.js";
import User from "../Models/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup the AI (Just one line)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

export const Message = async (req, res) => {
  try {
    const { text } = req.body;

    // 2. Save what the user said
    const user = await User.create({ sender: "user", text: text });

    // 3. Talk to the "Lite" version of Gemini (It's easier to access for free)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    // 4. Get the answer
    const result = await model.generateContent(text);
    const botReply = result.response.text();

    // 5. Save the bot's answer
    const bot = await Bot.create({ sender: "bot", text: botReply });

    // 6. Send everything back to your website
    return res.status(200).json({
      userMessage: user.text,
      botMessage: bot.text,
    });

  } catch (error) {
    console.log("Something went wrong:", error.message);

    // If the "Traffic Jam" error (429) happens, send a simple message
    if (error.message.includes("429")) {
      return res.status(429).json({ 
        error: "I'm talking to too many people! Please wait 30 seconds and try again." 
      });
    }

    return res.status(500).json({ error: "System error, try again later." });
  }
};