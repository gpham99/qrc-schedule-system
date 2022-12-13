import React from "react";
import Schedule from "./Tutor/Schedule";
import Profile from "./Tutor/Profile";
import { Route, Routes } from "react-router-dom";

const Tutor = () => {
  return (
    <div>
      <div class="mt-5 p-2">
        <h1>Tutor Routes</h1>
      </div>

      <div>
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
      </div>

      <div class="p-5">
        <Routes>
          <Route path="schedule" element={<Schedule></Schedule>}></Route>
          <Route path="profile" element={<Profile></Profile>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Tutor;
