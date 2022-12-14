import React from "react";

var Name = "";
var Abv = "";

function HandleName(event) {
  event.preventDefault();
  Name = event.target.value;
}

function HandleAbv(event) {
  event.preventDefault();
  Abv = event.target.value;
}

function OnSubmit(event) {
  event.preventDefault();
  console.log(Name);
  console.log(Abv);
}

const Discipline = () => {
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
          <span class="p-1"> Add a new discipline </span>
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
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label>Name</label>
                    <input
                      class="form-control"
                      name="NameInput"
                      onChange={HandleName}
                    />
                  </div>
                  <div class="form-group">
                    <label>Abbreviation</label>
                    <input
                      class="form-control"
                      name="AbvInput"
                      onChange={HandleAbv}
                    />
                  </div>
                  <div class="form-check"></div>
                  <button
                    type="submit"
                    class="btn btn-primary bg-info"
                    onClick={OnSubmit}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <tr>
              <td>Mathematics</td>
              <td>M</td>
              <td>
                <a href="#" class="p-2">
                  Edit
                </a>
                <a href="#" class="p-2">
                  Remove
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Discipline;
