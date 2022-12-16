import React from "react";
import CasClient, { constant } from "react-cas-client";

const App = () => {
  let casEndpoint = "cas.coloradocollege.edu";
  let casOptions = { version: constant.CAS_VERSION_3_0, protocol: "https:" };
  let casClient = new CasClient(casEndpoint, casOptions);

  const handleClick = (e) => {
    e.preventDefault();
    console.log("clicked");
    casClient
      .auth()
      .then((successRes) => {
        console.log(successRes);
        // Login user in state / locationStorage ()
        // eg. loginUser(response.user);

        // If proxy_callback_url is set, handle pgtpgtIou with Proxy Application

        // Update current path to trim any extra params in url
        // eg. this.props.history.replace(response.currentPath);
      })
      .catch((errorRes) => {
        console.error(errorRes);
        // Error handling
        // displayErrorByType(errorRes.type)

        // Update current path to trim any extra params in url
        // eg. this.props.history.replace(response.currentPath);
      });
  };
  return <button onClick={handleClick}>verify</button>;
};

export default App;
