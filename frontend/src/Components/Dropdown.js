import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { StarFill } from "react-bootstrap-icons";

export const DropDown = () => {
  return (
    <div class="form-group row">
      <div class="col-md-3">
        <button class="btn btn-outline-secondary">
          <StarFill />
        </button>
      </div>
      <div class="col-md-3">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Select
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Chem</Dropdown.Item>
            <Dropdown.Item href="#/action-2">CS</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Econ</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default DropDown;
