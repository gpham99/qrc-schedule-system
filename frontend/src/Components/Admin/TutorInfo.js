import React, { useEffect, useState } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";

const TutorInfo = () => {

  const [tutorsInfo, setTutorsInfo] = useState({});

  const [editMode, setEditMode] = useState(0); // 0 is false, 1 is true

  const [edittedTutorsInfo, setEdittedTutorsInfo] = useState({});

  useEffect(() => {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(
        "http://44.230.115.148/api/get_tutors_information",
        requestOptions
      )
        .then((response) => {
          let res = response.json();
          console.log("res: ", res);
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            console.log("An error occurred while trying to fetch profile information");
          } else {
            console.log("data: ", data);
            setTutorsInfo(data);
            setEdittedTutorsInfo({ ...data });
          }
        });
    }
  , []);

  const toggleEditMode = () => {
    setEditMode(1 - editMode);
  };

  const submitChange = () => {
    console.log("this is the editted tutors info: ", edittedTutorsInfo);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edittedTutorsInfo),
    };

    fetch(
      "http://44.230.115.148/api/set_tutors_information",
      requestOptions
    )
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
    <div class="container bg-light p-4">
      {/* title and description */}
      <div class="d-flex justify-content-center p-4">
        {editMode === 0 ? (
          <section>
            <p class="text-left">
              You can view the tutor's current Availablility status and LA
              status.
            </p>
            <p class="text-left">To make any changes, go to Edit.</p>
          </section>
        ) : (
          <section>
            <p class="text-left">You are in Edit Mode right now.</p>
          </section>
        )}
      </div>

      {/* pencil button */}
      <div class="d-flex justify-content-between p-4">
          {/* submit change button */}
      {editMode === 1 && (
          <button type="button" className="btn btn-info" onClick={submitChange}>
            Save Changes
          </button>
      )}
        {editMode === 0 ? (
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
        ) : (
          <button class="btn btn-info" onClick={toggleEditMode}>
            <span class="p-1"> Cancel </span>
          </button>
        )}
      </div>

      {/* table */}
      <div class="p-4 table-responsive">
        <table class="table table-bordered table-fixed">
          <thead class="table-dark">
            <tr>
              <th class="col-sm-4">Tutor</th>
              <th class="col-sm-4">LA Status</th>
              <th class="col-sm-4">Unavailable</th>
              <th class="col-sm-4">Unexcused Absences</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tutorsInfo).map((key) => (
              <tr>
                <td>{tutorsInfo[key]["name"]}</td>
                <td>
                  {
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      checked={edittedTutorsInfo[key]["this_block_la"]}
                      disabled={editMode === 0 ? true : false}
                      onChange={(e) => {
                        let edittedTutorsInfoCopy = {
                          ...edittedTutorsInfo,
                        };
                        edittedTutorsInfoCopy[key]["this_block_la"] =
                          !edittedTutorsInfoCopy[key]["this_block_la"];
                        setEdittedTutorsInfo(edittedTutorsInfoCopy);
                      }}
                    />
                  }
                </td>

                <td>
                  {
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      checked={edittedTutorsInfo[key]["this_block_unavailable"]}
                      disabled={editMode === 0 ? true : false}
                      onChange={(e) => {
                        let edittedTutorsInfoCopy = {
                          ...edittedTutorsInfo,
                        };
                        edittedTutorsInfoCopy[key]["this_block_unavailable"] =
                          !edittedTutorsInfoCopy[key]["this_block_unavailable"];
                        setEdittedTutorsInfo(edittedTutorsInfoCopy);
                      }}
                    />
                  }
                </td>

                <td>
                  {
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      checked={edittedTutorsInfo[key]["absence"]}
                      disabled={editMode === 0 ? true : false}
                      onChange={(e) => {
                        let edittedTutorsInfoCopy = {
                          ...edittedTutorsInfo,
                        };
                        edittedTutorsInfoCopy[key]["absence"] =
                          !edittedTutorsInfoCopy[key]["absence"];
                        setEdittedTutorsInfo(edittedTutorsInfoCopy);
                      }}
                    />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorInfo;
