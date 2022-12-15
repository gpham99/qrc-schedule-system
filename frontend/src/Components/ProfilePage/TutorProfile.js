import { Container } from "react-bootstrap";
import DefaultCheckBox from "../CheckBoxes/DefaultCheckBox";

const TutorProfile = () => {
  return (
    <div
      class="d-flex flex-column align-items-center justify-content-center responsive p-5"
      style={{ height: "100vh", width: "100vw" }}
    >
      <h1 class="m-5">Tutor's Profile</h1>
      <div
        class="bg-secondary p-4 d-flex justify-content-center flex-column"
        style={{ height: "60%", width: "60%" }}
      >
        <p1 class="text-white m-5">
          Please select the maximum number of shifts you'd like to take along
          with the majors that you can tutor for.
        </p1>
        <div class="d-flex justify-content-center">
          <h3 class="text-white m-3">Maximum Shift Capacity:</h3>
          <form class=" m-3" style={{ width: "15%" }}>
            <input type="text" class="form-control" placeholder="#" />
          </form>
        </div>

        <div class="d-flex justify-content-center">
          <h3 class="text-white m-5">Disciplines:</h3>
          <div class="d-flex p-5 flex-column">
            <DefaultCheckBox box_label={"Math"}></DefaultCheckBox>
            <DefaultCheckBox box_label={"CS"}></DefaultCheckBox>
            <DefaultCheckBox box_label={"Econ"}></DefaultCheckBox>
            <DefaultCheckBox box_label={"CH/MB"}></DefaultCheckBox>
            <DefaultCheckBox box_label={"Physics"}></DefaultCheckBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
