<div class="professor-registration">
  <div class="class-info-access">
    <div class="class-contact">
      <div class="class-info">
        <h5>CLASS INFO</h5>
        <form id="class-info">
          <div class="school-name-row row-fluid invite-select school_field">
					  <!-- <div class="span12"> -->
							<select id="schoolId" data-name="class.schoolId" name="schoolId" class="selectpicker-info" class="span12 school-name" name="school-name" style="display: 										none;">
							</select>
							<div id="add-new-school" class="new-school-field" style="display: none;">
								<input type="text" id="schoolName" name="schoolName" placeholder="Enter new school" class="newclass"> 
								<input type="hidden" id="associatedSchoolId">
							</div>
					  <!-- </div> -->
				  </div>
					<fieldset class="field name-class-code row-fluid">
					  <input type="text" placeholder="Stream Name" class="span8 stream-name big-text" id="className" data-name="class.className" name="className" placeholder="Enter the name of your class">
					  <input type="text" placeholder="Class Code" class="span4 class-code" name="classCode" id="classCode" data-name="class.classCode" name="" class="small-text">
					</fieldset>
					<div class="time-row row-fluid">
					 <!-- <table>
					    <tr>
					      <td> -->
					        <div class="time-input span4 field">
					          <input type="text" id="classTime" data-name="class.classTime" name="classTime" placeholder="Class Time" class="time-text">
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
																	<!-- Calendar UI from previous registration. Can be deleted once new registration is hooked up 10/12/14

																	<div data-date-viewmode="years" id="datepicker" class="input-append date invite-calender field">
																		<input type="text" readonly="" id="startingDate" data-name="class.startingDate" value="" name="startingDate" placeholder="Class start date" class="datepicker calender-box">
																		<div class="new-arrow date-arrow ">
																			<span class="add-on"></span>
																		</div>
																	</div>
																		-->
											      <!-- </td>
											      <td> -->
						                  <div class="time-input">
						                    <select name="termTimeFrame" class="span4">
						                      <option>Semester</option>
						                      <option>Quarter</option>
						                    </select>
						                  </div>
															<!-- OLD Semester Block old registration UI
										            <div class="invite-small-last semester-select-block field class_field">
										 							<select id="classType" data-name="class.classType" name="classType" class="selectpicker-info " style="display: none;">
										 								<option value="semester">Semester</option>
										 								<option value="quarter">Quarter</option>
										 							</select>
										 							<div class="btn-group bootstrap-select selectpicker-info">
										 								<button class="btn dropdown-toggle clearfix register-select invite-selecter" data-toggle="dropdown" id="classType"><span class="filter-option pull-left" style="max-width: 50px;">Semester</span> <span class="caret display-caret pull-right"></span>
										 								</button>
										 								<div class="dropdown-menu" role="menu">
										 									<ul>
										 										<li rel="0"><a tabindex="-1" href="#">Semester</a></li>
										 										<li rel="1"><a tabindex="-1" href="#">Quarter</a></li>
										 									</ul>
										 								</div>
										 							</div>
										 						</div>
																>
											      </td>
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
			  <p><button class="btn btn-small btn-inverse invite" id="add_classmates" href="#" data-toggle="modal"><span></span>+ Invite Others</button></p>
				<p><button class="btn btn-large btn-success submit" href="#" id="createOrJoinStream" type="submit">Create Stream</button></p>
      </div>
    </div>
  </div>
