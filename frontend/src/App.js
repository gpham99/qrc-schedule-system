import "./App.css";
import LoginScreen from "./Components/LoginScreen.js";
import React from "react";
import ScheduleChart from "./Components/ScheduleTableScreen/ScheduleChart";
import ImportFile from "./Components/ImportFileScreen/ImportFile";
import TutorInfo from "./Components/AdminTutorInfoScreen/viewTutorInfo";
import TutorInfoEditable from "./Components/AdminTutorInfoScreen/viewTutorInfoEditable";
import DateTimeInterval from "./Components/AdminTimeWindowFrame/TimeWindow";

function App() {
  return (
    <div className="App">
      <DateTimeInterval />
    </div>
  );
}

export default App;
