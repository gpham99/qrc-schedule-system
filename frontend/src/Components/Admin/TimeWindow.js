import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {

  const [isOpen, setIsOpen] = useState(0);
  const [block, setBlock] = useState(1);

  const dropdownChangeHandler = (e) => {
    setBlock(e.target.value);
  }

  const toggleChangeHandler = (e) => {
    setIsOpen(1 - isOpen);
  }

  useEffect(() => {
    fetch("http://44.230.115.148:8080/api/get_block").then((response) => {
      let res = response.json();
      console.log("res: ", res);
      return res;
    }).then(data => {
      console.log("data ne:", data);
    })
  }, [])

  // useEffect(() => {
  //     const requestOptions = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       }
  //     }

  //     fetch("http://44.230.115.148:8080/api/get_block", requestOptions)
  //       .then((response) => {
  //         let res = response.json();
  //         console.log("res: ", res);
  //         return res;
  //       })
  //       .then((data) => {
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
      <div class="d-flex justify-content-center p-4">
        <section>
          <p class="text-left font-weight-light font-italic">
            Please save after making changes to either the toggle switch or the block number dropdown.
          </p>
        </section>
      </div>

      <div class="pb-4 d-flex justify-content-center align-items-start">
        <div class="d-flex align-items-start">
          <label class="pr-2">Shift registration:</label>
          <input type="checkbox" data-toggle="toggle" data-onstyle="success" data-offstyle="primary" onChange={toggleChangeHandler}/>
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
              .then((response) => {
                let res = response.json();
                return res;
              })
              .then((data) => {
                console.log(data);
              });
            }}
          >
            Save
          </button>
          </div>
    </div>
  );
};

export default TimeWindow;
