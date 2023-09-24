import React, { useState } from "react";

const Roster = () => {
  const [file, setFile] = useState();
  const [result, setResult] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileLimit = 1572864; // 1.5MB in bytes

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file.size > fileLimit) {
      setResult(["File size must be under 1.5MB.", "danger"]);
      return;
    }
    setFile(file);
    setIsValid(true);
  };

  const handleSubmit = async (e) => {
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
      setSubmitting(true);
      const res = await fetch("https://44.228.177.192/api/upload_roster", requestOptions);
      const data = await res.json();
      if (res.status === 200) {
        if (data.msg.includes("Error")) {
          setResult([data.msg, "danger"]);
        }
        else {
          setResult([data.msg, "success"]);
        }
      }
      else {
        setResult([data.msg, "danger"]);
      }
    }
    catch (e) {
      setResult(["File upload error. Retry with correct format and <1.5MB file size or contact for assistance.", "danger"]);
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container align-items-center bg-light p-4">
      <div className="d-flex flex-column align-items-start">
        <p>- If you've made any changes to the tutor list, please upload them here. This includes adding or removing tutors.</p>
        <p>- To see your existing roster, please go to the Tutor Status tab.</p>
      </div>

      {result && (
        <div className={`alert alert-${result[1]} alert-dismissible fade show`} role="alert">
          {result[0]}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setResult(null)}></button>
        </div>
      )}

      <div className="row p-4 justify-content-center">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="myFile"
            name="filename"
            onChange={handleChange}
            disabled={submitting}
          />
          <input type="submit" value={submitting ? "Uploading..." : "Upload"} disabled={!isValid || submitting}/>
        </form>
      </div>
    </div>
  );
};

export default Roster;