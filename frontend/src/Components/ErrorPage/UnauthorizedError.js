import { Card } from "react-bootstrap";

const Unauthorized = () => {
  return (
    <div
      class="d-flex flex-column bg-info justify-content-center align-items-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div class="align-self-center">
        <h1 class="text-white display-1 font-weight-bold">401</h1>
        <div>
          <img
            class="img-fluid bg-info"
            src={require("../../Images/ErrorDog.gif")}
          />
        </div>
        <h2 class="text-white m-4">Uh Oh</h2>
        <h5 class="text-white m-3">You do not have access to this page!</h5>
        <a href="https://www.coloradocollege.edu/">
          <button class="btn btn-light m-3">Go Home</button>
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
