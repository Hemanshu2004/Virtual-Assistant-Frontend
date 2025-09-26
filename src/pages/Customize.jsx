import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card";
import { FaImages } from "react-icons/fa";
import { UserDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";

// Import your default images
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import image7 from "../assets/image7.jpg";
import image8 from "../assets/image8.jpg";
import image9 from "../assets/image9.jpg";
import image10 from "../assets/image10.jpg";
import image11 from "../assets/image11.jpg";
import image12 from "../assets/image12.jpg";

function Customize() {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage
  } = useContext(UserDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFrontendImage(url);    // preview
      setBackendImage(file);    // file for backend
      setSelectedImage(url);    // mark uploaded image as selected
    }
  };

  // Default avatars - arranged for 2 rows (6 images per row)
  const images = [
    image1, image2, image3, image4, image5, image6,
    image7, image8, image9, image10, image11, image12,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center py-8 px-4">
      <IoMdArrowRoundBack
  className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer 
             hover:text-blue-400 transition-colors duration-300"
  onClick={() => navigate("/")} // navigate directly to home
/>




      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-white text-4xl font-bold mb-2">Select Your Avatar</h1>
        <p className="text-gray-300 text-lg">Choose from default avatars or upload your own</p>
      </div>

      {/* Images Grid Container */}
      <div className="flex-1 w-full max-w-6xl flex flex-col justify-center">
        {/* First Row - 6 images */}
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {images.slice(0, 6).map((img, i) => (
            <Card key={i} image={img} />
          ))}
        </div>

        {/* Second Row - 6 images */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {images.slice(6, 12).map((img, i) => (
            <Card key={i + 6} image={img} />
          ))}
        </div>

        {/* Upload Section */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 lg:w-40 lg:h-40 bg-[#030326] border-2 border-[#0000ff66] rounded-2xl flex flex-col items-center justify-center cursor-pointer
                hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white transition-all duration-300
                hover:scale-105 group"
              onClick={() => inputImage.current.click()}
            >
              <FaImages className="text-white text-3xl lg:text-4xl mb-2 group-hover:text-blue-400 transition-colors" />
              <span className="text-white text-xs lg:text-sm text-center px-2">Upload Custom Avatar</span>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={inputImage}
              hidden
              onChange={handleFileChange}
            />

            {/* Show uploaded image preview */}
            {frontendImage && (
              <div className="text-center">
                <p className="text-green-400 mb-2">Uploaded Image:</p>
                <Card image={frontendImage} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Button */}
      {selectedImage && (
        <div className="mt-8">
          <button
            className="min-w-[200px] h-16 bg-white text-black font-bold text-xl rounded-full 
              hover:bg-gray-100 hover:scale-105 transition-all duration-300 
              shadow-lg hover:shadow-xl active:scale-95"
            onClick={() => navigate("/customize2")}
          >
            Continue to Next Step
          </button>
        </div>
      )}
    </div>
  );
}

export default Customize;