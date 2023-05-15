import React, { useState, useEffect } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";

const ScheduleSkeleton = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  const [submitMessage, setSubmitMessage] = useState(null);
  const [scheduleSkeleton, setScheduleSkeleton] = useState([]);
  const [edittedScheduleSkeleton, setEdittedScheduleSkeleton] = useState([]);

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

  // Retrieving last picked/updated skeleton
  useEffect(() => {
    if (isAuthorized !== false) {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
      };

      fetch(
        "http://44.230.115.148/api/get_schedule_skeleton",
        requestOptions
      )
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            setIsAuthorized(false);
          } else {
            // console.log("data: ", data);
            setScheduleSkeleton(data);
            setEdittedScheduleSkeleton({ ...data });
            setIsAuthorized(true);
          }
        });
    }
  }, []);

  const submitSkeleton = () => {
    console.log("edited sched: ", edittedScheduleSkeleton);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify(edittedScheduleSkeleton),
    };

    fetch(
      "http://44.230.115.148/api/set_schedule_skeleton",
      requestOptions
    )
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("finish submit data: ", data);
        setSubmitMessage(data.msg);
      });

  };

  return (
    <div className="container align-items-center bg-light">
        <div className="d-flex justify-content-center p-4">
          <section>
            <p className="text-left">
              You can edit the skeleton of the master schedule here.
            </p>
            <p className="text-left">
              Please select all of the disciplines you would like to be listed
              in each cell.
            </p>
            <p className="text-left font-weight-light font-italic">
              Reminder: Creating a new schedule skeleton clears every tutor's
              current schedule and the master schedule.
            </p>
          </section>
        </div>

      {/* the save button */}
      <div className="d-flex justify-content-end pl-4 pr-4">
        <button
            type="button"
            className="btn btn-info"
            onClick={submitSkeleton}
          >
            Save
          </button>
      </div>

      {submitMessage !== null && submitMessage.length > 0 && (
            <div
              class="alert alert-success m-4 alert-dismissible fade show"
              role="alert"
            >
              <div className="m-3 text-left">
                  <p>{submitMessage}</p>
                  
              </div>
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}


      {/* uneditable skeleton of master schedule */}
      <div className="pt-4 pl-4 pr-4 pb-2 table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th></th>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2-4 PM</td>
              {[0, 1, 2, 3, 4]?.map((num) => (
                <td key={num}>
                    <div class="d-flex flex-column align-items-start">
                      {scheduleSkeleton[num]?.map((discipline, index) => (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            checked={
                              edittedScheduleSkeleton[num][index].split(
                                ","
                              )[1] === "True"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              let edittedScheduleSkeletonCopy = {
                                ...edittedScheduleSkeleton,
                              };
                              if (
                                edittedScheduleSkeleton[num][index].split(
                                  ","
                                )[1] === "True"
                              ) {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "True";
                              }
                              setEdittedScheduleSkeleton(
                                edittedScheduleSkeletonCopy
                              );
                            }}
                          />
                          <label class="form-check-label">
                            {discipline.split(",")[0]}
                          </label>
                        </div>
                      ))}
                    </div>
                </td>
              ))}
            </tr>

            <tr>
              <td>4-6 PM</td>
              {[5, 6, 7, 8, 9]?.map((num) => (
                <td key={num}>
                    <div class="d-flex flex-column align-items-start">
                      {scheduleSkeleton[num]?.map((discipline, index) => (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            checked={
                              edittedScheduleSkeleton[num][index].split(
                                ","
                              )[1] === "True"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              let edittedScheduleSkeletonCopy = {
                                ...edittedScheduleSkeleton,
                              };
                              if (
                                edittedScheduleSkeleton[num][index].split(
                                  ","
                                )[1] === "True"
                              ) {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "True";
                              }
                              setEdittedScheduleSkeleton(
                                edittedScheduleSkeletonCopy
                              );
                            }}
                          />
                          <label class="form-check-label">
                            {discipline.split(",")[0]}
                          </label>
                        </div>
                      ))}
                    </div>
                </td>
              ))}
            </tr>

            <tr>
              <td>6-8 PM</td>
              {[10, 11, 12, 13, 14]?.map((num) => (
                <td key={num}>
                    <div class="d-flex flex-column align-items-start">
                      {scheduleSkeleton[num]?.map((discipline, index) => (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            checked={
                              edittedScheduleSkeleton[num][index].split(
                                ","
                              )[1] === "True"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              let edittedScheduleSkeletonCopy = {
                                ...edittedScheduleSkeleton,
                              };
                              if (
                                edittedScheduleSkeleton[num][index].split(
                                  ","
                                )[1] === "True"
                              ) {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "True";
                              }
                              setEdittedScheduleSkeleton(
                                edittedScheduleSkeletonCopy
                              );
                            }}
                          />
                          <label class="form-check-label">
                            {discipline.split(",")[0]}
                          </label>
                        </div>
                      ))}
                    </div>
                </td>
              ))}
            </tr>

            <tr>
              <td>8-10 PM</td>
              {[15, 16, 17, 18, 19]?.map((num) => (
                <td key={num}>
                    <div class="d-flex flex-column align-items-start">
                      {scheduleSkeleton[num]?.map((discipline, index) => (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            checked={
                              edittedScheduleSkeleton[num][index].split(
                                ","
                              )[1] === "True"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              let edittedScheduleSkeletonCopy = {
                                ...edittedScheduleSkeleton,
                              };
                              if (
                                edittedScheduleSkeleton[num][index].split(
                                  ","
                                )[1] === "True"
                              ) {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + "," + "True";
                              }
                              setEdittedScheduleSkeleton(
                                edittedScheduleSkeletonCopy
                              );
                            }}
                          />
                          <label class="form-check-label">
                            {discipline.split(",")[0]}
                          </label>
                        </div>
                      ))}
                    </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
)};

export default ScheduleSkeleton;
