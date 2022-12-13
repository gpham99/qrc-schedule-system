import React from "react";

const Discipline = () => {
  return (
    <div class="container align-items-center bg-light">
      <div class="row p-4 justify-content-center">
        <p>You can add a new discipline or remove an existing one here.</p>
      </div>

      {/* add a discipline buton */}
      <div class="d-flex justify-content-end p-4">
        <a href="#">
          <button class="btn btn-info">
            <span class="p-1"> Add a new discipline </span>
          </button>
        </a>
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
