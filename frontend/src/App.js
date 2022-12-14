import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Admin from "./Components/Admin";
import Tutor from "./Components/Tutor";
import Schedule from "./Components/Admin/Schedule";
import ErrorPage from "./Components/ErrorPage/FileNotFoundError";
import FileNotFound from "./Components/ErrorPage/FileNotFoundError";
import Unauthorized from "./Components/ErrorPage/UnauthorizedError";

function App() {
  // const [currentSchedule, setCurrentSchedule] = useState([]);
  // useEffect(() => {
  //   fetch("http://52.12.35.11:8080/api/master_schedule")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCurrentSchedule(data);
  //     });
  // }, []);

  // console.log(currentSchedule);

  return (
    <div className="App">
      <FileNotFound></FileNotFound>
      <div>
        {/* <MyComponent></MyComponent> */}
        {/* <datePicker /> */}
        {/* <Routes>
              <Route path="/admin/*" element={<Admin />}></Route>
              <Route path="/tutor/*" element={<Tutor></Tutor>}></Route>
              <Route path="/" element={<Home></Home>}></Route>
            </Routes> */}
      </div>
    </div>
  );
}

export default App;
