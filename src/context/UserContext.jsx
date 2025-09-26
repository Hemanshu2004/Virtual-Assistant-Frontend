import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000"; // backend URL
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      setUserData(result.data);
      console.log("Current User:", result.data);
    } catch (err) {
      console.error("Error fetching current user:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

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
        setSelectedImage
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
