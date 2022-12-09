import { Check } from "react-bootstrap-icons";
import CheckedBoxDisabled from "../CheckBoxes/CheckedBoxDisabled";
import UncheckedBoxDisabled from "../CheckBoxes/UncheckedBoxDisabled";
import DefaultCheckBox from "../CheckBoxes/DefaultCheckBox";
import { Pencil } from "react-bootstrap-icons";

function TutorInfo() {
  return (
    <div class="d-flex justify-content-center mt-5">
      <div class="table-responsive row justify-content center">
        <h1 class>
          Tutor's Information
          <button class="btn btn-outline-primary">
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
              <td scope="row" class="">
                <CheckedBoxDisabled />
              </td>
              <td>
                <UncheckedBoxDisabled />
              </td>
            </tr>
            <tr>
              <td>Pralad</td>
              <td>
                <CheckedBoxDisabled />
              </td>
              <td>
                <UncheckedBoxDisabled />
              </td>
            </tr>
            <tr>
              <td>Giang</td>
              <td>
                <CheckedBoxDisabled />
              </td>
              <td>
                <UncheckedBoxDisabled />
              </td>
            </tr>
            <tr>
              <td>Moises</td>
              <td>
                <CheckedBoxDisabled />
              </td>
              <td>
                <UncheckedBoxDisabled />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TutorInfo;
