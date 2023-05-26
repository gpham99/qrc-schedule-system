import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {
  const [isOpen, setIsOpen] = useState(0);
  const [block, setBlock] = useState(1);

  const dropdownChangeHandler = (e) => {
    setBlock(e.target.value);
  };

  const toggleChangeHandler = (e) => {
    setIsOpen(1 - isOpen);
  };

  useEffect(() => {
    fetch("http://44.230.115.148/api/get_block")
      .then((response) => response.json())
      .then((data) => {
        setBlock(data["block"]);
      });
  }, []);

  useEffect(() => {
    fetch("http://44.230.115.148/api/is_open")
      .then((response) => response.json())
      .then((data) => {
        console.log("is_open:", data);
        setIsOpen(data["msg"] === "True" ? 1 : 0);
      });
  }, []);

  const generateMasterSchedule = () => {
    fetch("http://44.230.115.148/api/generate_master_schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        block: block,
        is_open: isOpen,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className="container bg-light">
      <div className="d-flex justify-content-center p-4">
        <section>
          <p className="text-left font-weight-light font-italic">
            Please save after making changes to either the toggle switch or the block number dropdown.
          </p>
        </section>
      </div>

      <div className="pb-4 d-flex justify-content-center align-items-start">
        <div className="d-flex align-items-start">
          <label className="pr-2">Shift registration:</label>
          <input
            type="checkbox"
            checked={isOpen === 1}
            data-toggle="toggle"
            data-onstyle="success"
            data-offstyle="primary"
            onChange={toggleChangeHandler}
          />
        </div>

        <div className="pl-3">
          <label className="pr-2" htmlFor="block">
            Current block:
          </label>
          <select id="block" name="block" value={block} onChange={dropdownChangeHandler}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>

      <div className="pb-3">
        <button
          type="button"
          className="btn btn-info"
          onClick={() => {
            fetch("http://44.230.115.148/api/open_schedule", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                block: block,
                is_open: isOpen,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              });
          }}
        >
          Save
        </button>

        <button
          type="button"
          className="btn btn-info"
          onClick={generateMasterSchedule}
        >
          Generate new master schedule!
        </button>
      </div>
    </div>
  );
};

export default TimeWindow;
