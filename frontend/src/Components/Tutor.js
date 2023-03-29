import React, { useEffect, useState } from "react";
import Schedule from "./Tutor/Schedule";
import Profile from "./Tutor/Profile";
import { Route, Routes, useSearchParams, useNavigate } from "react-router-dom";
import Unauthorized from "../ErrorPages/Unauthorized";

const Tutor = () => {
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
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    if (isAuthorized === null) {
      fetch("http://44.230.115.148:8080/api/get-token", requestOptions)
        .then(function (response) {
          let res = response.json();
          console.log("Res ", res);
          return res;
        })
        .then(function (data) {
          console.log("Data ", data);
          let isAuthorized = "access_token" in data;
          setIsAuthorized(isAuthorized);
          if (isAuthorized) {
            localStorage.setItem(
              "access_token",
              JSON.stringify(data["access_token"])
            );
          }
        });
      navigate("/tutor", { replace: true });
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
                href="http://44.230.115.148:8080/logout"
                onClick={() => {
                  localStorage.clear();
                }}
                class="p-3 text-white"
              >
                Exit
              </a>

              <a
                href="http://44.230.115.148:8080/cas_logout"
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
              <Route path=""></Route>
              <Route path="schedule" element={<Schedule></Schedule>}></Route>
              <Route path="profile" element={<Profile></Profile>}></Route>
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

export default Tutor;
