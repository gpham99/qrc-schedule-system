import React, { useState, useEffect, useRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import Unauthorized from "../../ErrorPages/Unauthorized";

const Schedule = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  const [submitMessage, setSubmitMessage] = useState(null);
  const [unChangedMasterSchedule, setUnchangedMasterSchedule] = useState({});
  const [isChanged, setIsChanged] = useState({});
  const [masterSchedule, setMasterSchedule] = useState({});
  const [editedSchedule, setEdittedSchedule] = useState({});
  const [editMode, setEditMode] = useState(0);
  const componentRef = useRef();

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (isAuthorized !== false) {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
      };

      fetch("http://44.230.115.148:8080/api/master_schedule", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          if ("error" in data) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
            // this set master schedule sets the data of the master schedule after fetching it
            setMasterSchedule(data);
            // we set the unchanged master schedule to a deep clone of the current master schedule
            setUnchangedMasterSchedule(structuredClone(data));
          }
        });
    }
  }, []);

  // This method shifts between the editable and non editable view of the schedule
  const toggleEditMode = (event) => {
    event.preventDefault();
    // edit mode is either 0 or 1
    setEditMode(1 - editMode);

    setIsChanged({});
    setMasterSchedule(structuredClone(unChangedMasterSchedule));
    setEdittedSchedule({});
  };

  const submitChange = (event) => {
    event.preventDefault();
    // console.log(editedSchedule);

    fetch("http://44.230.115.148:8080/api/update_master_schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify(editedSchedule),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log("the data coming out of save action: ", data);
        setSubmitMessage(data);
      });

    setEditMode(1 - editMode);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container align-items-center bg-light p-4">
      {masterSchedule === {} ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-center p-4">
            {editMode === 0 ? (
              <section>
                <p className="text-left">
                  This is the aggregated view of the master schedule.
                </p>
                <p className="text-left">To make changes, go to Edit.</p>
              </section>
            ) : (
              <section>
                <p className="text-left">
                  This is the editable view of the master schedule.
                </p>
                <p className="text-left">
                  Please communicate with the respective tutor before making
                  changes.
                </p>
              </section>
            )}
          </div>
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
              <button className="btn btn-info" onClick={toggleEditMode}>
                Cancel
              </button>
            )}
          </div>

          {/* This is where the submit message is set and alert is shown */}
          {submitMessage !== null && submitMessage.length === 0 && (
            <div
              class="alert alert-success m-4 alert-dismissible fade show"
              role="alert"
            >
              <div className="m-3 text-left">
                Please reload the page to see the changes you've made.
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

          {submitMessage !== null && submitMessage.length > 0 && (
            <div
              class="alert alert-danger m-4 alert-dismissible fade show"
              role="alert"
            >
              <div className="m-3 text-left">
                {submitMessage.map((msg) => (
                  <p>{msg}</p>
                ))}
                <p>
                  If you made any other changes that are not shown in the error
                  message above, please reload the page to see them.
                </p>
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
          <div className="pr-4 pl-4 table-responsive" ref={componentRef}>
            <div class="p-3">
              <h5>Block 4 Drop-In Schedule</h5>
            </div>
            <table className="table table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Sunday</th>
                  <th scope="col">Monday</th>
                  <th scope="col">Tuesday</th>
                  <th scope="col">Wednesday</th>
                  <th scope="col">Thursday</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2-4 PM</td>
                  {[0, 1, 2, 3, 4]?.map((num) => (
                    <td key={num}>
                      <div class="d-flex flex-column">
                        {masterSchedule[num]?.map((shift_tutor, index) => (
                          <>
                            {editMode === 0 ? (
                              <>
                                {shift_tutor["tutor"] && (
                                  <div class="m-1 text-left">
                                    <span class="text-success">
                                      {shift_tutor["discipline"]}
                                    </span>
                                    /{shift_tutor["other_disciplines"]}:
                                    {shift_tutor["tutor"].split(" ")[0]}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div class="m-1 text-left d-flex flex-row align-items-center">
                                <div class="text-successs w-50">
                                  {shift_tutor["discipline"]}
                                </div>
                                <div>
                                  <input
                                    class="form-control form-control-sm"
                                    type="text"
                                    value={
                                      masterSchedule[num][index][
                                        "email"
                                      ]?.split("@")[0]
                                    }
                                    style={{
                                      borderColor: isChanged[num + "," + index]
                                        ? "green"
                                        : "",
                                      borderWidth: isChanged[num + "," + index]
                                        ? "medium"
                                        : "",
                                    }}
                                    onChange={(e) => {
                                      let new_email = e.target.value;
                                      let master_schedule_copy = {
                                        ...masterSchedule,
                                      };
                                      master_schedule_copy[num][index][
                                        "email"
                                      ] = new_email;
                                      setMasterSchedule(master_schedule_copy);

                                      let isChanged_copy = { ...isChanged };
                                      let isSame =
                                        (unChangedMasterSchedule[num][index][
                                          "email"
                                        ] === null &&
                                          masterSchedule[num][index][
                                            "email"
                                          ] === "") ||
                                        masterSchedule[num][index]["email"] ===
                                          unChangedMasterSchedule[num][index][
                                            "email"
                                          ]?.split("@")[0];
                                      isChanged_copy[num + "," + index] =
                                        !isSame;
                                      setIsChanged(isChanged_copy);

                                      let d_key =
                                        num + "," + shift_tutor["discipline"];
                                      let d_copy = { ...editedSchedule };
                                      if (isSame === false) {
                                        d_copy[d_key] = e.target.value;
                                        setEdittedSchedule(d_copy);
                                      } else {
                                        delete d_copy[d_key];
                                        setEdittedSchedule(d_copy);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>4-6 PM</td>
                  {[5, 6, 7, 8, 9]?.map((num) => (
                    <td key={num}>
                      <div class="d-flex flex-column">
                        {masterSchedule[num]?.map((shift_tutor, index) => (
                          <>
                            {editMode === 0 ? (
                              <>
                                {shift_tutor["tutor"] && (
                                  <div class="m-1 text-left">
                                    <span class="text-success">
                                      {shift_tutor["discipline"]}
                                    </span>
                                    /{shift_tutor["other_disciplines"]}:{" "}
                                    {shift_tutor["tutor"].split(" ")[0]}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div class="m-1 text-left d-flex flex-row align-items-center">
                                <div class="text-successs w-50">
                                  {shift_tutor["discipline"]}
                                </div>
                                <div>
                                  <input
                                    class="form-control form-control-sm"
                                    type="text"
                                    value={
                                      masterSchedule[num][index][
                                        "email"
                                      ]?.split("@")[0]
                                    }
                                    style={{
                                      borderColor: isChanged[num + "," + index]
                                        ? "green"
                                        : "",
                                      borderWidth: isChanged[num + "," + index]
                                        ? "medium"
                                        : "",
                                    }}
                                    onChange={(e) => {
                                      let new_email = e.target.value;
                                      let master_schedule_copy = {
                                        ...masterSchedule,
                                      };
                                      master_schedule_copy[num][index][
                                        "email"
                                      ] = new_email;
                                      setMasterSchedule(master_schedule_copy);

                                      let isChanged_copy = { ...isChanged };
                                      let isSame =
                                        (unChangedMasterSchedule[num][index][
                                          "email"
                                        ] === null &&
                                          masterSchedule[num][index][
                                            "email"
                                          ] === "") ||
                                        masterSchedule[num][index]["email"] ===
                                          unChangedMasterSchedule[num][index][
                                            "email"
                                          ]?.split("@")[0];
                                      isChanged_copy[num + "," + index] =
                                        !isSame;
                                      setIsChanged(isChanged_copy);

                                      let d_key =
                                        num + "," + shift_tutor["discipline"];
                                      let d_copy = { ...editedSchedule };
                                      if (isSame === false) {
                                        d_copy[d_key] = e.target.value;
                                        setEdittedSchedule(d_copy);
                                      } else {
                                        delete d_copy[d_key];
                                        setEdittedSchedule(d_copy);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>6-8 PM</td>
                  {[10, 11, 12, 13, 14]?.map((num) => (
                    <td key={num}>
                      <div class="d-flex flex-column">
                        {masterSchedule[num]?.map((shift_tutor, index) => (
                          <>
                            {editMode === 0 ? (
                              <>
                                {shift_tutor["tutor"] && (
                                  <div class="m-1 text-left">
                                    <span class="text-success">
                                      {shift_tutor["discipline"]}
                                    </span>
                                    /{shift_tutor["other_disciplines"]}:{" "}
                                    {shift_tutor["tutor"].split(" ")[0]}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div class="m-1 text-left d-flex flex-row align-items-center">
                                <div class="text-successs w-50">
                                  {shift_tutor["discipline"]}
                                </div>
                                <div>
                                  <input
                                    class="form-control form-control-sm"
                                    type="text"
                                    value={
                                      masterSchedule[num][index][
                                        "email"
                                      ]?.split("@")[0]
                                    }
                                    style={{
                                      borderColor: isChanged[num + "," + index]
                                        ? "green"
                                        : "",
                                      borderWidth: isChanged[num + "," + index]
                                        ? "medium"
                                        : "",
                                    }}
                                    onChange={(e) => {
                                      let new_email = e.target.value;
                                      let master_schedule_copy = {
                                        ...masterSchedule,
                                      };
                                      master_schedule_copy[num][index][
                                        "email"
                                      ] = new_email;
                                      setMasterSchedule(master_schedule_copy);

                                      let isChanged_copy = { ...isChanged };
                                      let isSame =
                                        (unChangedMasterSchedule[num][index][
                                          "email"
                                        ] === null &&
                                          masterSchedule[num][index][
                                            "email"
                                          ] === "") ||
                                        masterSchedule[num][index]["email"] ===
                                          unChangedMasterSchedule[num][index][
                                            "email"
                                          ]?.split("@")[0];
                                      isChanged_copy[num + "," + index] =
                                        !isSame;
                                      setIsChanged(isChanged_copy);

                                      let d_key =
                                        num + "," + shift_tutor["discipline"];
                                      let d_copy = { ...editedSchedule };
                                      if (isSame === false) {
                                        d_copy[d_key] = e.target.value;
                                        setEdittedSchedule(d_copy);
                                      } else {
                                        delete d_copy[d_key];
                                        setEdittedSchedule(d_copy);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>8-10 PM</td>
                  {[15, 16, 17, 18, 19]?.map((num) => (
                    <td key={num}>
                      <div class="d-flex flex-column">
                        {masterSchedule[num]?.map((shift_tutor, index) => (
                          <>
                            {editMode === 0 ? (
                              <>
                                {shift_tutor["tutor"] && (
                                  <div class="m-1 text-left">
                                    <span class="text-success">
                                      {shift_tutor["discipline"]}
                                    </span>
                                    /{shift_tutor["other_disciplines"]}:{" "}
                                    {shift_tutor["tutor"].split(" ")[0]}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div class="m-1 text-left d-flex flex-row align-items-center">
                                <div class="text-successs w-50">
                                  {shift_tutor["discipline"]}
                                </div>
                                <div>
                                  <input
                                    class="form-control form-control-sm"
                                    type="text"
                                    value={
                                      masterSchedule[num][index][
                                        "email"
                                      ]?.split("@")[0]
                                    }
                                    style={{
                                      borderColor: isChanged[num + "," + index]
                                        ? "green"
                                        : "",
                                      borderWidth: isChanged[num + "," + index]
                                        ? "medium"
                                        : "",
                                    }}
                                    onChange={(e) => {
                                      let new_email = e.target.value;
                                      let master_schedule_copy = {
                                        ...masterSchedule,
                                      };
                                      master_schedule_copy[num][index][
                                        "email"
                                      ] = new_email;
                                      setMasterSchedule(master_schedule_copy);

                                      let isChanged_copy = { ...isChanged };
                                      let isSame =
                                        (unChangedMasterSchedule[num][index][
                                          "email"
                                        ] === null &&
                                          masterSchedule[num][index][
                                            "email"
                                          ] === "") ||
                                        masterSchedule[num][index]["email"] ===
                                          unChangedMasterSchedule[num][index][
                                            "email"
                                          ]?.split("@")[0];
                                      isChanged_copy[num + "," + index] =
                                        !isSame;
                                      setIsChanged(isChanged_copy);

                                      let d_key =
                                        num + "," + shift_tutor["discipline"];
                                      let d_copy = { ...editedSchedule };
                                      if (isSame === false) {
                                        d_copy[d_key] = e.target.value;
                                        setEdittedSchedule(d_copy);
                                      } else {
                                        delete d_copy[d_key];
                                        setEdittedSchedule(d_copy);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {/* This is to make the export as JPEG button download it as a JPEG */}
          <div className="p-2">
            {editMode === 0 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  exportComponentAsJPEG(componentRef);
                }}
              >
                Export schedule
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-info"
                onClick={submitChange}
              >
                Save
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
