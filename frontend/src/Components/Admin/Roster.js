import React, { useState } from "react";

const Roster = () => {
  const handleSubmit = (event) => {
    console.log("hi");
    event.preventDefault();
  };

  return (
    <div class="container align-items-center bg-light">
      <div class="row p-4 justify-content-center">
        <p>
          If your roster has any changes, please upload it here. This includes
          adding or removing a tutor.
        </p>
      </div>

      <div class="row p-4 justify-content-center">
        <a href="#">
          <button type="button" class="btn btn-info">
            View the last uploaded Excel sheet
          </button>
        </a>
      </div>

      <div class="row p-4 justify-content-center">
        <form onSubmit={handleSubmit}>
          <input type="file" id="myFile" name="filename" />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Roster;
