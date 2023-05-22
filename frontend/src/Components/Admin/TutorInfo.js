import React, { useEffect, useState } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";
import "./TutorInfo.css"; // Import the CSS file for TutorInfo

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

    fetch("http://44.230.115.148/api/get_tutors_information", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if ("error" in data) {
          console.log(
            "An error occurred while trying to fetch profile information"
          );
        } else {
          setTutorsInfo(data);
          setEdittedTutorsInfo({ ...data });
        }
      });
  }, []);

  const toggleEditMode = () => {
    setEditMode(1 - editMode);
  };

  const submitChange = () => {
    console.log("this is the edited tutors info: ", edittedTutorsInfo);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edittedTutorsInfo),
    };

    fetch("http://44.230.115.148/api/set_tutors_information", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("finish submit data: ", data);
      });

    setEditMode(1 - editMode);
  };

  return (
    <div className="container bg-light p-4">
      {/* title and description */}
      <div className="d-flex justify-content-center p-4">
        {editMode === 0 ? (
          <section>
            <p className="text-left">
              You can view the tutor's current Availability status and LA status.
            </p>
            <p className="text-left">To make any changes, go to Edit.</p>
          </section>
        ) : (
          <section>
            <p className="text-left">You are in Edit Mode right now.</p>
          </section>
        )}
      </div>

      {/* pencil button */}
      <div className="d-flex justify-content-between p-4">
        {/* submit change button */}
        {editMode === 1 && (
          <button type="button" className="btn btn-info" onClick={submitChange}>
            Save Changes
          </button>
        )}
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
              {/* Path data */}
            </svg>
          </button>
        ) : (
          <button className="btn btn-info" onClick={toggleEditMode}>
            <span className="p-1"> Cancel </span>
          </button>
        )}
      </div>

      {/* table */}
      <div className="p-4 table-responsive">
        <table className="table table-bordered table-fixed">
          <thead className="table-dark sticky-header"> {/* Add sticky-header class */}
            <tr>
              <th className="col-sm-4">Tutor</th>
              <th className="col-sm-4">LA Status</th>
              <th className="col-sm-4">Unavailable</th>
              <th className="col-sm-4">Unex Ab</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tutorsInfo).map((key) => (
              <tr key={key}> {/* Add key prop to each row */}
                <td>{tutorsInfo[key]["name"]}</td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    checked={edittedTutorsInfo[key]["this_block_la"]}
                    disabled={editMode === 0 ? true : false}
                    onChange={(e) => {
                      let edittedTutorsInfoCopy = { ...edittedTutorsInfo };
                      edittedTutorsInfoCopy[key]["this_block_la"] =
                        !edittedTutorsInfoCopy[key]["this_block_la"];
                      setEdittedTutorsInfo(edittedTutorsInfoCopy);
                    }}
                  />
                </td>

                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    checked={edittedTutorsInfo[key]["this_block_unavailable"]}
                    disabled={editMode === 0 ? true : false}
                    onChange={(e) => {
                      let edittedTutorsInfoCopy = { ...edittedTutorsInfo };
                      edittedTutorsInfoCopy[key]["this_block_unavailable"] =
                        !edittedTutorsInfoCopy[key]["this_block_unavailable"];
                      setEdittedTutorsInfo(edittedTutorsInfoCopy);
                    }}
                  />
                </td>

                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    checked={edittedTutorsInfo[key]["absence"]}
                    disabled={editMode === 0 ? true : false}
                    onChange={(e) => {
                      let edittedTutorsInfoCopy = { ...edittedTutorsInfo };
                      edittedTutorsInfoCopy[key]["absence"] =
                        !edittedTutorsInfoCopy[key]["absence"];
                      setEdittedTutorsInfo(edittedTutorsInfoCopy);
                    }}
                  />
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
