import React from "react";
import { useSearchParams } from "react-router-dom";

const Schedule = () => {
  const [searchParams] = useSearchParams();
  console.log(
    "username extracted from search param: ",
    searchParams.get("username")
  );

  return (
    <div class="container align-items-center bg-light">
      <div class="d-flex justify-content-center p-4">
        <section>
          <p class="text-left">
            This is your personalized QRC schedule this block.
          </p>
          <p class="text-left">
            You can only edit your schedule within the shift registration time
            window set by the QRC adminstrators.
          </p>
        </section>
      </div>

      {/* pencil button */}
      {/* <div class="d-flex justify-content-end pl-4 pr-4">
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
      </div> */}

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
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>4-6 PM</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>6-8 PM</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>8-10 PM</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
