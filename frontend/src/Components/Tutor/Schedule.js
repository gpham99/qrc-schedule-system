import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Schedule = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

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

  const priority_levels = ["Low", "Medium", "High"];

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
          console.log(data);
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
  // const checkDidFavoriteWithoutChoice = () => {
  //   for (const [key, value] of Object.entries(edittedAvailabilities)) {
  //     if (value["picked"] === "" && value["favorited"] === true) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  // a function to send the submission
  const sendSubmission = () => {
    console.log("to send", edittedAvailabilities);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify(edittedAvailabilities),
    };

    fetch(
      "http://44.230.115.148:8080/api/tutor/set_availability",
      requestOptions
    )
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
            This is your personalized QRC walk-in shift schedule this block.
          </p>
          <p class="text-left">
            During the time window set by QRC administrators, you may select
            the shifts and disciplines for which you are available and mark
            which ones you prefer (High = most preferred, Low = least
            preferred). Once the window closes, the schedule is set based on
            a combination of all tutors' preferences. If you need to, contact
            a QRC administrator to change your schedule.
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
              {[0, 1, 2, 3, 4].map((num) => (
                <td key={num}>
                  {editMode === 0 ? (
                    <span class="badge badge-success p-1">{schedule[num]}</span>
                  ) : (
                    <>
                      {availabilities[num]["all_possible_disciplines"]
                        .length !== 0 && (
                        //DROPDOWN
                        <div class="flex justify-content-center align-items-center pl-2">
                          <ButtonGroup>
                            <DropdownButton
                              title={edittedAvailabilities[num]["favorited"]}
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };

                                edittedAvailabilitiesCopy[num]["favorited"] = e;

                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                              variant="secondary"
                            >
                              {priority_levels.map((level) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={level}
                                >
                                  {level}
                                </Dropdown.Item>
                              ))}
                            </DropdownButton>

                            <DropdownButton
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "None"
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

                                if (e === "None") {
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
                              <Dropdown.Item eventKey="None">
                                <p class="text-secondary p-0 m-0"> None</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </ButtonGroup>
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
                          {/*priorities*/}
                          <ButtonGroup>
                            <DropdownButton
                              defaultValue={"Low"}
                              title={edittedAvailabilities[num]["favorited"]}
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };

                                edittedAvailabilitiesCopy[num]["favorited"] = e;

                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                              variant="secondary"
                            >
                              {priority_levels.map((level) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={level}
                                >
                                  {level}
                                </Dropdown.Item>
                              ))}
                            </DropdownButton>

                            <DropdownButton
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "None"
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
                                if (e === "None") {
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
                              <Dropdown.Item eventKey="None">
                                <p class="text-secondary p-0 m-0"> None</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </ButtonGroup>
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
                          <ButtonGroup>
                            <DropdownButton
                              defaultValue={"Low"}
                              title={edittedAvailabilities[num]["favorited"]}
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };

                                edittedAvailabilitiesCopy[num]["favorited"] = e;

                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                              variant="secondary"
                            >
                              {priority_levels.map((level) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={level}
                                >
                                  {level}
                                </Dropdown.Item>
                              ))}
                            </DropdownButton>

                            <DropdownButton
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "None"
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
                                if (e === "None") {
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
                              <Dropdown.Item eventKey="None">
                                <p class="text-secondary p-0 m-0"> None</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </ButtonGroup>
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
                          {/*priorities*/}
                          <ButtonGroup>
                            <DropdownButton
                              defaultValue={"Low"}
                              title={
                                edittedAvailabilities[num]["favorited"] === ""
                                  ? "Low"
                                  : edittedAvailabilities[num]["favorited"]
                              }
                              onSelect={(e) => {
                                let edittedAvailabilitiesCopy = {
                                  ...edittedAvailabilities,
                                };

                                edittedAvailabilitiesCopy[num]["favorited"] = e;

                                setEdittedAvailabilities(
                                  edittedAvailabilitiesCopy
                                );
                              }}
                              variant="secondary"
                            >
                              {priority_levels.map((level) => (
                                <Dropdown.Item
                                  class="dropdown-item"
                                  eventKey={level}
                                >
                                  {level}
                                </Dropdown.Item>
                              ))}
                            </DropdownButton>
                            {/* the dropdown button */}
                            <DropdownButton
                              align="end"
                              title={
                                edittedAvailabilities[num]["picked"] === ""
                                  ? "None"
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
                                if (e === "None") {
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
                              <Dropdown.Item eventKey="None">
                                <p class="text-secondary p-0 m-0"> None</p>
                              </Dropdown.Item>
                            </DropdownButton>
                          </ButtonGroup>
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
              // let didFavoriteWithoutChoice = checkDidFavoriteWithoutChoice();
              // console.log(
              //   "did you favorite something without making a choice: ",
              //   didFavoriteWithoutChoice
              // );

              // console.log(
              //   "the negation of didFavoriteWithoutChoice: ",
              //   !didFavoriteWithoutChoice
              // );
              // setIsLegalSubmission(!didFavoriteWithoutChoice);
              // if (!didFavoriteWithoutChoice) {
              sendSubmission();
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
