import React from "react";
import { useState } from "react";

// list of the adminstrators and their emails
const admins = [
  ["Steph Gettiburg", "s_gettiburg@coloradocollege.edu"],
  ["Karenina Le", "k_le@coloradocollege.edu"],
];

const Internal = () => {
  // const [submitMessage, setSubmitMessage] = useState("");
  const [admins, setAdmins] = useState({});
  // const [disciplineName, setDisciplineName] = useState("");
  // const [disciplineAbv, setDisciplineAbv] = useState("");

  // useEffect(() => {
  //   fetch("http://52.12.35.11:8080/api/add_remove_disciplines")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setDisciplines(data);
  //     });
  // }, [disciplines]);

  return (
    <div class="container align-items-center bg-light">
      <div class="row p-4 justify-content-center">
        <p>
          You can add a new administrator or remove an existing adminstrator
          here.
        </p>
      </div>

      {/* add an admin buton */}
      <div class="d-flex justify-content-end p-4">
        <button
          type="button"
          class="btn btn-info"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <span class="p-1">Add an administrator</span>
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
                  Please fill out the form to add an administrator
                </p5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label>Administrator Name</label>
                    <input class="form-control" placeholder="Ex: Steve Getty" />
                  </div>
                  <div class="form-group">
                    <label>Administrator's Email</label>
                    <input
                      class="form-control"
                      placeholder="Ex: sgetty@coloradocollege.edu"
                    />
                  </div>
                  <div class="form-check"></div>
                  <button class="btn btn-info" data-dismiss="modal">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* a table to show all the current qrc admins */}
      {/* table */}
      <div class="p-4 table-responsive">
        <table class="table table-bordered table-fixed">
          <thead class="table-dark">
            <tr>
              <th class="col-sm-4">Name</th>
              <th class="col-sm-4">Email</th>
              <th class="col-sm-4">Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default Internal;
