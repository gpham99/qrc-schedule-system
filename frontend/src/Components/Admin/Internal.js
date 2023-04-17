import React from "react";
import { useState, useEffect } from "react";
import Unauthorized from "../../ErrorPages/Unauthorized";

const Internal = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  const [admins, setAdmins] = useState({});
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  var isEmailSanitized = null;
  var isNameSanitized = null;

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

      fetch("http://44.230.115.148:8080/api/get_admins", requestOptions)
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
            setAdmins(data);
          }
        });
    }
  }, [admins]);

  const handleCancel = (e) => {
    setAdminName("");
    setAdminEmail("");
  };

  const sanitizeNameInput = (adminName) => {
    for (let i = 0; i < adminName.length; i++) {
      if (
        !(
          (adminName[i].charCodeAt() >= 65 &&
            adminName[i].charCodeAt() <= 90) ||
          (adminName[i].charCodeAt() >= 97 &&
            adminName[i].charCodeAt() <= 122) ||
          adminName[i].charCodeAt() === 32 ||
          adminName[i].charCodeAt() === 45 ||
          adminName[i].charCodeAt() === 39
        )
      ) {
        return false;
      }
    }
    return true;
  };

  const sanitizeEmailInput = (adminEmail) => {
    for (let i = 0; i < adminEmail.length; i++) {
      if (
        !(
          (adminEmail[i].charCodeAt() >= 65 &&
            adminEmail[i].charCodeAt() <= 90) ||
          (adminEmail[i].charCodeAt() >= 97 &&
            adminEmail[i].charCodeAt() <= 122) ||
          (adminEmail[i].charCodeAt() >= 48 &&
            adminEmail[i].charCodeAt() <= 57) ||
          adminEmail[i].charCodeAt() === 95 ||
          adminEmail[i].charCodeAt() === 32 ||
          adminEmail[i].charCodeAt() === 64 ||
          adminEmail[i].charCodeAt() === 45 ||
          adminEmail[i].charCodeAt() === 46
        )
      ) {
        return false;
      }
    }

    if (!adminEmail.includes("@")) {
      return false;
    }

    let emailDomain = adminEmail.split("@")[1];
    if (emailDomain !== "coloradocollege.edu") {
      return false;
    }

    return true;
  };

  const removeAdmin = (cellAdminEmail) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email: cellAdminEmail,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
    };

    fetch("http://44.230.115.148:8080/api/remove_admin", requestOptions)
      .then((response) => {
        let res = response.json();
        console.log(res);
        return res;
      })
      .then((data) => {
        console.log("This is the data", data);
        if ("error" in data) {
          setIsAuthorized(false);
        }
        console.log(data);
      });
  };

  const handleClick = (e) => {
    setAdminName(adminName.trim());
    setAdminEmail(adminEmail.trim());

    isEmailSanitized = sanitizeEmailInput(adminEmail);
    isNameSanitized = sanitizeNameInput(adminName);
    // console.log("isEmailSanitized: ", isEmailSanitized);
    // console.log("isNameSanitized: ", isNameSanitized);

    if (isEmailSanitized && isNameSanitized) {
      fetch("http://44.230.115.148:8080/api/add_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
        }),
      }).then((response) => {
        let res = response.json();
      });
    } else if (isEmailSanitized) {
      alert("the name is not sanitized");
    } else if (isNameSanitized) {
      alert("the email is not sanitized");
    } else {
      alert("both the name and email are not sanitized");
    }

    setAdminName("");
    setAdminEmail("");
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
                        setAdminEmail(e.target.value);
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
                    onClick={(e) => {
                      const cellAdminEmail = val[1];
                      removeAdmin(cellAdminEmail);
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

export default Internal;
