import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { UserDataContext } from "../context/UserContext.jsx";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { serverUrl ,userData,setUserData} = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Handle form submit with validation
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (password.length < 6) {
      setErr("Password must be at least 6 characters long");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(res.data)
      setLoading(false);

      // Navigate to dashboard/home after successful login
      navigate("/Home"); // Consider changing "/signup" to "/dashboard" or home route
    } catch (error) {
      console.error(error);
      setUserData(null)
      setLoading(false);
      setErr(error.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000075] backdrop-blur shadow-black flex flex-col items-center justify-center gap-[20px] rounded-lg px-[20px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Sign In To <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[15px] rounded-full"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full flex items-center px-[15px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full bg-transparent outline-none text-white placeholder-gray-300 pr-[40px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute right-[15px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-[15px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && <p className="text-red-500">*{err}</p>}

        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] hover:bg-gray-200 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className="text-white mt-[20px]">
          Want To Create A New Account?
          <span
            className="text-blue-400 cursor-pointer ml-1"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
