import React from "react";

const Roster = () => {
  return (
    <div class="container align-items-center bg-light">
      <div class="row p-4 justify-content-center">
        <p>If your roster has any changes, please upload it here.</p>
      </div>

      <div class="row p-4 justify-content-center">
        <a href="#">
          <button type="button" class="btn btn-info">
            View the last uploaded Excel sheet
          </button>
        </a>
      </div>

      <div class="row p-4 justify-content-center">
        <form action="#">
          <input type="file" id="myFile" name="filename" />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Roster;
