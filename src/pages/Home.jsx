import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const { userData, serverUrl, setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      navigate("/signin")
      setUserData(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center py-8 px-4 relative">
      {/* Header Section */}
      <div className="text-center mb-[50px]">
        <h1 className="text-white text-[36px] font-bold mb-[10px] tracking-wide">
          Welcome to Your Avatar
        </h1>
        <div className="w-[100px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
      </div>

      {/* Avatar Display Section */}
      <div className='flex flex-col items-center gap-[30px]'>
        <div className='w-[320px] h-[420px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20'>
          <img 
            src={userData?.assistantImage} 
            alt='Your Avatar' 
            className='w-full h-full object-cover'
          />
        </div>
        
        <div className="text-center">
          <h1 className='text-white text-[28px] font-bold mb-[5px]'>
            I'm <span className="text-blue-300">{userData?.assistantName}</span>
          </h1>
          <p className='text-gray-300 text-[16px]'>Your Personal Assistant</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-[30px] right-[30px] flex flex-col gap-[15px]">
        <button
          className="min-w-[180px] h-[55px] text-black font-semibold bg-white rounded-full text-[17px] cursor-pointer hover:bg-gray-200 transition-colors duration-200 shadow-lg px-[25px]"
          onClick={handleLogOut}
        >
          Logout
        </button>
        
        <button
          className="min-w-[180px] h-[55px]  font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-[17px] cursor-pointer hover:from-blue-500 hover:to-purple-600 transition-all duration-200 shadow-lg px-[25px]"
          onClick={() => navigate("/customize")}
        >
          Customize Your Avatar
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2">
        <p className="text-gray-400 text-[14px]">Your AI companion is ready to assist you!</p>
      </div>
    </div>
  )
}

export default Home