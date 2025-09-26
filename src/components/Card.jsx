// components/Card.jsx
import React, { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';

function Card({ image }) {
  const { selectedImage, setSelectedImage, setFrontendImage, setBackendImage } = useContext(UserDataContext);

  const handleSelect = () => {
    setSelectedImage(image);
    setFrontendImage(null);
    setBackendImage(null); // Reset backend image when selecting default avatar
  };

  const isSelected = selectedImage === image;

  return (
    <div
      className={`w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-4 border-white shadow-2xl shadow-blue-500 scale-110' 
          : 'border-2 border-gray-600 hover:border-blue-400 hover:scale-105'
        }`}
      onClick={handleSelect}
    >
      <img 
        src={image} 
        alt="Avatar" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default Card;