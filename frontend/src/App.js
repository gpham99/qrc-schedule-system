import "./App.css";
import LoginScreen from "./Components/LoginScreen.js";
import React from "react";
import ScheduleChart from "./Components/ScheduleTable/ScheduleChart";

function App() {
  return (
    <div className="App">
      <ScheduleChart></ScheduleChart>
    </div>
  );
}

export default App;
