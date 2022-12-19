import React, { useEffect, useState } from "react";

const Schedule = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  // tutor's shift schedule
  const [schedule, setSchedule] = useState({});

  // tutor's availability schedule
  const [availabilities, setAvailabilities] = useState({});

  // This will deteremine if the schedule is in edit mode or view mode
  const [editMode, setEditMode] = useState(0);

  // call /api/tutor/get_schedule and pass the access token as authorization header
  useEffect(() => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
    };

    fetch("http://52.12.35.11:8080/api/tutor/get_schedule", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        setSchedule(data);
      });
  }, []);

  // call /api/tutor/get_availability and pass the access token as authorization header
  useEffect(() => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
    };

    fetch("http://52.12.35.11:8080/api/tutor/get_availability", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("availabilities data: ", data);
        setAvailabilities(data);
      });
  }, []);

  const toggleEditMode = () => {
    setEditMode(1 - editMode);
  };

  return (
    <div class="container align-items-center bg-light">
      <div class="d-flex justify-content-center p-4">
        <section>
          <p class="text-left">
            This is your personalized QRC schedule this block.
          </p>
          <p class="text-left">
            You can only edit your schedule within the shift registration time
            window set by the QRC adminstrators.
          </p>
        </section>
      </div>

      {/* pencil button */}
      {editMode === 0 ? (
        <div class="d-flex justify-content-end pl-4 pr-4">
          <button class="btn btn-info" onClick={toggleEditMode}>
            <span class="p-1"> Edit </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil-square"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div class="d-flex justify-content-end pl-4 pr-4">
          <button class="btn btn-info" onClick={toggleEditMode}>
            <span class="p-1"> Cancel </span>
          </button>
        </div>
      )}

      {/* uneditable skeleton of master schedule */}
      <div class="p-4 table-responsive">
        <table class="table table-bordered">
          <thead class="table-dark">
            <tr>
              <th class="col-sm-2"></th>
              <th class="col-sm-2">Sunday</th>
              <th class="col-sm-2">Monday</th>
              <th class="col-sm-2">Tuesday</th>
              <th class="col-sm-2">Wednesday</th>
              <th class="col-sm-2">Thursday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2-4 PM</td>
              {[0, 1, 2, 3, 4].map((num) => (
                <td key={num}>
                  {editMode === 0 ? (
                    <span class="badge badge-success p-1">{schedule[num]}</span>
                  ) : (
                    //DROPDOWN
                    <div class="d-flex flex-row justify-content-center align-items-center">
                      <div>
                        <button class="p-2 d-flex align-items-center justify-content-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="teal"
                            class="bi bi-star-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                          </svg>
                        </button>
                      </div>
                      <div class="p-2">
                        <button
                          class="btn btn-outline-info dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Select
                        </button>

                        <div
                          class="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {/* TODO - map discipline vals here */}
                          {availabilities[num]["all_possible_disciplines"].map(
                            (discipline) => (
                              <a class="dropdown-item">{discipline}</a>
                            )
                          )}

                          {/* <a class="dropdown-item" href="#">
                            Action
                          </a>
                          <a class="dropdown-item" href="#">
                            Another action
                          </a> */}
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>4-6 PM</td>
              {[5, 6, 7, 8, 9].map((num) => (
                <td key={num}>
                  <span class="badge badge-success p-1">{schedule[num]}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td>6-8 PM</td>
              {[10, 11, 12, 13, 14].map((num) => (
                <td key={num}>
                  <span class="badge badge-success p-1">{schedule[num]}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td>8-10 PM</td>
              {[15, 16, 17, 18, 19].map((num) => (
                <td key={num}>
                  <span class="badge badge-success p-1">{schedule[num]}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {editMode === 1 && (
        <div class="p-4">
          <button class="btn btn-info">Save</button>
        </div>
      )}
    </div>
  );
};

export default Schedule;
