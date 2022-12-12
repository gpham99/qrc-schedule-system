import "./App.css";
import LoginScreen from "./Components/LoginScreen.js";
import React from "react";
import ScheduleChart from "./Components/ScheduleTableScreen/ScheduleChart";
import ImportFile from "./Components/ImportFileScreen/ImportFile";
import TutorInfo from "./Components/AdminTutorInfoScreen/viewTutorInfo";
import TutorInfoEditable from "./Components/AdminTutorInfoScreen/viewTutorInfoEditable";
import TutorProfile from "./Components/ProfilePage/TutorProfile";

function App() {
  return (
    <div className="App">
      <TutorProfile></TutorProfile>
    </div>
  );
}

export default App;
