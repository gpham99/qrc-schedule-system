import { Card, Container } from "react-bootstrap";

const Schedule = () => {
  return (
    <div class="container p-5">
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive row justify-content center">
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th></th>
                  <th>Sunday</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2-4 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>4-6 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>6-8 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>8-10 PM</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
