import React, { useState, useEffect } from "react";

const ScheduleSkeleton = () => {
  const [editMode, setEditMode] = useState(0); // it's not in edit mode in the beginning, so this should be 0
  const [scheduleSkeleton, setScheduleSkeleton] = useState([]);
  const [edittedScheduleSkeleton, setEdittedScheduleSkeleton] = useState([]);

  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  // Retrieving last picked/updated skeleton
  useEffect(() => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
    };

    fetch("http://52.12.35.11:8080/api/get_schedule_skeleton", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        // console.log("data: ", data);
        setScheduleSkeleton(data);
        setEdittedScheduleSkeleton({ ...data });
      });
  }, []);

  const toggleEditMode = () => {
    setEditMode(1 - editMode);
  };

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

    fetch("http://52.12.35.11:8080/api/set_schedule_skeleton", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("finish submit data: ", data);
      });

    setEditMode(1 - editMode);
  };

  return (
    <>
      <div className="container align-items-center bg-light">
        {editMode === 0 ? (
          <div className="d-flex justify-content-center p-4">
            <section>
              <p className="text-left">
                You can view the current skeleton of the master schedule.
              </p>
              <p className="text-left">
                To create a new skeleton of the master schedule, go to Edit.
              </p>
              <p className="text-left font-weight-light font-italic">
                Creating a new schedule skeleton clears every tutor's current
                schedule and the master schedule.
              </p>
            </section>
          </div>
        ) : (
          <div className="d-flex justify-content-center p-4">
            <section>
              <p className="text-left">
                You can edit the skeleton of the master schedule here.
              </p>
              <p className="text-left">
                Please select all of the disciplines you would like to be listed
                on each cell.
              </p>
              <p className="text-left font-weight-light font-italic">
                Reminder: Creating a new schedule skeleton clears every tutor's
                current schedule and the master schedule.
              </p>
            </section>
          </div>
        )}

        {/* pencil button */}
        <div className="d-flex justify-content-end pl-4 pr-4">
          {editMode === 0 ? (
            <button className="btn btn-info" onClick={toggleEditMode}>
              <span className="p-1"> Edit </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </button>
          ) : (
            <button
              className="btn btn-info"
              onClick={() => {
                toggleEditMode();
                setEdittedScheduleSkeleton(structuredClone(scheduleSkeleton));
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* uneditable skeleton of master schedule */}
        <div className="pt-4 pl-4 pr-4 pb-2 table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th></th>
                <th className="col-sm-2">Sunday</th>
                <th className="col-sm-2">Monday</th>
                <th className="col-sm-2">Tuesday</th>
                <th className="col-sm-2">Wednesday</th>
                <th className="col-sm-2">Thursday</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2-4 PM</td>
                {[0, 1, 2, 3, 4]?.map((num) => (
                  <td key={num}>
                    {editMode === 0 ? (
                      <div>
                        {scheduleSkeleton[num]?.map((discipline) => (
                          <>
                            {discipline.split(",")[1] === "True" && (
                              <span class="badge badge-dark m-1 pl-3 pr-3">
                                {discipline.split(",")[0]}
                              </span>
                            )}
                          </>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>4-6 PM</td>
                {[5, 6, 7, 8, 9]?.map((num) => (
                  <td key={num}>
                    {editMode === 0 ? (
                      <div>
                        {scheduleSkeleton[num]?.map((discipline) => (
                          <span class="badge badge-dark m-1 pl-3 pr-3">
                            {discipline.split(",")[0]}
                          </span>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>6-8 PM</td>
                {[10, 11, 12, 13, 14]?.map((num) => (
                  <td key={num}>
                    {editMode === 0 ? (
                      <div>
                        {scheduleSkeleton[num]?.map((discipline) => (
                          <span class="badge badge-dark m-1 pl-3 pr-3">
                            {discipline.split(",")[0]}
                          </span>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>8-10 PM</td>
                {[15, 16, 17, 18, 19]?.map((num) => (
                  <td key={num}>
                    {editMode === 0 ? (
                      <div>
                        {scheduleSkeleton[num]?.map((discipline) => (
                          <span class="badge badge-dark m-1 pl-3 pr-3">
                            {discipline.split(",")[0]}
                          </span>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* the save button */}
        <div className="pb-4">
          {editMode === 1 && (
            <button
              type="button"
              className="btn btn-info"
              onClick={submitSkeleton}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ScheduleSkeleton;
