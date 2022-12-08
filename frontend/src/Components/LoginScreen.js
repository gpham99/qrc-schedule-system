import React from "react";
import { Card, Image, Button } from "react-bootstrap";

const gradient = "linear-gradient(to right, purple, pink, lavender)";

const MyImage = () => {
  return (
    <div className="d-flex flex-row align-items-center justify-content-center responsive">
      <img
        src="/Images/CClogo.jpeg"
        alt="Placeholder image"
        className="img-fluid"
        style={{ maxWidth: "65%", maxHeight: "65%" }}
      />
    </div>
  );
};

const LoginScreen = () => {
  return (
    <div>
      <MyImage />
      <div class="d-flex w-100 h-75 position-absolute bottom-0 bg-primary justify-content-center align-items-center p-3">
        <div class="bg-secondary p-5">
          <h3>Welcome to QRC Schedule System!</h3>
          <button>Click me</button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
