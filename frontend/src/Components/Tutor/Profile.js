import React from "react";

const Profile = () => {
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
          <table class="table table-borderless">
            <tbody class="text-left">
              <tr>
                <td>Name: </td>
                <td>John Doe</td>
              </tr>
              <tr>
                <td>Email address: </td>
                <td>j_doe@coloradocollege.edu</td>
              </tr>
              <tr>
                <td>Availablility status this block: </td>
                <td>True</td>
              </tr>
              <tr>
                <td>LA status this block: </td>
                <td>True</td>
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

    // <div
    //   class="d-flex flex-column align-items-center justify-content-center responsive p-5"
    //   style={{ height: "100vh", width: "100vw" }}
    // >
    //   <h1 class="m-5">Tutor's Profile</h1>
    //   <div
    //     class="bg-secondary p-4 d-flex justify-content-center flex-column"
    //     style={{ height: "60%", width: "60%" }}
    //   >
    //     <p1 class="text-white m-5">
    //       Please select the maximum number of shifts you'd like to take along
    //       with the majors that you can tutor for.
    //     </p1>
    //     <div class="d-flex justify-content-center">
    //       <h3 class="text-white m-3">Maximum Shift Capacity:</h3>
    //       <form class=" m-3" style={{ width: "15%" }}>
    //         <input type="text" class="form-control" placeholder="#" />
    //       </form>
    //     </div>

    //     <div class="d-flex justify-content-center">
    //       <h3 class="text-white m-5">Disciplines:</h3>
    //       <div class="d-flex p-5 flex-column">
    //         <div class="form-check">
    //           <input
    //             class="form-check-input"
    //             type="checkbox"
    //             value=""
    //             id="flexCheckDefault"
    //           />
    //           <label class="form-check-label" for="flexCheckDefault">
    //             Math
    //           </label>
    //         </div>
    //         <div class="form-check">
    //           <input
    //             class="form-check-input"
    //             type="checkbox"
    //             value=""
    //             id="flexCheckDefault"
    //           />
    //           <label class="form-check-label" for="flexCheckDefault">
    //             CS
    //           </label>
    //         </div>
    //         <div class="form-check">
    //           <input
    //             class="form-check-input"
    //             type="checkbox"
    //             value=""
    //             id="flexCheckDefault"
    //           />
    //           <label class="form-check-label" for="flexCheckDefault">
    //             Econ
    //           </label>
    //         </div>
    //         <div class="form-check">
    //           <input
    //             class="form-check-input"
    //             type="checkbox"
    //             value=""
    //             id="flexCheckDefault"
    //           />
    //           <label class="form-check-label" for="flexCheckDefault">
    //             CH/MB
    //           </label>
    //         </div>
    //         <div class="form-check">
    //           <input
    //             class="form-check-input"
    //             type="checkbox"
    //             value=""
    //             id="flexCheckDefault"
    //           />
    //           <label class="form-check-label" for="flexCheckDefault">
    //             Physics
    //           </label>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Profile;
