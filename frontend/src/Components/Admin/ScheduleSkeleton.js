import React, { useState, useEffect } from "react";

const ScheduleSkeleton = () => {

  const [submitMessage, setSubmitMessage] = useState(null);
  const [scheduleSkeleton, setScheduleSkeleton] = useState([]);
  const [edittedScheduleSkeleton, setEdittedScheduleSkeleton] = useState([]);

  // Retrieving last picked/updated skeleton
  useEffect(() => {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(
        "https://44.228.177.192/api/get_schedule_skeleton",
        requestOptions
      )
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            console.log("An error was encountered while trying to fetch schedule skeleton");
          } else {
            // console.log("data: ", data);
            setScheduleSkeleton(data);
            setEdittedScheduleSkeleton({ ...data });
          }
        });
    }
  , []);

  const submitSkeleton = () => {
    console.log("edited sched: ", edittedScheduleSkeleton);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edittedScheduleSkeleton),
    };

    fetch(
      "https://44.228.177.192/api/set_schedule_skeleton",
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

  const clearAll = () => {
    let edittedScheduleSkeletonCopy = {
      ...edittedScheduleSkeleton,
    };
    for (const num in edittedScheduleSkeletonCopy) {
      for (const index in edittedScheduleSkeletonCopy[num]) {
        edittedScheduleSkeletonCopy[num][index] = edittedScheduleSkeletonCopy[num][index].split(",")[0] + ",False";
      }
    }
    setEdittedScheduleSkeleton(
      edittedScheduleSkeletonCopy
    );
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
            <p className="text-left">
              You must press "Save" to save any changes, even when pressing "Clear All".
            </p>
            <p className="text-left font-weight-light font-italic">
              Creating a new schedule skeleton may remove shifts from the existing
              master schedule.
            </p>
          </section>
        </div>

      <div className="d-flex justify-content-between p-4">
          <button type="button" className="btn btn-info" onClick={submitSkeleton}>
            Save
          </button>
          <button type="button" className="btn btn-warning" onClick={clearAll}>Clear All</button>
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
                                  discipline.split(",")[0] + ",False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + ",True";
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
                                  discipline.split(",")[0] + ",False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + ",True";
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
                                  discipline.split(",")[0] + ",False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + ",True";
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
                                  discipline.split(",")[0] + ",False";
                              } else {
                                edittedScheduleSkeletonCopy[num][index] =
                                  discipline.split(",")[0] + ",True";
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
