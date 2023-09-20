import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {
  const [isOpen, setIsOpen] = useState(0);
  const [block, setBlock] = useState(1);

  const dropdownChangeHandler = (e) => {
    setBlock(e.target.value);
  };

  const [submitMessage, setSubmitMessage] = useState("");

  const toggleChangeHandler = (e) => {
    setIsOpen(1 - isOpen);
    console.log("toggled!", isOpen)
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
        setIsOpen(data["msg"] === "True" ? 1 : 0);
      });
  }, []);

  const generateMasterSchedule = () => {
    fetch("http://44.230.115.148/api/regenerate_schedule", {
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
        setSubmitMessage(data["msg"]);
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
      {submitMessage.length > 0 && (
        <div
          class="alert alert-primary m-4 alert-dismissible fade show"
          role="alert"
        >
          {submitMessage}
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <div className="pb-4 d-flex justify-content-center align-items-start">
        <div className="pr-3 d-flex flex-row align-items-start">
          <div className="pr-4">Shift registration: </div> {" "}
          <div className="pr-3">Closed</div> {" "}
          <div className="form-switch form-check">
            <input role="switch" className="form-check-input" type="checkbox" onChange={toggleChangeHandler} checked={isOpen === 1}/>
          </div> 
          <div className="pl-3"> Open</div>{"   "}<div className="pl-3"> </div>
          <label className="pr-2" htmlFor="block">
            Current block: {" "} </label>
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
                setSubmitMessage(data["msg"]);
              });
          }}
        >
          Save
        </button>  <button
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
