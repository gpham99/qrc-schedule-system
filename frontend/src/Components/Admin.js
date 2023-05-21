import React, { useEffect, useState } from "react";
import { useNavigate, Route, Routes, useSearchParams } from "react-router-dom";
import TutorInfo from "./Admin/TutorInfo";
import Schedule from "./Admin/Schedule";
import Roster from "./Admin/Roster";
import TimeWindow from "./Admin/TimeWindow";
import Internal from "./Admin/Internal";
import ScheduleSkeleton from "./Admin/ScheduleSkeleton";
import Discipline from "./Admin/Discipline";
import Unauthorized from "../ErrorPages/Unauthorized";

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(() => {
    return searchParams.get("username") || null;
  });
  const [blockNum, setBlockNum] = useState(1);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("http://44.230.115.148/api/get_block", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("get block return val: ", data);
        if (data["block"]) {
          setBlockNum(data["block"]);
        }
      });
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name,
        password: "pass",
      }),
    };
    
  }, []);

  return (
        <div>
          <div class="bg-info">
            <div class="pt-3">
              <h4 class="text-white text-bold">
                {" "}
                Welcome to Block {blockNum}!
              </h4>
            </div>

            <div class="d-flex flex-row justify-content-end pr-4">
              <a
                href="http://44.230.115.148/logout"
                onClick={() => {
                  localStorage.clear();
                }}
                class="p-3 text-white"
              >
                Exit
              </a>

              <a
                href="http://44.230.115.148/api/cas_logout"
                onClick={() => {
                  localStorage.clear();
                }}
                class="p-3 text-white"
              >
                CAS Logout
              </a>
            </div>
          </div>

          <div class="mt-5 p-2">
            <h1>Admin Routes</h1>
          </div>

          <div>
            <ul class="nav justify-content-center">
              <li class="nav-item">
                <a class="nav-link active" href="/admin/excel">
                  Upload Roster
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/admin/tutor-info">
                  Tutor Status
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
                  New Schedule
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/admin/internal">
                  Remove/Add Admin
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/admin/discipline">
                  Remove/Add Discipline
                </a>
              </li>
            </ul>
          </div>

          <div class="p-5">
            <Routes>
              <Route path="*" element={<TimeWindow></TimeWindow>}></Route>
              <Route path="excel" element={<Roster></Roster>}></Route>
              <Route
                path="tutor-info"
                element={<TutorInfo></TutorInfo>}
              ></Route>
              <Route
                path="schedule/create"
                element={<ScheduleSkeleton></ScheduleSkeleton>}
              ></Route>
              <Route path="schedule" element={<Schedule></Schedule>}></Route>
              <Route
                path="time-window"
                element={<TimeWindow></TimeWindow>}
              ></Route>
              <Route path="internal" element={<Internal></Internal>}></Route>
              <Route
                path="discipline"
                element={<Discipline></Discipline>}
              ></Route>
            </Routes>
          </div>
        </div>
      )}

export default Admin;
