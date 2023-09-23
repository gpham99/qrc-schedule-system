import React, { useState, useEffect } from "react";

const Roster = () => {
  const [lastUploaded, setLastUploaded] = useState([]);

  useEffect(() => {
    fetch("https://44.228.177.192/api/last_excel_file", {
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

  const [file, setFile] = useState();

  const [submitMessage, setSubmitMessage] = useState("");

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
      },
      body: formData,
    };
    fetch("https://44.228.177.192/api/upload_roster", requestOptions)
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
