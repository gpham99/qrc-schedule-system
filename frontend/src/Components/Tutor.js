import React from "react";
import Schedule from "./Tutor/Schedule";
import Profile from "./Tutor/Profile";
import { Route, Routes } from "react-router-dom";

const Tutor = () => {
  return (
    <div>
      <div class="bg-info">
        <div class="pt-3">
          <h4 class="text-white text-bold"> Welcome to Block 4!</h4>
        </div>

        <div class="d-flex flex-row justify-content-end pr-4">
          <a href="http://52.12.35.11:8080/logout" class="p-3 text-white">
            Exit
          </a>
          <a href="http://52.12.35.11:8080/cas_logout" class="p-3 text-white">
            CAS Log out
          </a>
        </div>
      </div>

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
          <Route path="" element={<Schedule></Schedule>}></Route>
          <Route exact path="schedule" element={<Schedule></Schedule>}></Route>
          <Route exact path="profile" element={<Profile></Profile>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Tutor;
