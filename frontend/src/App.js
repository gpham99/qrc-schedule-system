import logo from "./logo.svg";
import "./App.css";
import LoginScreen from "./Components/LoginScreen.js";
import { useState, useEffect } from "react";
import React from "react";

function App() {
  return (
    <div className="App">
      <LoginScreen></LoginScreen>
    </div>
  );
}

export default App;
