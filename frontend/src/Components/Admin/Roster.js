import React, { useState } from "react";

const Roster = () => {
  // const [file, setFile] = useState(null);
  // const [uploadStatus, setUploadStatus] = useState("");

  // const handleFileChange = (event) => {
  //   if (event.target.files) {
  //     setFile(event.target.files[0]);
  //   }
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append("File", file);

  //   fetch("http://52.12.35.11:8080/api/upload_roster", {
  //     method: "POST",
  //     mode: "no-cors",
  //     body: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   }).then((response) => {
  //     console.log(response);
  //     // console.log("response: ", response);
  //     // response.json();
  //     // console.log("response.json: ", response.json());
  //   });
  //   // .then((result) => {
  //   //   console.log("Success:", result);
  //   // })
  //   // .catch((error) => {
  //   //   console.error("Error:", error);
  //   // });
  // };

  return (
    <div className="container align-items-center bg-light">
      <div className="row p-4 justify-content-center">
        <p>
          If your roster has any changes, please upload it here. This includes
          adding or removing a tutor.
        </p>
      </div>

      <div className="row p-4 justify-content-center">
        <a href="#">
          <button type="button" className="btn btn-info">
            View the last uploaded Excel sheet
          </button>
        </a>
      </div>

      <div className="row p-4 justify-content-center">
        <form
          enctype="multipart/form-data"
          action="http://52.12.35.11:8080/api/upload_roster"
          method="POST"
        >
          <input type="file" id="myFile" name="filename" />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Roster;
