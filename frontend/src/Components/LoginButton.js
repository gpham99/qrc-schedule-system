import React from "react";
import { Card, Image, Overlay } from "react-bootstrap";

const gradient = "linear-gradient(to right, purple, pink, lavender)";

const LoginButton = () => {
  return (
    <div>
      <Image
        style={{ height: "150px", margin: "30px auto" }}
        src="/Images/CClogo.jpeg"
        responsive
      />
      <button
        style={{
          backgroundColor: "gray",
          border: "2px solid black",
          position: "absolute",
          top: "66.666666%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Click me!
      </button>
      <Card
        style={{
          margintop: "230px",
          height: "100vh",
          background: gradient,
        }}
      ></Card>
    </div>
  );
};

export default LoginButton;
