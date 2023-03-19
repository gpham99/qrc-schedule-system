import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const Schedule = () => {
  // grab the access token from the local storage
  // const accessToken = localStorage.getItem("access_token");

  // // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // // else if they have an access token, verify first
  // const [isAuthorized, setIsAuthorized] = useState(() => {
  //   if (accessToken === null) {
  //     return false;
  //   } else {
  //     return null;
  //   }
  // });

  const [submitMessage, setSubmitMessage] = useState(null);

  // tutor's shift schedule
  const [schedule, setSchedule] = useState({});

  // tutor's availability schedule
  const [availabilities, setAvailabilities] = useState({});

  // make a copy of availabilities, and the discipline that person chooses will go into the copy of the dictionary and shown
  // to people
  const [edittedAvailabilities, setEdittedAvailabilities] = useState({});

  // This will deteremine if the schedule is in edit mode or view mode
  const [editMode, setEditMode] = useState(0);

  // checks if the submission is legal
  const [isLegalSubmission, setIsLegalSubmission] = useState(null);

  // call /api/tutor/get_schedule and pass the access token as authorization header
  useEffect(() => {
    if (isAuthorized !== false) {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
      };

      fetch("http://44.230.115.148:8080/api/tutor/get_schedule", requestOptions)
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          setIsAuthorized(true);
          setSchedule(data);
        });
    }
  }, []);

  // call /api/tutor/get_availability and pass the access token as authorization header
  useEffect(() => {
    if (isAuthorized !== false) {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
      };

      fetch(
        "http://44.230.115.148:8080/api/tutor/get_availability",
        requestOptions
      )
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          // console.log("availabilities data: ", data);
          setAvailabilities(data);
          setEdittedAvailabilities(structuredClone(data));
        });
    }
  }, [schedule]);

  const toggleEditMode = () => {
    setEdittedAvailabilities(structuredClone(availabilities));
    setEditMode(1 - editMode);
  };

  // check that a cell cannot be favorited if the discipline in that same cell is not picked -> true means illegal
  const checkDidFavoriteWithoutChoice = () => {
    for (const [key, value] of Object.entries(edittedAvailabilities)) {
      if (value["picked"] === "" && value["favorited"] === true) {
        return true;
      }
    }
    return false;
  };

  // a function to send the submission
  const sendSubmission = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify(edittedAvailabilities),
    };

    fetch("http://44.230.115.148:8080/api/tutor/set_availability", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("data: ", data);
        setSubmitMessage(data["msg"]);
      });

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

      {submitMessage !== null && (
        <div
          class="alert alert-success m-4 alert-dismissible fade show"
          role="alert"
        >
          {submitMessage}
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

      {/* the alert message */}
      {isLegalSubmission === false && (
        <div
          class="alert alert-warning m-4 alert-dismissible fade show"
          role="alert"
        >
          <div className="m-3 text-left">
            You cannot favorite a shift without choosing a discipline. Your
            submission didn't go through. Please edit your choices.
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
                    <>
                      {availabilities[num]["all_possible_disciplines"]
                        .length !== 0 && (
                        //DROPDOWN
                        <div class="d-flex flex-row justify-content-center align-items-center pl-2">
                          {/* the star button */}
                          <div class="w-25">
                            <button
                              class="p-2 d-flex align-items-center justify-content-center"
                              onClick={() => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                edittedAvailabilitiesCopy[num]["favorited"] =
                                  !edittedAvailabilitiesCopy[num]["favorited"];
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {edittedAvailabilities[num]["favorited"] ===
                              true ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#e1ad01"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#bebebe"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {/* the dropdown button */}
                          <div class="p-2 w-75 d-flex flex-justify-start">
                            <DropdownButton
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "Select"
                                  : edittedAvailabilities[num]["picked"]
                              }
                              variant={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "outline-info"
                                  : "info"
                              }
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                if (e === "Select") {
                                  edittedAvailabilitiesCopy[num]["picked"] = "";
                                } else {
                                  edittedAvailabilitiesCopy[num]["picked"] = e;
                                }
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {availabilities[num][
                                "all_possible_disciplines"
                              ].map((discipline) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={discipline}
                                >
                                  {discipline}
                                </Dropdown.Item>
                              ))}

                              <Dropdown.Divider />
                              <Dropdown.Item eventKey="Select">
                                <p class="text-secondary p-0 m-0"> Select</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>4-6 PM</td>
              {[5, 6, 7, 8, 9].map((num) => (
                <td key={num}>
                  {editMode === 0 ? (
                    <span class="badge badge-success p-1">{schedule[num]}</span>
                  ) : (
                    <>
                      {availabilities[num]["all_possible_disciplines"]
                        .length !== 0 && (
                        //DROPDOWN
                        <div class="d-flex flex-row justify-content-center align-items-center pl-2">
                          {/* the star button */}
                          <div class="w-25">
                            <button
                              class="p-2 d-flex align-items-center justify-content-center"
                              onClick={() => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                edittedAvailabilitiesCopy[num]["favorited"] =
                                  !edittedAvailabilitiesCopy[num]["favorited"];
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {edittedAvailabilities[num]["favorited"] ===
                              true ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#e1ad01"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#bebebe"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {/* the dropdown button */}
                          <div class="p-2 w-75 d-flex flex-justify-start">
                            <DropdownButton
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "Select"
                                  : edittedAvailabilities[num]["picked"]
                              }
                              variant={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "outline-info"
                                  : "info"
                              }
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                if (e === "Select") {
                                  edittedAvailabilitiesCopy[num]["picked"] = "";
                                } else {
                                  edittedAvailabilitiesCopy[num]["picked"] = e;
                                }
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {availabilities[num][
                                "all_possible_disciplines"
                              ].map((discipline) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={discipline}
                                >
                                  {discipline}
                                </Dropdown.Item>
                              ))}

                              <Dropdown.Divider />
                              <Dropdown.Item eventKey="Select">
                                <p class="text-secondary p-0 m-0"> Select</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>6-8 PM</td>
              {[10, 11, 12, 13, 14].map((num) => (
                <td key={num}>
                  {editMode === 0 ? (
                    <span class="badge badge-success p-1">{schedule[num]}</span>
                  ) : (
                    <>
                      {availabilities[num]["all_possible_disciplines"]
                        .length !== 0 && (
                        //DROPDOWN
                        <div class="d-flex flex-row justify-content-center align-items-center  pl-2">
                          {/* the star button */}
                          <div>
                            <button
                              class="p-2 d-flex align-items-center justify-content-center"
                              onClick={() => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                edittedAvailabilitiesCopy[num]["favorited"] =
                                  !edittedAvailabilitiesCopy[num]["favorited"];
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {edittedAvailabilities[num]["favorited"] ===
                              true ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#e1ad01"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#bebebe"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {/* the dropdown button */}
                          <div class="p-2 w-75 d-flex flex-justify-start">
                            <DropdownButton
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "Select"
                                  : edittedAvailabilities[num]["picked"]
                              }
                              variant={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "outline-info"
                                  : "info"
                              }
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                if (e === "Select") {
                                  edittedAvailabilitiesCopy[num]["picked"] = "";
                                } else {
                                  edittedAvailabilitiesCopy[num]["picked"] = e;
                                }
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {availabilities[num][
                                "all_possible_disciplines"
                              ].map((discipline) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={discipline}
                                >
                                  {discipline}
                                </Dropdown.Item>
                              ))}

                              <Dropdown.Divider />
                              <Dropdown.Item eventKey="Select">
                                <p class="text-secondary p-0 m-0"> Select</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>8-10 PM</td>
              {[15, 16, 17, 18, 19].map((num) => (
                <td key={num}>
                  {editMode === 0 ? (
                    <span class="badge badge-success p-1">{schedule[num]}</span>
                  ) : (
                    <>
                      {availabilities[num]["all_possible_disciplines"]
                        .length !== 0 && (
                        //DROPDOWN
                        <div class="d-flex flex-row justify-content-center align-items-center  pl-2">
                          {/* the star button */}
                          <div>
                            <button
                              class="p-2 d-flex align-items-center justify-content-center"
                              onClick={() => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                edittedAvailabilitiesCopy[num]["favorited"] =
                                  !edittedAvailabilitiesCopy[num]["favorited"];
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {edittedAvailabilities[num]["favorited"] ===
                              true ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#e1ad01"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="#bebebe"
                                  class="bi bi-star-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {/* the dropdown button */}
                          <div class="p-2 w-75 d-flex flex-justify-start">
                            <DropdownButton
                              align="end"
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "Select"
                                  : edittedAvailabilities[num]["picked"]
                              }
                              variant={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "outline-info"
                                  : "info"
                              }
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };
                                if (e === "Select") {
                                  edittedAvailabilitiesCopy[num]["picked"] = "";
                                } else {
                                  edittedAvailabilitiesCopy[num]["picked"] = e;
                                }
                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                            >
                              {availabilities[num][
                                "all_possible_disciplines"
                              ].map((discipline) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={discipline}
                                >
                                  {discipline}
                                </Dropdown.Item>
                              ))}

                              <Dropdown.Divider />
                              <Dropdown.Item eventKey="Select">
                                <p class="text-secondary p-0 m-0"> Select</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {editMode === 1 && (
        <div class="p-4">
          <button
            class="btn btn-info"
            onClick={(e) => {
              console.log("editted avails: ", edittedAvailabilities);
              let didFavoriteWithoutChoice = checkDidFavoriteWithoutChoice();
              // console.log(
              //   "did you favorite something without making a choice: ",
              //   didFavoriteWithoutChoice
              // );

              // console.log(
              //   "the negation of didFavoriteWithoutChoice: ",
              //   !didFavoriteWithoutChoice
              // );
              setIsLegalSubmission(!didFavoriteWithoutChoice);
              if (!didFavoriteWithoutChoice) {
                sendSubmission();
              }
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Schedule;
