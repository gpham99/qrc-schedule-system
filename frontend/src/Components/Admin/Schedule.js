import React, { useState, useEffect, useRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";

const Schedule = () => {
  const [submitMessage, setSubmitMessage] = useState(null);
  const [unChangedMasterSchedule, setUnchangedMasterSchedule] = useState({});
  const [isChanged, setIsChanged] = useState({});
  const [masterSchedule, setMasterSchedule] = useState({});
  const [editedSchedule, setEdittedSchedule] = useState({});
  const [editMode, setEditMode] = useState(0);

  const componentRef = useRef();
  const [block, setBlock] = useState(null);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [errorBlock, setErrorBlock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [generateMessage, setGenerateMessage] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    async function fetchBlock() {
      try {
        setLoadingBlock(true);
        const res = await fetch("http://44.228.177.192/api/get_block", requestOptions);
        const data = await res.json();
        setBlock(data["block"]);
      }
      catch (e) {
        setErrorBlock(`Failed to load the block number. Contact for assistance.`)
      }
      finally {
        setLoadingBlock(false);
      }
    }
    fetchBlock();
  }, []);

  useEffect(() => {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      async function fetchSchedule() {
        try {
          setLoading(true);
          const res = await fetch("http://44.228.177.192/api/master_schedule", requestOptions);
          const data = await res.json();
          setMasterSchedule(data);
          setUnchangedMasterSchedule(structuredClone(data));
        }
        catch (e) {
          setError(`There was a problem loading the master schedule. Please contact support for assistance.`)
        }
        finally {
          setLoading(false);
        }
      }
      fetchSchedule();
    }
  , []);

  const toggleEditMode = () => {
    setEditMode(1 - editMode);
    setIsChanged({});
    setMasterSchedule(structuredClone(unChangedMasterSchedule));
    setEdittedSchedule({});
  };

  const submitChange = async () => {
    try {
      setSubmitting(true);
      const res = await  fetch("http://44.228.177.192/api/update_master_schedule", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(editedSchedule),
      })
      const data = await res.json();
      setSubmitMessage(data);
      setEditMode(1 - editMode);
    }
    catch (e) {
      setSubmitError("There was an ferror submitting the changes to the master schedule. Please retry or contact for assistance.")
    }
    finally {
      setSubmitting(false);
    }
  };

  const generateMasterSchedule = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      setGenerateLoading(true);
      const res = await fetch("http://44.228.177.192/api/regenerate_schedule", requestOptions);
      const data = await res.json();
      setGenerateMessage([data.msg, "success"]);
    }
    catch (e) {
      setGenerateMessage(['There was an error generating a new schedule based on the input. Please try again or contact for assistance.', "danger"]);
    }
    finally {
      setGenerateLoading(false);
    }
  };

  if (loading) return <div className="d-flex flex-column justify-content-center align-items-center bg-light p-4">
    <div className="spinner-border text-info mb-4" role="status"></div>
    <span>Loading Master Schedule table, please wait...</span>
  </div>
  if (error) return <div className="container align-items-center bg-light p-4">{error}</div>

  return (
    <div className="container align-items-center bg-light p-4">
      {masterSchedule === {} ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
            {editMode === 0 ? (
              <div className="d-flex flex-column align-items-start p-4">
                <p> This is the aggregated view of the master schedule. To make changes, go to Edit.</p>
                <div className="d-flex flex-row">
                  <p>If your schedule is ready, but you want to view a new randomized version based on your input, click here 👉</p>
                  <button type="button" class="ms-2 btn btn-warning" onClick={generateMasterSchedule} disabled={generateLoading}>
                    {generateLoading ? "Generating..." : "Generate another master schedule"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-start p-4">
                <p>This is the editable view of the master schedule.</p>
                <p>Please communicate with the relevant tutor before making changes.</p>
              </div>
            )}
          
          <div className="d-flex justify-content-between p-4">
            {/* This is to make the export as JPEG button download it as a JPEG */}
            {editMode === 0 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  exportComponentAsJPEG(componentRef);
                }}
                disabled={generateLoading}
              >
                Export schedule
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-info"
                onClick={submitChange}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            )}
            {editMode === 0 ? (
              <button className="btn btn-info" onClick={toggleEditMode} disabled={generateLoading}>Edit</button>
            ) : (
              <button className="btn btn-info" onClick={toggleEditMode} disabled={submitting}>Cancel</button>
            )}
          </div>

          {/* This is where the submit message is set and alert is shown */}
          {submitMessage !== null && submitMessage.length === 0 && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <div className="m-3 text-left">
                Please reload the page to see the changes you've made.
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSubmitMessage(null)}></button>
            </div>
          )}

          {submitMessage !== null && submitMessage.length > 0 && (
            <div className="alert alert-primary alert-dismissible fade show" role="alert">
              <div className="m-3 text-left">
                {submitMessage.map((msg) => (
                  <p>{msg}</p>
                ))}
                <p>
                  If you made any other changes that are not shown in the error
                  message above, please reload the page to see them.
                </p>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSubmitMessage(null)}></button>
            </div>
          )}

          {submitError && <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <div className="m-3 text-left">{submitError}</div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSubmitError("")}></button>
            </div>
          }

          {generateMessage && <div className={`alert alert-${generateMessage[1]} alert-dismissible fade show`} role="alert">
              <div>{generateMessage[0]}</div>
              <div>{generateMessage[1] === "success" && "Please reload the page to see the newly generated schedule."}</div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setGenerateMessage("")}></button>
            </div>
          }

          <div className="pr-4 pl-4 table-responsive" ref={componentRef}>
            <div class="p-3">
              {loadingBlock ? <div className="d-flex flex-column justify-content-center align-items-center p-4"> 
                <div className="spinner-border text-info mb-4" role="status"></div>
                <span>Loading block number...</span>
              </div> : <div>
                {errorBlock ? <p style={{color: "red"}}>{errorBlock}</p> : <h5>Block {block}</h5>}
                </div>}
              <h5>Drop-In Schedule</h5>
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
                                  </span>{shift_tutor["other_disciplines"] === "" ? "" : "/"}
                                  {shift_tutor["other_disciplines"]}:{" "}
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
                                      masterSchedule[num][index]["firstname"]
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
                                      master_schedule_copy[num][index][
                                        "firstname"
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
                                            "firstname"
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
                                  </span>{shift_tutor["other_disciplines"] === "" ? "" : "/"}
                                  {shift_tutor["other_disciplines"]}:{" "}
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
                                      masterSchedule[num][index]["firstname"]
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
                                      master_schedule_copy[num][index][
                                        "firstname"
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
                                  </span>{shift_tutor["other_disciplines"] === "" ? "" : "/"}
                                  {shift_tutor["other_disciplines"]}:{" "}
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
                                      masterSchedule[num][index]["firstname"]
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
                                      master_schedule_copy[num][index][
                                        "firstname"
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
                                    </span>{shift_tutor["other_disciplines"] === "" ? "" : "/"}
                                    {shift_tutor["other_disciplines"]}:{" "}
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
                                      masterSchedule[num][index]["firstname"]
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
                                      master_schedule_copy[num][index][
                                        "firstname"
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
        </>
      )}
    </div>
  );
};

export default Schedule;
