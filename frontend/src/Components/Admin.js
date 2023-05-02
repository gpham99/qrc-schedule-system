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
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (localStorage.getItem("access_token") == null) {
      return null;
    } else {
      return true;
    }
  });

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name,
        password: "pass",
      }),
    };
    if (isAuthorized === null) {
      fetch("http://44.230.115.148/auth", requestOptions)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data["access_token"] === undefined) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
            localStorage.setItem(
              "access_token",
              JSON.stringify(data["access_token"])
            );
          }
        });

      navigate("/admin", { replace: true });
    }
  }, []);

  return (
    <>
      {isAuthorized === false ? (
        <Unauthorized></Unauthorized>
      ) : (
        <div>
          <div class="bg-info">
            <div class="pt-3">
              <h4 class="text-white text-bold"> Welcome to Block 4!</h4>
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
                href="http://44.230.115.148/cas_logout"
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
              <li class="nav-item">
                <a class="nav-link" href="/admin/discipline">
                  Remove/Add Discipline
                </a>
              </li>
            </ul>
          </div>

          <div class="p-5">
            <Routes>
              <Route path=""></Route>
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
    </>
  );
};

export default Admin;
