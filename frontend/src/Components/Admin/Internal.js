import React from "react";
import { useState, useEffect } from "react";

// list of the adminstrators and their emails
// const admins = [
//   ["Steph Gettiburg", "s_gettiburg@coloradocollege.edu"],
//   ["Karenina Le", "k_le@coloradocollege.edu"],
// ];

const Internal = () => {
  // const [submitMessage, setSubmitMessage] = useState("");
  const [admins, setAdmins] = useState({});
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setEmail] = useState("");

  // useEffect(() => {
  //   fetch("http://52.12.35.11:5000/api/get_admins")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("This is the data", data);
  //       setAdmins(data);
  //       console.log(data);
  //     });
  // }, []);

  const handleCancel = (e) => {
    setAdminName("");
    setEmail("");
  };

  // const removeAdmin = (adminEmail) => {
  //   fetch("http://52.12.35.11:5000/api/remove_admin", {
  //     method: "POST",
  //     mode: "no-cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(adminEmail),
  //   });
  // };

  const handleClick = (e) => {
    // let isSanitized = sanitizeInput(disciplineName, disciplineAbv);
    // console.log("is it sanitized?: ", isSanitized);
    // setSanitizeCheck(isSanitized);

    // if (isSanitized === true) {
    fetch("http://52.12.35.11:5000/api/add_admin", {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: adminName,
        email: adminEmail,
      }),
    }).then((response) => {
      let res = response.json();
      console.log(res);
      // if (200 <= response.status && response.status <= 299) {
      //   console.log("Admin added successfully");
      //   // setSubmitMessage("Success");
      // } else {
      //   console.log("Failed to add admin");
      //   // setSubmitMessage("Fail");
      // }
    });
  };

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
                  onClick={handleCancel}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label>Administrator Name</label>
                    <input
                      class="form-control"
                      placeholder="Ex: Steve Getty"
                      value={adminName}
                      onChange={(e) => {
                        setAdminName(e.target.value);
                        console.log(adminName);
                      }}
                    />
                  </div>
                  <div class="form-group">
                    <label>Administrator's Email</label>
                    <input
                      class="form-control"
                      placeholder="Ex: sgetty@coloradocollege.edu"
                      value={adminEmail}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        console.log(adminEmail);
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
            {Object.values(admins).map((val) => (
              <tr>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
                <td>
                  <button
                    class="btn btn-link"
                    // onClick={(e) => {
                    //   let aEmail = val[0];
                    //   //console.log(aEmail);
                    //   removeAdmin(aEmail);
                    // }}
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

export default Internal;
