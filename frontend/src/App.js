import React, { useContext, useEffect } from "react";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
// import { useNavigate } from "react-router-dom";
// import CasClient, { constant } from "react-cas-client";

import useCas from "./useCas";

const SecureHome = () => {
  return <div>Secure home i guess</div>;
};

const Home = () => {
  const navigate = useNavigate();
  const cas = useCas();
  const userContextHome = useContext(UserContext);

  useEffect(() => {
    if (userContextHome.user) {
      navigate("/home", { replace: true });
    }
  }, [userContextHome.user]);

  return (
    <div>
      {cas.isLoading && <p>Redirecting, Loading,...</p>}
      {!cas.isLoading && (
        <div>
          Hello anon! Click here to log in <a href="#">Log in</a>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/home" element={<SecureHome />}></Route>
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
  // let casEndpoint = "cas.coloradocollege.edu";
  // let casOptions = { version: constant.CAS_VERSION_3_0, protocol: "https:" };
  // let casClient = new CasClient(casEndpoint, casOptions);
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   console.log("clicked");
  //   casClient
  //     .auth()
  //     .then((successRes) => {
  //       console.log(successRes);
  //       // Login user in state / locationStorage ()
  //       // eg. loginUser(response.user);
  //       // If proxy_callback_url is set, handle pgtpgtIou with Proxy Application
  //       // Update current path to trim any extra params in url
  //       // eg. this.props.history.replace(response.currentPath);
  //     })
  //     .catch((errorRes) => {
  //       console.error(errorRes);
  //       // Error handling
  //       // displayErrorByType(errorRes.type)
  //       // Update current path to trim any extra params in url
  //       // eg. this.props.history.replace(response.currentPath);
  //     });
  // };
  // return <button onClick={handleClick}>verify</button>;
};

export default App;
