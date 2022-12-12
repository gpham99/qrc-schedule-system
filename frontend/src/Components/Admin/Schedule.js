import { Card, Container } from "react-bootstrap";
import { useState, useEffect } from "react";

const Schedule = () => {
  const columns = [
    {
      Header: "Sunday",
      accessor: "sunday",
    },
    {
      Header: "Monday",
      accessor: "monday",
    },
    {
      Header: "Tuesday",
      accessor: "tuesday",
    },
    {
      Header: "Wednesday",
      accessor: "wednesday",
    },
    {
      Header: "Thursday",
      accessor: "thursday",
    },
  ];
  const [currentSchedule, setCurrentSchedule] = useState([]);
  useEffect(() => {
    fetch("http://52.12.35.11:8080/api/master_schedule")
      .then((res) => res.json())
      .then((data) => {
        setCurrentSchedule(data);
      });
  }, []);

  console.log(currentSchedule);

  return (
    // <div class="container p-5">
    //   <div class="row">
    //     <div class="col-md-12">
    //       <div class="table-responsive row justify-content center">
    //         <table class="table table-bordered">
    //           <thead class="table-dark">
    //             <tr>
    //               <th></th>
    //               <th>Sunday</th>
    //               <th>Monday</th>
    //               <th>Tuesday</th>
    //               <th>Wednesday</th>
    //               <th>Thursday</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             <tr>
    //               <td>2-4 PM</td>
    //               <td>{currentSchedule[0]}</td>
    //               <td>{currentSchedule[1]}</td>
    //               <td>{currentSchedule[2]}</td>
    //               <td>{currentSchedule[3]}</td>
    //               <td>{currentSchedule[4]}</td>
    //             </tr>
    //             <tr>
    //               <td>4-6 PM</td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //             </tr>
    //             <tr>
    //               <td>6-8 PM</td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //             </tr>
    //             <tr>
    //               <td>8-10 PM</td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //               <td></td>
    //             </tr>
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      {Object.keys(currentSchedule).map((cell) => (
        <p>{currentSchedule[cell]}</p>
      ))}
    </div>
  );
};

export default Schedule;
