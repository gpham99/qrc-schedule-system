import React, { useState, useEffect } from "react";

const ScheduleSkeleton = () => {
  const [disciplineList, setDisciplineList] = useState([]);
  const [editMode, setEditMode] = useState(1);

  const changeEditMode = () => {
    setEditMode(1 - editMode);
    console.log(editMode);
  };

  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/get_disciplines")
      .then((res) => res.json())
      .then((data) => {
        setDisciplineList(data);
      });
  }, []);

  const handleCheck = (id, discipline) => {
    if (document.getElementById([id, discipline]).checked) {
      console.log("checked: " + discipline, id);
    } else {
      console.log("unchecked: " + discipline, id);
    }
  };

  //console.log("THIS IS THE LIST", disciplineList);
  // const [editMode, setEditMode] = useState(0);

  // const getDisciplines = () => {
  //   console.log("Placeholder for now");
  // };
  return (
    <>
      <div class="container align-items-center bg-light">
        {editMode === 1 ? (
          <div class="d-flex justify-content-center p-4">
            <section>
              <p class="text-left">
                You can view the current skeleton of the master schedule.
              </p>
              <p class="text-left">
                To create a new skeleton of the master schedule, go to Edit.
              </p>
              <p class="text-left font-weight-light font-italic">
                Creating a new schedule skeleton clears every tutor's current
                schedule and the master schedule.
              </p>
            </section>
          </div>
        ) : (
          <div class="d-flex justify-content-center p-4">
            <section>
              <p class="text-left">
                You can edit the skeleton of the master schedule here.
              </p>
              <p class="text-left">
                Please select all of the disciplines you would like to be listed
                on each cell.
              </p>
              <p class="text-left font-weight-light font-italic">
                Reminder: Creating a new schedule skeleton clears every tutor's
                current schedule and the master schedule.
              </p>
            </section>
          </div>
        )}

        {/* pencil button */}
        <div class="d-flex justify-content-end pl-4 pr-4">
          {editMode === 1 ? (
            <a href="#">
              <button class="btn btn-info" onClick={changeEditMode}>
                <span class="p-1"> Edit </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </a>
          ) : (
            <button className="btn btn-info" onClick={changeEditMode}>
              Cancel
            </button>
          )}
        </div>

        {/* uneditable skeleton of master schedule */}
        <div class="p-4 table-responsive">
          <table class="table table-bordered">
            <thead class="table-dark">
              <tr>
                <th class="col-sm-2"></th>
                <th class="col-sm-2">Sunday</th>
                <th class="col-sm-2">Monday</th>
                <th class="col-sm-2">Tuesday</th>
                <th class="col-sm-2">Wednesday</th>
                <th class="col-sm-2">Thursday</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2-4 PM</td>
                {editMode === 0 ? (
                  <>
                    {[0, 1, 2, 3, 4].map((val) => (
                      <td key={val}>
                        <div class="d-flex flex-column">
                          {disciplineList.map((discipline) => (
                            <div class="form-check flex-row btn-group">
                              <>
                                <p class="font-weight-bold">{discipline}</p>
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id={[val, discipline]}
                                  onClick={(e) => handleCheck(val, discipline)}
                                />
                              </>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </>
                ) : (
                  <div>No</div>
                )}
              </tr>

              <tr>
                <td>4-6 PM</td>
                {editMode === 0 ? (
                  <>
                    {[5, 6, 7, 8, 9].map((val) => (
                      <td key={val}>
                        <div class="d-flex flex-column">
                          {disciplineList.map((discipline) => (
                            <div class="form-check flex-row btn-group">
                              <>
                                <p class="font-weight-bold">{discipline}</p>
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id={[val, discipline]}
                                  onClick={(e) => handleCheck(val, discipline)}
                                />
                              </>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </>
                ) : (
                  <div>No</div>
                )}
              </tr>
              <tr>
                <td>6-8 PM</td>
                {editMode === 0 ? (
                  <>
                    {[10, 11, 12, 13, 14].map((val) => (
                      <td key={val}>
                        <div class="d-flex flex-column">
                          {disciplineList.map((discipline) => (
                            <div class="form-check flex-row btn-group">
                              <>
                                <p class="font-weight-bold">{discipline}</p>
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id={[val, discipline]}
                                  onClick={(e) => handleCheck(val, discipline)}
                                />
                              </>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </>
                ) : (
                  <div>No</div>
                )}
              </tr>
              <tr>
                <td>8-10 PM</td>
                {editMode === 0 ? (
                  <>
                    {[15, 16, 17, 18, 19].map((val) => (
                      <td key={val}>
                        <div class="d-flex flex-column">
                          {disciplineList.map((discipline) => (
                            <div class="form-check flex-row btn-group">
                              <>
                                <p class="font-weight-bold">{discipline}</p>
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id={[val, discipline]}
                                  onClick={(e) => handleCheck(val, discipline)}
                                />
                              </>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </>
                ) : (
                  <div>No</div>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ScheduleSkeleton;
