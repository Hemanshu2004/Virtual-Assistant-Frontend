import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "https://virtual-assistant-mern-1.onrender.com";

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

  // Ask assistant
  const getGeminiResponse = useCallback(
    async (command) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/asktoassistant`,
          { command },
          { withCredentials: true }
        );
        return result.data;
      } catch (error) {
        console.error("Error getting Gemini response:", error.response?.data || error.message);
        return { response: "Sorry, something went wrong with the assistant.", type: "general" };
      }
    },
    [serverUrl]
  );

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
