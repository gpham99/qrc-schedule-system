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

  // checks if the time window is active
  const [isActiveTW, setIsActiveTW] = useState("False");

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

      fetch("http://44.230.115.148/api/tutor/get_schedule", requestOptions)
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

  function checkTimeWindow () {
    fetch("http://44.230.115.148//api/is_within_window").then((response) => {
      let res = response.json();
      return res;
    })
    .then((data) => {
      setIsActiveTW(data.msg)
    })
  }

  useEffect(() => {
    const timerId = setInterval(checkTimeWindow, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, [])

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
        "http://44.230.115.148/api/tutor/get_availability",
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
      "http://44.230.115.148/api/tutor/set_availability",
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

      {(submitMessage !== null && isActiveTW === "True") && (
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
      {
        isActiveTW === "False" && (
          <div
        class="alert alert-warning m-4 alert-dismissible fade show"
        role="alert"
      >
        <div className="m-3 text-left">
          If you just made a selection and the time window is now closed, you might want to reload the page to get your
          shift results.
        </div>
      </div>
        )
      }

      {/* skeleton of master schedule */}
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
                  {isActiveTW === "False" ? (
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
                  {isActiveTW === "False"  ? (
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
                  {isActiveTW === "False"  ? (
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
                  {isActiveTW === "False"  ? (
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

      {isActiveTW === "True" && (
        <div class="p-4">
          <button
            class="btn btn-info"
            onClick={(e) => {
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
