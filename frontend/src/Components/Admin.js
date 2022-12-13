import React from "react";
import { Route, Routes } from "react-router-dom";
import TutorInfo from "./Admin/TutorInfo";
import Schedule from "./Admin/Schedule";
import Roster from "./Admin/Roster";
import TimeWindow from "./Admin/TimeWindow";
import Internal from "./Admin/Internal";
import ScheduleSkeleton from "./Admin/ScheduleSkeleton";

const Admin = () => {
  return (
    <div>
      <div class="mt-5 p-2">
        <h1>Admin Routes</h1>
      </div>

      <div>
        <ul class="nav justify-content-center">
          <li class="nav-item">
            <a class="nav-link active" href="/admin/excel">
              Roster
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/admin/tutor-info">
              Tutors' Information
            </a>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Master Schedule
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="/admin/schedule">
                View/edit schedule
              </a>
              <a class="dropdown-item" href="/admin/schedule/create">
                Create schedule skeleton
              </a>
            </div>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/admin/time-window">
              Time Window
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/admin/internal">
              Remove/Add Admin
            </a>
          </li>
        </ul>
      </div>

      <div class="p-5">
        <Routes>
          <Route path="" element={<Schedule></Schedule>}></Route>
          <Route path="excel" element={<Roster></Roster>}></Route>
          <Route path="tutor-info" element={<TutorInfo></TutorInfo>}></Route>
          <Route
            path="schedule/create"
            element={<ScheduleSkeleton></ScheduleSkeleton>}
          ></Route>
          <Route path="schedule" element={<Schedule></Schedule>}></Route>
          <Route path="time-window" element={<TimeWindow></TimeWindow>}></Route>
          <Route path="internal" element={<Internal></Internal>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
