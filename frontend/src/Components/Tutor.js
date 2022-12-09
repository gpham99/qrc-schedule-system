import React from "react";
import Schedule from "./Tutor/Schedule";
import Profile from "./Tutor/Profile";
import { Route, Routes } from "react-router-dom";

const Tutor = () => {
  return (
    <div>
      <div>
        <h1>Admin Routes</h1>
      </div>

      <ul class="nav justify-content-center">
        <li class="nav-item">
          <a class="nav-link active" href="/tutor/schedule">
            Schedule
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/tutor/profile">
            Profile
          </a>
        </li>
      </ul>

      <Routes>
        <Route path="schedule" element={<Schedule></Schedule>}></Route>
        <Route path="profile" element={<Profile></Profile>}></Route>
      </Routes>
    </div>
  );
};

export default Tutor;
