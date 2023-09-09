import React, { useEffect, useState } from "react";
import { useLocation, Route, Routes} from "react-router-dom";
import TutorInfo from "./Admin/TutorInfo";
import Schedule from "./Admin/Schedule";
import Roster from "./Admin/Roster";
import TimeWindow from "./Admin/TimeWindow";
import Internal from "./Admin/Internal";
import ScheduleSkeleton from "./Admin/ScheduleSkeleton";
import Discipline from "./Admin/Discipline";

const Admin = () => {
  const location = useLocation();
  const isUploadRosterActive = location.pathname.includes("excel");
  const isTutorStatusActive = location.pathname.includes("tutor-info");
  const isMasterScheduleActive = location.pathname.includes("schedule");
  const isNewScheduleActive = location.pathname.includes("time-window");
  const isRemoveAddAdminActive = location.pathname.includes("internal");
  const isRemoveAddDisciplineActive = location.pathname.includes("discipline");
  const isCreateScheduleActive = location.pathname.includes("create");
  const [block, setBlock] = useState(null);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    async function fetchBlock() {
      try {
        setLoadingBlock(true);
        const res = await fetch("http://44.230.115.148/api/get_block", requestOptions);
        const data = await res.json();
        setBlock(data["block"]);
      }
      catch (e) {
        setError(`Failed to load the block number. Contact for assistance.`)
      }
      finally {
        setLoadingBlock(false);
      }
    }

    fetchBlock();
  }, []);

  return (
        <div>
          <div class="bg-info">
            <div class="pt-3">
              {
                loadingBlock ?  
                <div class="spinner-border text-light" role="status"></div>
                : 
                <h4 class="text-white text-bold">
                  {error ? error : `Welcome to Block ${block}!`}
                </h4>
              }
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
                <a class={isUploadRosterActive ? "nav-link bg-info text-white rounded" : "nav-link"} href="/admin/excel">
                  Upload Roster
                </a>
              </li>

              <li class="nav-item">
                <a class={isTutorStatusActive ? "nav-link bg-info text-white rounded" : "nav-link"} href="/admin/tutor-info">
                  Tutor Status
                </a>
              </li>

              <li class="nav-item dropdown">
                <a
                  class={isMasterScheduleActive ? "nav-link dropdown-toggle bg-info text-white rounded" : "nav-link dropdown-toggle"}
	  	  href="#top"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                   Master Schedule
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class={(isMasterScheduleActive && !isCreateScheduleActive) ? "dropdown-item bg-dark text-white" : "dropdown-item"} href="/admin/schedule">
                    View/edit schedule
                  </a>
                  <a class={isCreateScheduleActive ? "dropdown-item bg-dark text-white" : "dropdown-item"}  href="/admin/schedule/create">
                    Create schedule skeleton
                  </a>
                </div>
              </li>
        
              <li class="nav-item">
                <a class={isNewScheduleActive ? "nav-link bg-info text-white rounded" : "nav-link"} href="/admin/time-window">
                  New Schedule
                </a>
              </li>

              <li class="nav-item">
                <a class={isRemoveAddAdminActive ? "nav-link bg-info text-white rounded" : "nav-link"} href="/admin/internal">
                  Remove/Add Admin
                </a>
              </li>

              <li class="nav-item">
                <a class={isRemoveAddDisciplineActive ? "nav-link bg-info text-white rounded" : "nav-link"} href="/admin/discipline">
                  Remove/Add Discipline
                </a>
              </li>
            </ul>
          </div>

          <div class="p-5">
            <Routes>
              <Route path="*" element={<Schedule></Schedule>}></Route>
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
