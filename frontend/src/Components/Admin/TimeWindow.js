import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const TimeWindow = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isOpenError, setIsOpenError] = useState("");
  const dropdownChangeHandler = (e) => {
    setBlock(e.target.value);
  };
  const [submitMessage, setSubmitMessage] = useState(null);
  const toggleIsOpen = (e) => {
    setIsOpen(!isOpen);
  };
  const [block, setBlock] = useState(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const blockList = Array.from({ length: 8 }, (_, index) => (index + 1).toString());

  useEffect(() => {
    async function fetchBlock() {
      try {
        setBlockLoading(true);
        const res = await fetch("http://44.228.177.192/api/get_block");
        const data = await res.json();
        setBlock(data.block);
      }
      catch (e) {
        setBlockError("Failed to fetch the block number. Please reload the page or contact for assistance.")
      }
      finally {
        setBlockLoading(false);
      }
    }
    fetchBlock();
  }, []);

  useEffect(() => {
    async function fetchIsOpen() {
      try {
        setIsOpenLoading(true);
        const res = await fetch("http://44.228.177.192/api/is_open");
        const data = await res.json();
        setIsOpen(data.msg === "True" ? true : false);
      }
      catch (e) {
        setIsOpenError("There was an error fetching whether the shift sign-up is currently open or not. Please reload or contact for assistance.");
      }
      finally {
        setIsOpenLoading(false);
      }
    }
    fetchIsOpen();
  }, []);

  const update = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("http://44.228.177.192/api/open_schedule", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({block: block, is_open: isOpen})
      })
      const data = await res.json();
      setSubmitMessage([data.msg, "success"]);
    }
    catch (e) {
      setSubmitMessage(["Sorry, there was an error updating these information. Please try again or contact for assistance.", "danger"])
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container bg-light">
      <div className="d-flex justify-content-center p-4">
        Please save after making changes to either the toggle switch or the block number dropdown.
      </div>

      {submitMessage && (
        <div className={`alert alert-${submitMessage[1]} alert-dismissible fade show`} role="alert">
          {submitMessage[0]}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSubmitMessage(null)}></button>
        </div>
      )}

      {(blockError ||  isOpenError) && <div style={{color: "red"}}>
        {blockError && <p>{blockError}</p>}
        {isOpenError && <p>{isOpenError}</p>}
      </div>}

      <div className="d-flex flex-column justify-content-center align-items-center">
          {
            isOpenLoading ? <p>Loading shift registration status...</p> :
            <div className="d-flex flex-row">
              <label className="pe-4">Shift registration:</label>
              <label className="pe-3">Off</label>
              <div className="form-switch form-check">
                <input role="switch" className="form-check-input" type="checkbox" onChange={toggleIsOpen} checked={isOpen}/>
              </div>
              <label className="ps-3">On</label>
            </div>
          }

          {blockLoading ? <p>Loading block number...</p> : <div className="mt-3">
            <label htmlFor="block" className="pe-2">
              Current block:
            </label>   
            <select id="block" name="block" value={block} onChange={dropdownChangeHandler}>
              {blockList.map(num => (<option value={num}>{num}</option>))}
            </select>
          </div>}
      </div>

        <button className="m-3 btn btn-info" type="button" onClick={update} disabled={submitting || isOpenLoading || blockLoading}>
          Save
        </button>
    </div>
  );
};

export default TimeWindow;
