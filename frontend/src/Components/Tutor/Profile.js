import React, { useState, useEffect } from "react";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [maximumShiftCapacity, setMaximumShiftCapacity] = useState(0);
  const [personalDisciplines, setPersonalDisciplines] = useState([]);
  const [edittedPersonalDisciplines, setEditedPersonalDisciplines] = useState(
    []
  );
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [laStatus, setLaStatus] = useState(null);

  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  // call /api/tutor/get_info and pass the access token as authorization header
  useEffect(() => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
    };

    fetch("http://52.12.35.11:8080/api/tutor/get_info", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        setUserInfo(data);
        setMaximumShiftCapacity(data["shift_capacity"]);
        setPersonalDisciplines(data["disciplines"]);
        setEditedPersonalDisciplines({ ...data["disciplines"] });
        setAvailabilityStatus(data["this_block_unavailable"]);
        setLaStatus(data["this_block_la"]);
      });
  }, []);

  // the function to handle the update button
  const handleUpdate = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify({
        shift_capacity: maximumShiftCapacity,
        disciplines: edittedPersonalDisciplines,
      }),
    };

    fetch("http://52.12.35.11:8080/api/tutor/update_info", requestOptions)
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log(data);
      });
  };

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
                <td>Unavailable this block: </td>
                <td>
                  <input
                    type="checkbox"
                    data-toggle="toggle"
                    data-size="lg"
                    checked={availabilityStatus}
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
                    checked={laStatus}
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
                  {personalDisciplines.map((discipline, index) => (
                    <div class="form-check" key={index}>
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        checked={edittedPersonalDisciplines[index][1]}
                        onChange={(e) => {
                          let edittedPersonalDisciplinesCopy = {
                            ...edittedPersonalDisciplines,
                          };
                          edittedPersonalDisciplinesCopy[index][1] =
                            !edittedPersonalDisciplinesCopy[index][1];
                          setEditedPersonalDisciplines(
                            edittedPersonalDisciplinesCopy
                          );
                        }}
                      />
                      <label class="form-check-label">{discipline[0]}</label>
                    </div>
                  ))}
                </td>
              </tr>
              <tr>
                <td>Maximum Shift Capacity</td>
                <td>
                  <input
                    min="0"
                    max="20"
                    value={maximumShiftCapacity}
                    onChange={(e) => {
                      e.preventDefault();
                      setMaximumShiftCapacity(e.target.value);
                    }}
                    type="range"
                    class="form-range"
                    step="1"
                  />
                  <label class="pl-3">{maximumShiftCapacity}</label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <button type="submit" class="btn btn-info" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
