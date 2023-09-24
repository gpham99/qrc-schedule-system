import React, { useState } from "react";

const Roster = () => {
  const [file, setFile] = useState();
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    console.log("this is the file:", e.target.files[0])
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

    try {
      fetch("https://44.228.177.192/api/upload_roster", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("data: ", data);
        setSubmitMessage(data["msg"]);
      });
    }
    catch (e) {
      console.log("file too large");
    }
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
        <div className="alert alert-primary alert-dismissible" role="alert">
        {submitMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
