import React, { useState, useEffect } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";

const Roster = () => {
  const [lastUploaded, setLastUploaded] = useState([]);

  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/last_excel_file", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        let res = response.json();
        //setFile(res);
        return res;
      })
      .then((data) => {
        setLastUploaded(data);
      });
  }, [lastUploaded]);

  // last uploaded's header and data
  const tableHeaders = lastUploaded?.slice(0, 1);
  const tableData = lastUploaded?.slice(1);

  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  const [file, setFile] = useState();

  const [submitMessage, setSubmitMessage] = useState("");

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    const requestOptions = {
      method: "PUT",
      headers: {
        enctype: "multipart/form-data",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: formData,
    };
    fetch("http://52.12.35.11:8080/api/upload_roster", requestOptions)
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
    <div className="container align-items-center bg-light">
      <div className="row p-4 justify-content-center">
        <p>
          If your roster has any changes, please upload it here. This includes
          adding or removing a tutor.
        </p>
      </div>

      {submitMessage.length > 0 && (
        <div
          class="alert alert-primary m-4 alert-dismissible fade show"
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

      <div className="row p-4 justify-content-center">
        <button
          type="button"
          class="btn btn-info"
          data-toggle="modal"
          data-target=".bd-example-modal-lg"
        >
          View the last uploaded excel file
        </button>
      </div>

      <div
        class="modal fade bd-example-modal-lg responsive"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="p-4 table-responsive">
              <table class="table table-bordered ">
                {console.log("headers", tableHeaders)}
                <thead class="table-dark">
                  <tr>
                    <th class="col-sm-4">First Name</th>
                    <th class="col-sm-4">Last Name</th>
                    <th class="col-sm-4">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((tutorInfo) => (
                    <tr>
                      <td>{tutorInfo[0]}</td>
                      <td>{tutorInfo[1]}</td>
                      <td>{tutorInfo[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row p-4 justify-content-center">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="myFile"
            name="filename"
            onChange={handleChange}
          />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Roster;
