import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ import axios
import { IoMdArrowRoundBack } from "react-icons/io";

function Customize2() {
  const { userData, backendImage, serverUrl, setUserData, selectedImage } = useContext(UserDataContext);
  const [avatarName, setAvatarName] = useState(userData?.assistantName || "");
  const navigate = useNavigate();

  const handleUpdateAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("avatarName", avatarName);

      if (backendImage) {
        formData.append("avatarImage", backendImage); // file upload
      } else {
        formData.append("imageUrl", selectedImage); // default image url
      }

      const res = await axios.post(
        `${serverUrl}/api/user/update`, // ✅ fixed template literal
        formData,
        { withCredentials: true }
      );

      console.log("Update response:", res.data);
      setUserData(res.data.user || res.data); // ✅ update context properly
    } catch (error) {
      console.error("Update avatar error:", error);
    }
  };

  const handleSave = async () => {
    if (!avatarName.trim()) return; // prevent empty names

    await handleUpdateAvatar();

    // Local context update for instant UI feedback
    setUserData({
      ...userData,
      assistantName: avatarName,
      assistantImage: selectedImage,
    });

    // Redirect home
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center ">
      <IoMdArrowRoundBack 
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer" 
        onClick={() => navigate("/customize")}
      />
      
      {/* Improved heading section */}
      <div className="text-center mb-[50px]">
        <h1 className="text-white text-[36px] font-bold mb-[10px] tracking-wide">
          Enter Your Avatar Name
        </h1>
        <div className="w-[80px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
      </div>

      <input
        type="text"
        placeholder="eg.Prime"
        value={avatarName}
        onChange={(e) => setAvatarName(e.target.value)}
        className="w-full max-w-[400px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[25px] rounded-full text-[18px] font-medium"
        required
      />

      {avatarName && (
        <button
          onClick={handleSave} // ✅ only one handler
          className="cursor-pointer min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] hover:bg-gray-200 transition-colors duration-200"
        >
          Save
        </button>
      )}
    </div>
  );
}

export default Customize2;