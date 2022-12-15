import React from "react";
import { useEffect, useState } from "react";

const Discipline = () => {
  // disciplines contains both the full name and the abbreviation of every discipline
  const [submitMessage, setSubmitMessage] = useState("");
  const [disciplines, setDisciplines] = useState({});
  const [disciplineName, setDisciplineName] = useState("");
  const [disciplineAbv, setDisciplineAbv] = useState("");

  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/add_remove_disciplines")
      .then((res) => res.json())
      .then((data) => {
        setDisciplines(data);
      });
  }, [disciplines]);

  const handleClick = (e) => {
    console.log(disciplineName);
    console.log(disciplineAbv);

    fetch("http://52.12.35.11:8080/api/add_discipline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: disciplineName,
        abv: disciplineAbv,
      }),
    }).then((response) => {
      let res = response.json();
      if (200 <= res.status <= 299) {
        console.log("Discipline added successfully");
        setSubmitMessage("Success");
      } else {
        console.log("Failed to add discipline");
        setSubmitMessage("Fail");
      }
    });
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
                <p5 class="align-self-center w-100">
                  Please fill out the form to add a discipline
                </p5>
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
                  <div class="form-check"></div>
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

      {submitMessage === "Fail" && (
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
                  <a href="#" class="p-2">
                    Edit
                  </a>
                  <a href="#" class="p-2">
                    Remove
                  </a>
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
