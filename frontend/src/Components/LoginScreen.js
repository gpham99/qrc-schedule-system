import React from "react";

const LoginScreen = () => {
  return (
    <div
      class="d-flex flex-column justify-content-between"
      style={{ width: "100vw", height: "100vh", background: "pink" }}
    >
      <div class="h-25 bg-white d-flex justify-content-center align-items-center">
        <img class="img-fluid h-75" src={require("../Images/CClogo.jpeg")} />
      </div>

      <div class="h-75 bg-info d-flex justify-content-center align-items-center">
        <div class="bg-light p-5 shadow">
          <h3 class="p-5">Welcome to the QRC Scheduling System!</h3>
          <a href="http://52.12.35.11:8080/login">
            <button>Log in with SSO</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
