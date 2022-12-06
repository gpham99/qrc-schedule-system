import Button from "react-bootstrap/Button";
import React from "react";

// function LoginButton() {
//   return (
//     <div className="LoginButton">
//       <button
//         onClick={() => {
//           alert("clicked");
//         }}
//         className="button button-outline-success"
//       >
//         {" "}
//         Login
//       </button>
//     </div>
//   );
// }

const LoginButton = () => {
  const handleClick = () => {};

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: "transparent",
        border: "2px solid gray",
        position: "absolute",
        top: "66.666666%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      Click me!
    </button>
  );
};
export default LoginButton;
