import React from "react";

// list of the adminstrators and their emails
const admins = [
  ["Steph Gettiburg", "s_gettiburg@coloradocollege.edu"],
  ["Karenina Le", "k_le@coloradocollege.edu"],
];

const Internal = () => {
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
        <a href="#">
          <button class="btn btn-info">
            <span class="p-1"> Add a new administrator </span>
          </button>
        </a>
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
          <tbody>
            {admins.map((admin) => (
              <tr>
                {admin.map((admin_info) => (
                  <td class="text-left">{admin_info}</td>
                ))}
                <td>
                  <a href="#">Remove</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Internal;
