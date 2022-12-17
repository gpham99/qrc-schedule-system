import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CasClient, { constant } from "react-cas-client";
import { UserContext } from "./context/userContext";

const useCas = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const casEndpoint = "cas.coloradocollege.edu";
  const casOptions = {
    version: constant.CAS_VERSION_3_0,
    // protocol: "https:",
    // validation_proxy_path: "/cas_proxy",
  };
  const casClient = new CasClient(casEndpoint, casOptions);
  const casUserContext = useContext(UserContext); // this line needs to be changed later -> look up all the blabla

  useEffect(() => {
    if (!casUserContext.user) {
      (async function () {
        try {
          await attemptCasLogin();
        } catch (error) {
          console.error("hard knock life: ", error);
        }
      })();
    }
  }, []);

  const attemptCasLogin = () => {
    return new Promise((resolve, reject) => {
      casClient
        .auth()
        .then((successRes) => {
          // Login user in state / locationStorage ()
          // eg. loginUser(response.user);
          casUserContext.setUser(successRes.user);
          // Update current path to trim any extra params in url
          // eg. this.props.history.replace(response.currentPath); -> used to be history.replace(errorRes.currentPath) -> change to navigate
          setIsLoading(false);
          navigate(successRes.currentPath, { replace: true });
        })
        .catch((errorRes) => {
          setIsLoading(false);
          navigate(errorRes.currentPath, { replace: true });
          reject(errorRes);
        });
    });
  };

  const logout = (path = "/") => {
    casClient.logout("/");
  };

  return { isLoading, attemptCasLogin, logout };
};

export default useCas;
