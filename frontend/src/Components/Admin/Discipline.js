import React from "react";
import { useEffect, useState } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";

const Discipline = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  // disciplines contains both the full name and the abbreviation of every discipline
  const [sanitizeCheck, setSanitizeCheck] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");
  const [disciplines, setDisciplines] = useState({});
  const [disciplineName, setDisciplineName] = useState("");
  const [disciplineAbv, setDisciplineAbv] = useState("");

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (isAuthorized !== false) {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
      };

      fetch("http://44.230.115.148:8080/api/fetch_disciplines", requestOptions)
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
            setDisciplines(data);
          }
        });
    }
  }, [disciplines]);

  const removeDiscipline = (dName) => {
    fetch("http://44.230.115.148:8080/api/remove_discipline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify({
        disciplineName: dName,
      }),
    });
  };

  const sanitizeInput = (disciplineName, disciplineAbv) => {
    disciplineName = disciplineName.trim();
    disciplineAbv = disciplineAbv.trim();

    for (let i = 0; i < disciplineName.length; i++) {
      if (
        !(
          (disciplineName[i].charCodeAt() >= 65 &&
            disciplineName[i].charCodeAt() <= 90) ||
          (disciplineName[i].charCodeAt() >= 97 &&
            disciplineName[i].charCodeAt() <= 122) ||
          disciplineName[i].charCodeAt() === 32 ||
          disciplineName[i].charCodeAt() === 47
        )
      ) {
        return false;
      }
    }

    for (let i = 0; i < disciplineAbv.length; i++) {
      if (
        !(
          (disciplineAbv[i].charCodeAt() >= 65 &&
            disciplineAbv[i].charCodeAt() <= 90) ||
          (disciplineAbv[i].charCodeAt() >= 97 &&
            disciplineAbv[i].charCodeAt() <= 122) ||
          disciplineAbv[i].charCodeAt() === 32 ||
          disciplineAbv[i].charCodeAt() === 47
        )
      ) {
        return false;
      }
    }

    return true;
  };

  const handleClick = (e) => {
    let isSanitized = sanitizeInput(disciplineName, disciplineAbv);
    setSanitizeCheck(isSanitized);
    if (isSanitized === true) {
      fetch("http://44.230.115.148:8080/api/add_discipline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
        body: JSON.stringify({
          name: disciplineName,
          abv: disciplineAbv,
        }),
      })
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          setSubmitMessage(data["msg"]);
        });

      setDisciplineName("");
      setDisciplineAbv("");
    }
  };

  const handleCancel = (e) => {
    setDisciplineAbv("");
    setDisciplineName("");
  };

  return (
    <div class="container align-items-center bg-light">
      <div class="row p-4 justify-content-center">
        <p>You can add a new discipline or remove an existing one here.</p>
      </div>

      <div class="row justify-content-center">
        <p>NOTE: if you remove a discipline during a block, the change may
          cause bugs or unexpected behavior. It is recommended that you only
          remove disciplines outside the school year or during the time
          window for availability selection.</p>
      </div>

      <div class="d-flex justify-content-end p-4">
        <button
          type="button"
          class="btn btn-info"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <span class="p-1">Add a new discipline</span>
        </button>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <p5 class="align-self-center w-100">Add a discipline</p5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCancel}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label>Discipline Name</label>
                    <input
                      class="form-control"
                      value={disciplineName}
                      placeholder="Ex: Mathematics"
                      onChange={(e) => {
                        setDisciplineName(e.target.value);
                      }}
                    />
                  </div>
                  <div class="form-group">
                    <label>Discipline Abbreviation</label>
                    <input
                      class="form-control"
                      value={disciplineAbv}
                      placeholder="Ex: M"
                      onChange={(e) => {
                        setDisciplineAbv(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    class="btn btn-info"
                    data-dismiss="modal"
                    onClick={handleClick}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {submitMessage === "Success" && (
        <div
          class="alert alert-success m-4 alert-dismissible fade show"
          role="alert"
        >
          Discipline added successfully!
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

      {submitMessage !== "Success" && submitMessage !== "" && (
        <div
          class="alert alert-warning m-4 alert-dismissible fade show"
          role="alert"
        >
          Failed to add discipline.
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

      {sanitizeCheck === false && (
        <div class="alert alert-warning fade show m-4" role="alert">
          <div class="justify-content-end">
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="pt-3 text-center">
            <p>
              <strong>Error: Discipline not added.</strong>
            </p>
            <p>
              You may only use alphabetical characters, slash "/", or space " "
              for the discipline name and its abbreviation.
            </p>
          </div>
        </div>
      )}

      {/* a table to show all the current disciplines */}
      {/* table */}
      <div class="p-4 table-responsive">
        <table class="table table-bordered table-fixed">
          <thead class="table-dark">
            <tr>
              <th class="col-sm-4">Discipline</th>
              <th class="col-sm-4">Abbreviation</th>
              <th class="col-sm-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(disciplines).map((val) => (
              <tr>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
                <td>
                  <button
                    class="btn btn-link"
                    onClick={(e) => {
                      let dName = val[0];
                      removeDiscipline(dName);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Discipline;
