import "./App.css";
import LoginScreen from "./Components/LoginScreen.js";
import React from "react";
import ScheduleChart from "./Components/ScheduleTableScreen/ScheduleChart";
import ImportFile from "./Components/ImportFileScreen/ImportFile";

function App() {
  return (
    <div className="App">
      <ImportFile></ImportFile>
    </div>
  );
}

export default App;
