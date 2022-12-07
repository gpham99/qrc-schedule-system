import React from "react";
import { Card, Image, Overlay, Button } from "react-bootstrap";

const gradient = "linear-gradient(to right, purple, pink, lavender)";

const LoginScreen = () => {
  return (
    <div>
      <Image
        style={{ height: "150px", margin: "30px auto" }}
        src={require('../Images/CClogo.jpeg')}
        responsive
      />
      <Card
        style={{
          margintop: "230px",
          height: "100vh",
          background: gradient,
        }}
      >
        <Card
          style={{
            transform: "translate(20%, 5%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "38%",
            background: "#EBECF0",
            width: "65%",
            padding: "60px",
            boxShadow: "3px 3px 9px #F4AAB9",
          }}
        >
          <p style={{ fontWeight: "bold", color: "#5F465E", fontSize: "275%" }}>
            Welcome to the QRC Scheduling System!
          </p>
          <div>
            <a href='http://52.12.35.11:8080/login'>
              <button
                variant="outlined"
                style={{
                  backgroundColor: "#5F465E",
                  fontWeight: "bold",
                  color: "white",
                  height: "60px",
                  width: "120px",
                  borderradius: "5px",
                  position: "absolute",
                  textAlign: "center",
                  top: "70%",
                  transform: "translate(-50%, -50%)",
                  zIndex: "1",
                }}
              >
                Log In with SSO
              </button>
            </a>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default LoginScreen;