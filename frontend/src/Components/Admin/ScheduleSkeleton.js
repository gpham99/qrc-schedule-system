import React, { useState, useEffect } from "react";

const ScheduleSkeleton = () => {
  const [submitMessage, setSubmitMessage] = useState(null);
  const [scheduleSkeleton, setScheduleSkeleton] = useState([]);
  const [edittedScheduleSkeleton, setEdittedScheduleSkeleton] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    async function fetchScheduleSkeleton() {
      try {
        setLoading(true);
        const res =  await fetch("http://44.230.115.148/api/get_schedule_skeleton", requestOptions);
        const data = await res.json();
        setScheduleSkeleton(data);
        setEdittedScheduleSkeleton({ ...data });
      }
      catch (e) {
        setError("There was a problem loading the schedule skeleton. Please try again or contact for assistance.")
      }
      finally {
        setLoading(false);
      }
    }
    fetchScheduleSkeleton();
  }
  , []);

  const submitSkeleton = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edittedScheduleSkeleton),
    };

    try {
      setSubmitting(true);
      const res = await fetch("http://44.230.115.148/api/set_schedule_skeleton", requestOptions);
      const data = await res.json();
      setSubmitMessage([data.msg, "success"]);
    }
    catch (e) {
      setSubmitMessage(["There was a problem submitting your changes to the schedule skeleton. Please retry or contact for assistance.", "danger"])
    }
    finally {
      setSubmitting(false);
    }
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

  if (loading) return <div className="d-flex flex-column justify-content-center align-items-center bg-light p-4">
      <div className="spinner-border text-info mb-4" role="status"></div>
      <span>Loading Schedule Skeleton table, please wait...</span>
    </div>
  if (error) return <div className="container align-items-center bg-light p-4">{error}</div>

  return (
    <div className="container align-items-center bg-light">
      <div className="d-flex flex-column align-items-start p-4">Notice:
        <p>- You must press "Save" to record any changes, even when pressing "Clear All".</p>
        <p>- Creating a new schedule skeleton may remove shifts from the existing master schedule.</p>
      </div>

      <div className="d-flex justify-content-between p-4">
          <button type="button" className="btn btn-info" onClick={submitSkeleton} disabled={submitting}>
            Save
          </button>
          <button type="button" className="btn btn-warning" onClick={clearAll} disabled={submitting}>Clear All</button>
      </div>

      {submitMessage && (
        <div className={`alert alert-${submitMessage[1]} alert-dismissible fade show`} role="alert">
          <p>{submitMessage[0]}</p>
          <p>{submitMessage[1] === "success" && "Please reload the page to see the latest changes."}</p>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSubmitMessage(null)}></button>
        </div>)}

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
