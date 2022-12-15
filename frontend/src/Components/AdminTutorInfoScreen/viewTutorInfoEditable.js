import { Pencil } from "react-bootstrap-icons";
import DefaultCheckBox from "../CheckBoxes/DefaultCheckBox";

function TutorInfoEditable() {
  return (
    <div class="d-flex justify-content-center mt-5">
      <div class="table-responsive row justify-content center">
        <h1 class="d-flex flex-row justify-content-center align-items-center">
          Tutor's Information
          <button class="btn btn-outline-primary m-3">
            <Pencil />
          </button>
        </h1>
        <table class="table table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Tutor</th>
              <th>LA Status</th>
              <th>Availablility Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jessica</td>
              <td>
                <DefaultCheckBox />
              </td>
              <td>
                <DefaultCheckBox />
              </td>
            </tr>
            <tr>
              <td>Pralad</td>
              <td>
                <DefaultCheckBox />
              </td>
              <td>
                <DefaultCheckBox />
              </td>
            </tr>
            <tr>
              <td>Giang</td>
              <td>
                <DefaultCheckBox />
              </td>
              <td>
                <DefaultCheckBox />
              </td>
            </tr>
            <tr>
              <td>Moises</td>
              <td>
                <DefaultCheckBox />
              </td>
              <td>
                <DefaultCheckBox />
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-outline-primary">Submit</button>
      </div>
    </div>
  );
}

export default TutorInfoEditable;
