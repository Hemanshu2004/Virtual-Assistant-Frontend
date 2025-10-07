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
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const synth = window.speechSynthesis;

  // ------------------------------
  // LOGOUT HANDLER
  // ------------------------------
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ------------------------------
  // SAFE START FOR SPEECH RECOGNITION
  // ------------------------------
  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) console.error("recognition error:", error);
    }
  };

  // ------------------------------
  // SPEAK FUNCTION (ASSISTANT RESPONSE)
  // ------------------------------
  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const voices = synth.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;

    setAiText(text);
    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      startRecognition();
    };

    synth.cancel(); // stop overlapping voices
    synth.speak(utterance);
  };

  // ------------------------------
  // HANDLE COMMANDS FROM BACKEND
  // ------------------------------
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const encodedInput = encodeURIComponent(userInput);
    const urls = {
      "google-search": `https://www.google.com/search?q=${encodedInput}`,
      "youtube-search": `https://www.youtube.com/results?search_query=${encodedInput}`,
      "youtube-play": `https://www.youtube.com/results?search_query=${encodedInput}`,
      "calculator-open": `https://www.google.com/search?q=calculator`,
      "instagram-open": "https://www.instagram.com",
      "facebook-open": "https://www.facebook.com",
      "twitter-open": "https://www.twitter.com",
      "linkedin-open": "https://www.linkedin.com",
    };

    if (urls[type]) window.open(urls[type], "_blank");
  };

  // ------------------------------
  // SPEECH RECOGNITION SETUP
  // ------------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
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
      if (!isSpeakingRef.current) setTimeout(safeRecognition, 1000);
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
      setUserText(transcript);

      // Wake word detection (assistant name)
      if (
        userData?.assistantName &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        try {
          const data = await getGeminiResponse(transcript);
          handleCommand(data);
        } catch (err) {
          console.error("Error calling assistant:", err);
          speak("Sorry, I couldn’t process that.");
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

  // ------------------------------
  // UI RENDER
  // ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020236] flex flex-col items-center justify-center py-8 px-4 relative">
      {/* Header */}
      <div className="text-center mb-[10px]">
        <h1 className="text-white text-[36px] font-bold mb-[10px] tracking-wide">
          Greetings!!!
        </h1>
        <div className="w-[100px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
      </div>

      {/* Avatar Section */}
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
          <img src={aiText ? ai : user} alt="gif" className="w-[200px]" />
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute top-[30px] right-[30px] flex flex-col gap-[15px]">
        <button
          onClick={handleLogOut}
          className="min-w-[180px] h-[55px] text-black font-semibold bg-white rounded-full text-[17px] cursor-pointer hover:bg-gray-200 transition duration-200 shadow-lg"
        >
          Logout
        </button>

        <button
          onClick={() => navigate("/customize")}
          className="min-w-[180px] h-[55px] font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-[17px] cursor-pointer hover:from-blue-500 hover:to-purple-600 transition duration-200 shadow-lg"
        >
          Customize Your Avatar
        </button>
      </div>
    </div>
  );
}

export default Home;
