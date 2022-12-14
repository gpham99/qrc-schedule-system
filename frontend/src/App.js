import "./App.css";
import LoginScreen from "./Components/LoginScreen.js";
import React from "react";
import ScheduleChart from "./Components/ScheduleTableScreen/ScheduleChart";
import ImportFile from "./Components/ImportFileScreen/ImportFile";
import TutorInfo from "./Components/AdminTutorInfoScreen/viewTutorInfo";
import TutorInfoEditable from "./Components/AdminTutorInfoScreen/viewTutorInfoEditable";
import TutorProfile from "./Components/ProfilePage/TutorProfile";
import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Admin from "./Components/Admin";
import Tutor from "./Components/Tutor";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  return (
    <div className="App">
      {/* <div class="alert alert-info" role="alert">
        The current time is {currentTime}.
      </div> */}
      <div>
        <Routes>
          <Route path="/admin/*" element={<Admin />}></Route>
          <Route path="/tutor/*" element={<Tutor></Tutor>}></Route>
          <Route path="/" element={<Home></Home>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
