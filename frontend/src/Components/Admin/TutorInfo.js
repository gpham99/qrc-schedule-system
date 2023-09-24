import React, { useEffect, useState } from "react";

const TutorInfo = () => {
  const [tutors, setTutors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const loadingErrorMessage = `We've encountered an issue while loading the tutors' statuses in this block.
  Please try again, and if the problem persists, feel free to contact us for further assistance.
  If you need to view the previous status of the table, you can simply reload the page.`
  const submittingErrorMessage = `
  Failed to save the changes in the table.
  Please try again or contact support for assistance.
  If you need to view the previous status of the table, you can simply reload the page.
  `

  useEffect(() => {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      async function fetchTutors() {
        try {
          setLoading(true);
          const res = await fetch("https://44.228.177.192/api/get_tutors_information", requestOptions);
          const data = await res.json();
          setTutors(data);
        }
        catch (e) {
          setError(loadingErrorMessage);
        }
        finally {
          setLoading(false);
        }
      }
      fetchTutors();
    }
  , []);

  const handleChange = (key, typeOfChange) => {
    const tutorsCopy = {...tutors};
    tutorsCopy[key][typeOfChange] = !tutorsCopy[key][typeOfChange];
    setTutors(tutorsCopy);
  }

  const submitChange = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tutors),
    };

    try {
      setSubmitting(true);
      const res = await fetch("https://44.228.177.192/api/set_tutors_information", requestOptions);
      if (res.status === 200) {
        setSuccess("Changes were saved to the database successfully!");
      }
      else {
        setSubmitError(submittingErrorMessage);
      }
    }
    catch (e) {
      setSubmitError(submittingErrorMessage);
    }
    finally {
      setSubmitting(false);
    }
  };

  const clearAll = () => {
    const tutorsCopy = { ...tutors };
    for (const tutorKey in tutorsCopy) {
      if (tutorsCopy.hasOwnProperty(tutorKey)) {
        tutorsCopy[tutorKey].absence = false;
        tutorsCopy[tutorKey].this_block_la = false;
        tutorsCopy[tutorKey].this_block_unavailable = false;
      }
    }
    setTutors(tutorsCopy);
  }

  const clearLAStatus = () => {
    const tutorsCopy = { ...tutors };
    for (const tutorKey in tutorsCopy) {
      if (tutorsCopy.hasOwnProperty(tutorKey)) {
        tutorsCopy[tutorKey].this_block_la = false;
      }
    }
    setTutors(tutorsCopy);
  }

  const clearUnavailable = () => {
    const tutorsCopy = { ...tutors };
    for (const tutorKey in tutorsCopy) {
      if (tutorsCopy.hasOwnProperty(tutorKey)) {
        tutorsCopy[tutorKey].this_block_unavailable = false;
      }
    }
    setTutors(tutorsCopy);
  }

  const clearAbsence = () => {
    const tutorsCopy = { ...tutors };
    for (const tutorKey in tutorsCopy) {
      if (tutorsCopy.hasOwnProperty(tutorKey)) {
        tutorsCopy[tutorKey].absence = false;
      }
    }
    setTutors(tutorsCopy);
  }
  
  if (error) return <div className="container bg-light p-4">There was an error loading the table. Please reload to try again or contact for support.</div>

  if (loading) return <div className="d-flex flex-column justify-content-center align-items-center bg-light p-4">
    <div className="spinner-border text-info mb-4" role="status"></div>
    <span>Loading Tutor Status table, please wait...</span>
    </div>

  return (
    <div>
    <div className="container bg-light p-4">
      <div className="d-flex flex-column align-items-start">Notice:
      <p>- Remember, changes won't be saved until you click 'Save Changes'.</p>
      <p>- If you don't like your changes and haven't saved them, refresh the page to start over. Your unsaved edits will be discarded.</p>
      </div>

      <div className="d-flex justify-content-between p-4">
          <button type="button" className="btn btn-info" onClick={() => {
            submitChange();
            setSubmitError("");
            setError("");
            setSuccess("");
          }} disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="btn btn-warning" disabled={submitting} onClick={clearAll}>Clear All</button>
      </div>

      <div className="d-flex flex-row justify-content-end">
          <button type="button" className="btn btn-link" onClick={clearLAStatus}>Clear LA Status</button>
          <button type="button" className="btn btn-link" onClick={clearUnavailable}>Clear Unavailable</button>
          <button type="button" className="btn btn-link" onClick={clearAbsence}>Clear Unexcused Absence</button>
      </div>

      {submitError && 
      <div className="alert alert-danger alert-dismissible" role="alert">
        {submitError}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}

      {success && 
      <div className="alert alert-success alert-dismissible" role="alert">
        {success}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}

      <div style={{overflowY: "auto", height: "600px"}}>
        <table className="table table-bordered">
          <thead className="table-dark" style={{position: "sticky", top: -2}}>
            <tr>
              <th className="col-sm-3">Tutor</th>
              <th className="col-sm-3">LA Status</th>
              <th className="col-sm-3">Unavailable</th>
              <th className="col-sm-3">Unexcused Absence</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tutors).map((key) => (
              <tr key={key}>
                <td>{tutors[key]["name"]}</td>
                <td>
                  {
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={tutors[key]["this_block_la"]}
                      disabled={submitting}
                      onChange={() => handleChange(key, "this_block_la")}
                    />
                  }
                </td>
                <td>
                  {
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={tutors[key]["this_block_unavailable"]}
                      disabled={submitting}
                      onChange={() => handleChange(key, "this_block_unavailable")}
                    />
                  }
                </td>
                <td>
                  {
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={tutors[key]["absence"]}
                      disabled={submitting}
                      onChange={() => handleChange(key, "absence")}
                    />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default TutorInfo;