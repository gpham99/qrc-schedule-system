import React from "react";
import { useState, useEffect } from "react";

const Internal = () => {

  const [admins, setAdmins] = useState({});
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  var isEmailSanitized = null;
  var isNameSanitized = null;

  useEffect(() => {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch("https://44.228.177.192/api/get_admins", requestOptions)
        .then((response) => {
          let res = response.json();
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            setAdmins(null);
          } else {
            setAdmins(data);
          }
        });
    }
, [admins]);

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
      },
    };

    fetch("https://44.228.177.192/api/remove_admin", requestOptions)
      .then((response) => {
        let res = response.json();
        console.log(res);
        return res;
      })
      .then((data) => {
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
      fetch("https://44.228.177.192/api/add_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
        }),
      }).then((response) => {
      });
    } else if (isEmailSanitized) {
      alert("The name is not sanitized");
    } else if (isNameSanitized) {
      alert("The email is not sanitized");
    } else {
      alert("Both the name and email are not sanitized");
    }

    setAdminName("");
    setAdminEmail("");
  };

  return (
    <div className="container align-items-center bg-light">
      <div className="row p-4 justify-content-center">
        <p>
          You can add a new administrator or remove an existing adminstrator
          here.
        </p>
      </div>

      <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#addAdmin">
        Add an administrator
      </button>

        <div
          className="modal fade"
          id="addAdmin"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="addAdminLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title align-self-center w-100" id="exampleModalLabel">
                  Please fill out the form to add an administrator.
                </p>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel}></button>
              </div>

              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Administrator Name</label>
                    <input
                      className="form-control"
                      placeholder="Ex: Steve Getty"
                      value={adminName}
                      onChange={(e) => {
                        setAdminName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Administrator's Email</label>
                    <input
                      className="form-control"
                      placeholder="Ex: sgetty@coloradocollege.edu"
                      value={adminEmail}
                      onChange={(e) => {
                        setAdminEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-check"></div>
                  <button
                    className="btn btn-info"
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

      <div className="p-4 table-responsive">
        <table className="table table-bordered table-fixed">
          <thead className="table-dark">
            <tr>
              <th className="col-sm-4">Name</th>
              <th className="col-sm-4">Email</th>
              <th className="col-sm-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(admins).map((val) => (
              <tr key={val[0]}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
                <td>
                  <button
                    className="btn btn-link"
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
