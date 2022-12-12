import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Admin from "./Components/Admin";
import Tutor from "./Components/Tutor";
import Schedule from "./Components/Admin/Schedule";

function App() {
  // const [currentSchedule, setCurrentSchedule] = useState([]);
  // useEffect(() => {
  //   fetch("http://52.12.35.11:8080/api/master_schedule")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCurrentSchedule(data);
  //     });
  // }, []);

  return (
    <Schedule></Schedule>
    //     <div className="App">
    //       <div class="d-flex flex-column">
    //         The master schedule is {currentSchedule}.
    //       </div>
    //       <div>
    //         {/* <MyComponent></MyComponent> */}
    //         {/* <datePicker /> */}
    //         {/* <Routes>
    //           <Route path="/admin/*" element={<Admin />}></Route>
    //           <Route path="/tutor/*" element={<Tutor></Tutor>}></Route>
    //           <Route path="/" element={<Home></Home>}></Route>
    //         </Routes> */}
    //       </div>
    //     </div>
  );
}

export default App;
