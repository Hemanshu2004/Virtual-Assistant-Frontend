import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import user from "../assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState(""); 
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Start recognition safely
  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) console.error("recognition error:", error);
    }
  };

  // Speak assistant response
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;

    setAiText(text);
    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      startRecognition();
    };

    synth.speak(utterance);
  };

  // Handle assistant commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const encodedInput = encodeURIComponent(userInput);

    switch (type) {
      case "google-search":
        window.open(`https://www.google.com/search?q=${encodedInput}`, "_blank");
        break;
      case "youtube-search":
      case "youtube-play":
        window.open(`https://www.youtube.com/results?search_query=${encodedInput}`, "_blank");
        break;
      case "calculator-open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "instagram-open":
        window.open("https://www.instagram.com", "_blank");
        break;
      case "facebook-open":
        window.open("https://www.facebook.com", "_blank");
        break;
      case "twitter-open":
        window.open("https://www.twitter.com", "_blank");
        break;
      case "linkedin-open":
        window.open("https://www.linkedin.com", "_blank");
        break;
      case "general":
      default:
        // General responses handled by speak()
        break;
    }
  };

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (err) {
          if (err.name !== "InvalidStateError") console.error(err);
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      setAiText("");
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const lastResult = e.results[e.results.length - 1];
      const transcript = lastResult[0].transcript.trim();
      setAiText("");
      setUserText(transcript);

      if (
        userData &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        try {
          const data = await getGeminiResponse(transcript);
          handleCommand(data);
          setAiText(data.response);
        } catch (err) {
          console.error("Error calling assistant:", err);
        }
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) safeRecognition();
    }, 10000);

    safeRecognition();

    return () => {
      recognition.stop();
      recognitionRef.current = null;
      clearInterval(fallback);
    };
  }, [userData, getGeminiResponse]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center py-8 px-4 relative">
      {/* Header */}
      <div className="text-center mb-[10px]">
        <h1 className="text-white text-[36px] font-bold mb-[10px] tracking-wide">
          Greetings!!!
        </h1>
        <div className="w-[100px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-[15px]">
        <div className="w-[280px] h-[380px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
          <img
            src={userData?.assistantImage}
            alt="Assistant Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center flex flex-col items-center gap-2">
          <h1 className="text-white text-[28px] font-bold">
            I'm <span className="text-blue-300">{userData?.assistantName}</span>
          </h1>
          {aiText ? (
            <img src={ai} alt="ai gif" className="w-[200px]" />
          ) : (
            <img src={user} alt="user gif" className="w-[200px]" />
          )}
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
          className="min-w-[180px] h-[55px] font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-[17px] cursor-pointer hover:from-blue-500 hover:to-purple-600 transition-all duration-200 shadow-lg px-[25px]"
          onClick={() => navigate("/customize")}
        >
          Customize Your Avatar
        </button>
      </div>
    </div>
  );
}

export default Home;
