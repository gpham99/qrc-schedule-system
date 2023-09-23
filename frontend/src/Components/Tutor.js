import React, { useEffect, useState } from "react";
import Schedule from "./Tutor/Schedule";
import Profile from "./Tutor/Profile";
import { Route, Routes } from "react-router-dom";

const Tutor = () => {

  const [blockNum, setBlockNum] = useState(1);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("https://44.228.177.192/api/get_block", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log("get block return val: ", data);
        if (data["block"]) {
          setBlockNum(data["block"]);
        }
      });
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
                href="https://44.228.177.192/logout"
                onClick={() => {
                  localStorage.clear();
                }}
                class="p-3 text-white"
              >
                Exit
              </a>

              <a
                href="https://44.228.177.192/api/cas_logout"
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
              <Route path="*" element={<Profile></Profile>}></Route>
              <Route path="schedule" element={<Schedule></Schedule>}></Route>
              <Route path="profile" element={<Profile></Profile>}></Route>
            </Routes>
          </div>
        </div>
      )}
export default Tutor;
