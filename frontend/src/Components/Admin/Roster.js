import React, { useState, useEffect } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";

const Roster = () => {
  const [file, setFile] = useState([]);

  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/last_excel_file", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        let res = response.json();
        //setFile(res);
        return res;
      })
      .then((data) => {
        setFile(data);
      });
  }, []);

  const tableHeaders = file?.slice(0, 1);
  const tableData = file?.slice(1);

  return (
    <>
      <div className="container align-items-center bg-light">
        <div className="row p-4 justify-content-center"></div>
        <div className="row p-4 justify-content-center">
          <div>
            <button
              type="button"
              class="btn btn-primary"
              data-toggle="modal"
              data-target=".bd-example-modal-lg"
            >
              View the last uploaded excel file
            </button>

            <div
              class="modal fade bd-example-modal-lg responsive"
              tabindex="-1"
              role="dialog"
              aria-labelledby="myLargeModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="p-4 table-responsive">
                    <table class="table table-bordered ">
                      {console.log("headers", tableHeaders)}
                      <thead class="table-dark">
                        <tr>
                          <th class="col-sm-4">First Name</th>
                          <th class="col-sm-4">Last Name</th>
                          <th class="col-sm-4">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((tutorInfo) => (
                          <tr>
                            <td>{tutorInfo[0]}</td>
                            <td>{tutorInfo[1]}</td>
                            <td>{tutorInfo[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row p-4 justify-content-center">
          <form
            enctype="multipart/form-data"
            action="http://52.12.35.11:8080/api/upload_roster"
            method="POST"
          >
            <input type="file" id="myFile" name="filename" />
            <input type="submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Roster;
