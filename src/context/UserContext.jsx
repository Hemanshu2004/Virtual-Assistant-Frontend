import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const serverUrl =
    import.meta.env.VITE_SERVER_URL || "https://virtual-assistant-mern-1.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch current user
  const handleCurrentUser = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (err) {
      console.error("Error fetching current user:", err.response?.data || err.message);
      setUserData(null);
    }
  }, [serverUrl]);

  // Ask the AI Assistant (Gemini API)
  const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `...`; // keep your full prompt here

    const result = await axios.post(
      apiUrl,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    let text = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try parsing JSON from Gemini
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      return JSON.parse(text.substring(jsonStart, jsonEnd));
    } catch {
      // fallback if Gemini response is not valid JSON
      return {
        type: "general",
        userInput: command,
        response: "Sorry, I couldn't understand that properly.",
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return {
      type: "general",
      userInput: command,
      response: "Sorry, something went wrong with the assistant.",
    };
  }
};


  // Auto fetch user on mount
  useEffect(() => {
    handleCurrentUser();
  }, [handleCurrentUser]);

  return (
    <UserDataContext.Provider
      value={{
        serverUrl,
        userData,
        setUserData,
        handleCurrentUser,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
