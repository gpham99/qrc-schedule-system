import React, { useState, useEffect } from "react";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  // call get_tutor_info and pass the access token as authorization header
  useEffect(() => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
    };

    fetch("http://52.12.35.11:8080/api/get_tutor_info", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("data: ", data);
        setUserInfo(data);
      });
  }, []);

  return (
    <div class="bg-light p-4 d-flex flex-column align-items-center justify-content-center">
      {/* Your personal information table */}
      <div class="d-flex flex-column justify-content-center align-items-center p-4 w-75 border border-secondary mt-3 mb-3">
        <div class="pl-3 pr-3 w-75">
          <h4>Your Personal Information</h4>
          <p class="text-left font-weight-light font-italic">
            This information is uneditable on your end. If you wish to edit any
            of the fields, please contact the QRC administrators.
          </p>
        </div>
        <div class="p-4 w-50">
          <table class="table table-borderless responsive">
            <tbody class="text-left">
              <tr>
                <td>Name:</td>
                <td>
                  <p>{userInfo["name"]}</p>
                </td>
              </tr>
              <tr>
                <td>Email address: </td>
                <td>
                  <p>{userInfo["username"]}</p>
                </td>
              </tr>
              <tr>
                <td>Availablility status this block: </td>
                <td>
                  <input
                    type="checkbox"
                    data-toggle="toggle"
                    data-size="lg"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>LA status this block: </td>
                <td>
                  <input
                    type="checkbox"
                    data-toggle="toggle"
                    data-size="lg"
                    disabled
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="d-flex flex-column justify-content-center align-items-center p-4 w-75 border border-primary mt-3 mb-3">
        <div class="pl-3 pr-3 w-75">
          <h4>Your Editable Information</h4>
          <p class="text-left font-weight-light font-italic">
            When the information is submitted successfully, the box's border
            turns green.
          </p>
        </div>

        <div class="p-4 w-75">
          <table class="table">
            <tbody class="text-left">
              <tr>
                <td>Disciplines</td>
                <td>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Mathematics
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Computer Science
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Physics
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Economics
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Molecular Biology/Chemistry
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Maximum Shift Capacity</td>
                <td>
                  <input
                    type="number"
                    id="tentacles"
                    name="tentacles"
                    min="0"
                    max="20"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <button type="button" class="btn btn-info">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
