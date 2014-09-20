<div class="professor-registration">
  <div class="class-info-access">
    <div class="class-contact">
      <div class="class-info">
        <h5>CLASS INFO</h5>
        <form id="class-info">
          <div class="school-name-row row-fluid">
            <!-- <div class="span12"> -->
              <input type="text" placeholder="School Name" class="span12 school-name" name="school-name">
            <!-- </div> -->
          </div>
          <div class="name-class-code row-fluid">
            <input type="text" placeholder="Stream Name" class="span8 stream-name" name="streamName">
            <input type="text" placeholder="Class Code" class="span4 class-code" name="classCode">
          </div>
          <div class="time-row row-fluid">
            <!-- <table>
              <tr>
                <td> -->
                  <div class="time-input span4">
                    <input type="text" placeholder="Class Time" name="classTime">
                  </div>
                <!-- </td>
                <td> -->
                  <div class="span4">
                    <!-- <span>Class <br>Days:</span> -->
                    <input type="hidden" name="daysofWeek" value"">
                    <div class="btn-toolbar time-input" style="margin: 10;" name="days">
                      <div class="btn-group">
                        <button class="btn btn-small days-of-week" name="Sunday">S</button>
                        <button class="btn btn-small days-of-week" name="Monday">M</button>
                        <button class="btn btn-small days-of-week" name="Tuesday">T</button>
                        <button class="btn btn-small days-of-week" name="Wednesday">W</button>
                        <button class="btn btn-small days-of-week" name="Thursday">T</button>
                        <button class="btn btn-small days-of-week" name="Friday">F</button>
                        <button class="btn btn-small days-of-week" name="Saturday">S</button>
                      </div>
                    </div>
                  </div>
                <!-- </td>
                <td> -->
                  <div class="time-input">
                    <select name="termTimeFrame" class="span4">
                      <option>Semester</option>
                      <option>Quarter</option>
                    </select>
                  </div>
                <!-- </td>
              </tr>
            </table> -->
          </div>
        </div>
        <div class="contact-info">
          <h5>CONTACT INFO</h5>
          <div class="email-phone-row row-fluid">
            <input type="text" placeholder="Email" class="professor-email span8" name="email">
            <input id="cellNumber" data-name="user.cellNumber" name="cellNumber" type="text" placeholder="(999) 999-9999" class="professor-phone span4">
          </div>
          <div class="office-hour-row row-fluid">
            <input type="text" placeholder="Office Hours" class="office-hours span6" name="officeHours">
            <input type="text" placeholder="Mon-Fri" class="weekdays span6" name="days">
          </div>
        </div>
      </div>
      <div class="class-access">
        <h5>CLASS ACCESS</h5>
        <label>
          <input type="radio" name="class-access" value="open">
          Open Online Class
        </label>
        <label>
          <input type="radio" name="class-access" value="invite">
          Invite Only
        </label>
        <label>
          <input type="radio" name="class-access" value="request">
          User's Request
        </label>
        <p><button class="btn btn-small btn-inverse invite">+ Invite Others</button></p>
        <p><button class="btn btn-large btn-success submit" type="submit">Create Stream</button></p>

      </div>
    </div>
  </div>
