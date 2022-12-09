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
      <div class="p-3">
        <img
          class="img-fluid"
          style={{ height: "150px" }}
          src={require("../Images/CClogo.jpeg")}
        />
      </div>

      <div
        class="d-flex w-100 h-75 position-absolute bottom-0 justify-content-center align-items-center"
        style={{ background: gradient }}
      >
        <div class="p-5" style={{ background: "#EBECF0" }}>
          <h3 class="p-5" style={{ fontWeight: "bold", color: "#5F465E" }}>
            Welcome to the QRC Scheduling System!
          </h3>
          <button
            href="http://52.12.35.11:8080/login"
            class="p-2"
            variant="outlined"
            style={{
              backgroundColor: "#5F465E",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Log in with SSO
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
