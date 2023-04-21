const FileNotFound = () => {
  return (
    <div
      class="d-flex flex-column bg-info justify-content-center align-items-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div class="align-self-center">
        <h1 class="text-white display-1 font-weight-bold">404</h1>
        <div>
          <img
            class="img-fluid bg-info"
            src={require("../Images/ErrorDog.gif")}
          />
        </div>
        <h2 class="text-white m-4">Looks like you're lost</h2>
        <h5 class="text-white m-3">
          The page you are looking for is not available!
        </h5>
        <a href="https://www.coloradocollege.edu/">
          <a href="http://44.230.115.148/">
            <button class="btn btn-light m-3">Go Home</button>
          </a>
          <a
            href="http://44.230.115.148:8080/cas_logout"
            onClick={() => {
              localStorage.clear();
            }}
            class="p-3 text-white"
          >
            <button class="btn btn-light m-3">CAS Logout</button>
          </a>
        </a>
      </div>
    </div>
  );
};

export default FileNotFound;
