import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Admin from "./Components/Admin";
import Tutor from "./Components/Tutor";
import FileNotFound from "./ErrorPages/FileNotFound";
import Unauthorized from "./ErrorPages/Unauthorized";

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/admin/*" element={<Admin />}></Route>
          <Route path="/tutor/*" element={<Tutor></Tutor>}></Route>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="*" element={<FileNotFound></FileNotFound>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
