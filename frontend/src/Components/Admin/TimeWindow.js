import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [newBlock, setNewBlock] = useState(false);

  // func to post to database
  const createTimeWindow = () => {
    fetch("http://52.12.35.11:5000/api/set_time_window", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sTime: startDate,
        eTime: endDate,
        nBlock: newBlock,
      }),
    });
  };

  return (
    <div class="container bg-light">
      {/* description */}
      <div class="d-flex justify-content-center p-4">
        <section>
          <p class="text-left">
            The start and end date signal the time window in which shift
            registration can be performed.
          </p>
          <p class="text-left">
            The default dates are the most recently used start and end date.
          </p>
          <p class="text-left font-weight-light font-italic">
            "Create a new time window" updates the time window and the current
            block number
          </p>
          <p class="text-left font-weight-light font-italic">
            "Update the time window" only updates the time window.
          </p>
        </section>
      </div>

      <div class="d-flex flex-row justify-content-center p-4">
        <div class="d-flex flex-row p-3">
          <p class="pr-3">Start date: </p>
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
            />
          </div>
        </div>

        <div class="d-flex flex-row p-3">
          <p class="pr-3">End date: </p>
          <div>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
            />
          </div>
        </div>
      </div>
      <div class="pb-4 d-flex justify-content-center">
        <button type="button" class="btn btn-secondary mr-3 ml-3">
          Update the time window
        </button>
        <button type="button" class="btn btn-info mr-3 ml-3">
          Create a new time window
        </button>
      </div>
    </div>
  );
};

export default TimeWindow;
