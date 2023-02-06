import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [newBlock, setNewBlock] = useState(false);

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (isAuthorized !== false) {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
        },
      };

      fetch("http://44.230.115.148:8080/api/time_window", requestOptions)
        .then((response) => {
          let res = response.json();
          console.log("res: ", res);
          return res;
        })
        .then((data) => {
          if ("error" in data) {
            setIsAuthorized(false);
          } else {
            console.log("data: ", data);
            if (data["start_date"] !== 1000000) {
              setStartDate(new Date(data["start_date"] * 1000));
            }
            if (data["end_date"] !== 1000000) {
              setEndDate(new Date(data["end_date"] * 1000));
            }
            setIsAuthorized(true);
          }
        });
    }
  }, []);

  // func to post to database
  const createTimeWindow = (e) => {
    // console.log(newBlock);
    fetch("http://44.230.115.148:8080/api/set_time_window", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
      },
      body: JSON.stringify({
        start_time: startDate,
        end_time: endDate,
        new_block: newBlock,
      }),
    })
      .then((response) => {
        let res = response.json();
        return res;
      })
      .then((data) => {
        console.log("data: ", data);
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
        <button
          type="button"
          class="btn btn-secondary mr-3 ml-3"
          onClick={() => {
            setNewBlock(false);
            createTimeWindow();
          }}
        >
          Update the time window
        </button>
        <button
          type="button"
          class="btn btn-info mr-3 ml-3"
          onClick={() => {
            setNewBlock(true);
            createTimeWindow();
          }}
        >
          Create a new time window
        </button>
      </div>
    </div>
  );
};

export default TimeWindow;
