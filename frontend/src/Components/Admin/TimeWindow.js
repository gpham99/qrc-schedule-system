import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {
  // grab the access token from the local storage
  const accessToken = localStorage.getItem("access_token");

  const [isOpen, setIsOpen] = useState(0); // fetch from files?
  const [block, setBlock] = useState(1); // fetch from files?

  const dropdownChangeHandler = (e) => {
    setBlock(e.target.value);
  }

  const toggleChangeHandler = (e) => {
    setIsOpen(1 - isOpen);
  }

  // if access token is null, then this person is not authorized, show page 401 -> authorized state is false
  // else if they have an access token, verify first
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (accessToken === null) {
      return false;
    } else {
      return null;
    }
  });

  // useEffect(() => {
  //   if (isAuthorized !== false) {
  //     const requestOptions = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
  //       },
  //     };

  //     fetch("http://44.230.115.148:8080/api/time_window", requestOptions)
  //       .then((response) => {
  //         let res = response.json();
  //         console.log("res: ", res);
  //         return res;
  //       })
  //       .then((data) => {
  //         if ("error" in data) {
  //           setIsAuthorized(false);
  //         } else {
  //           console.log("data: ", data);
  //           if (data["start_date"] !== 1000000) {
  //             setStartDate(new Date(data["start_date"] * 1000));
  //           }
  //           if (data["end_date"] !== 1000000) {
  //             setEndDate(new Date(data["end_date"] * 1000));
  //           }
  //           setIsAuthorized(true);
  //         }
  //       });
  //   }
  // }, []);

  // func to post to database
  
  // const createTimeWindow = (e) => {
  //   // console.log(newBlock);
  //   fetch("http://44.230.115.148:8080/api/set_time_window", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "JWT " + accessToken.replace(/["]+/g, ""),
  //     },
  //     body: JSON.stringify({
  //       start_time: startDate,
  //       end_time: endDate,
  //       new_block: newBlock,
  //     }),
  //   })
  //     .then((response) => {
  //       let res = response.json();
  //       return res;
  //     })
  //     .then((data) => {
  //       console.log("data: ", data);
  //     });
  // };

  return (
    <div class="container bg-light">
      {/* description */}
      <div class="d-flex justify-content-center p-4">
        <section>
          <p class="text-left font-weight-light font-italic">
            Please save after making changes to either the toggle switch or the block number dropdown.
          </p>
        </section>
      </div>

      <div class="pb-4 d-flex justify-content-center">
          <div class="custom-control custom-switch pr-3">
            <input type="checkbox" class="custom-control-input" id="customSwitches" onChange={toggleChangeHandler}/>
            <label class="custom-control-label" for="customSwitches">Open/close shift registration</label>
          </div>

          <div class="pl-3">
            <label class="pr-2" for="block">Current block: </label>
            <select id="block" name="block" onChange={dropdownChangeHandler}>
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

      <button onClick={() => {
        console.log('current block picked: ', block);
        console.log('toggle mode: ', isOpen);
      }}>Save</button>
    </div>
  );
};

export default TimeWindow;
