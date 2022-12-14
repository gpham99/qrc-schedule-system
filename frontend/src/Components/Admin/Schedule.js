import React, { useState, useEffect, useRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";

const Schedule = () => {
  const [masterSchedule, setMasterSchedule] = useState({});
  const componentRef = useRef();

  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/master_schedule")
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setMasterSchedule(data);
        console.log("ms: ", masterSchedule);
      });
  }, []);

  return (
    <div className="container align-items-center bg-light p-4">
      {masterSchedule === {} ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-center p-4">
            <section>
              <p className="text-left">
                This is the aggregated view of the master schedule.
              </p>
              <p className="text-left">To make changes, go to Edit.</p>
            </section>
          </div>

          {/* pencil button */}
          <div className="d-flex justify-content-end pl-4 pr-4">
            <a href="#">
              <button className="btn btn-info">
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
            </a>
          </div>

          {/* uneditable skeleton of master schedule */}
          <div className="p-4 table-responsive" ref={componentRef}>
            <div class="p-3">
              <h5>Block 4 Drop-In Schedule</h5>
            </div>
            <table className="table table-bordered table-sm">
              <thead className="table-dark">
                <tr>
                  <th className="col-sm-2" scope="col"></th>
                  <th className="col-sm-2" scope="col">
                    Sunday
                  </th>
                  <th className="col-sm-2" scope="col">
                    Monday
                  </th>
                  <th className="col-sm-2" scope="col">
                    Tuesday
                  </th>
                  <th className="col-sm-2" scope="col">
                    Wednesday
                  </th>
                  <th className="col-sm-2" scope="col">
                    Thursday
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">2-4 PM</td>
                  {[0, 1, 2, 3, 4]?.map((num) => (
                    <td key={num}>
                      <div class="d-flex flex-column">
                        {masterSchedule[num]?.map((shift_tutor) => (
                          <div class="m-1 text-left">
                            <span class="text-success">
                              {shift_tutor["discipline"]}
                            </span>
                            /{shift_tutor["other_disciplines"]}:{" "}
                            {shift_tutor["tutor"].split(" ")[0]}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td scope="row">4-6 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td scope="row">6-8 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td scope="row">8-10 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                exportComponentAsJPEG(componentRef);
              }}
            >
              Export schedule
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
