import React, { useState, useEffect } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";

const Roster = () => {
  const [lastUploaded, setLastUploaded] = useState([]);

  useEffect(() => {
    fetch("http://44.230.115.148/api/last_excel_file", {
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
    fetch("http://44.230.115.148/api/upload_roster", requestOptions)
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
          If your tutor roster has any changes, please upload it here. This includes
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
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="myFile"
            name="filename"
            onChange={handleChange}
          />
          <input type="submit" value="Upload"/>
        </form>
      </div>
    </div>
  );
};

export default Roster;
