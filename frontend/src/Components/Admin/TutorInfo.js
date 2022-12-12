import React from "react";

// true is 1 and false is 0
const lst2 = [
  ["a", 1, 0],
  ["b", 0, 1],
];

const TutorInfo = () => {
  return (
    <div class="container bg-light p-4">
      {/* title and description */}
      <div class="d-flex justify-content-center p-4">
        <section>
          <p class="text-left">
            You can view the tutor's current Availablility status and LA status.
          </p>
          <p class="text-left">
            To make any changes, click on the pencil icon.
          </p>
        </section>
      </div>
      {/* pencil button */}
      <div class="d-flex justify-content-end p-4">
        <a href="#">
          <button class="btn btn-info">
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
      </div>
      {/* table */}
      <div class="p-4 table-responsive">
        <table class="table table-bordered table-fixed">
          <thead class="table-dark">
            <tr>
              <th class="col-sm-4">Tutor</th>
              <th class="col-sm-4">LA Status</th>
              <th class="col-sm-4">Availablility Status</th>
            </tr>
          </thead>
          <tbody>
            {/* lets take a fake example of what we are able to fetch */}

            {lst2.map((subarr) => (
              <tr>
                {subarr.map((item) => (
                  <td>
                    {item == 0 && (
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDisabled"
                        disabled
                      />
                    )}
                    {item == 1 && (
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled"
                        checked
                        disabled
                      />
                    )}
                    {item != 1 && item != 0 && item}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorInfo;
