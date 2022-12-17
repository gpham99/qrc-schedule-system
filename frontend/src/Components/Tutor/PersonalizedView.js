import React from "react";
import { useSearchParams } from "react-router-dom";

const PersonalizedView = () => {
  const [searchParams] = useSearchParams();
  console.log(
    "username extracted from search param: ",
    searchParams.get("username")
  );

  return <div>Personalized View. Check your console.</div>;
};

export default PersonalizedView;
