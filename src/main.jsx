import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import './index.css' 

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <UserContext>
        <App />
      </UserContext>
    </BrowserRouter>

);
