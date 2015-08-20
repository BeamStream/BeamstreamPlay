<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 14/February/2013
		* Description           : Templates for registration page
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->
 <button type="button" id="cancle_registration" class="btn" >Cancel Registration</button>

 <div class="profile-wrapper">
        <div class="profile-left-container">
  		<div class="req-field">
 		<span>*</span><h6>Required Fields </h6>
		</div>
       
          <div id="step2_block" class="profile-white registration-info box-active">
            <!--<div class="profile-select-block second-block-registration">
              <fieldset class="field">  
              <select id="role" data-name="user.role" name="role" class="selectpicker-info" style="display: none;" placeholder="Student">
                <option value="Student">Student</option>
                <option value="Educator">Educator</option>
                <option value="Professional">Teaching Assistant</option>
              </select>
              <span class="red-star select-star">*</span>
              </fieldset>
            </div>-->

            <fieldset class="field">  
            <input id="username"  data-name="user.username" name="username" value="{{username}}"   type="text" placeholder="User Name" autocomplete="off">
            <span class="red-star">*</span>
            </fieldset>

             <fieldset class="field">  
            <input id="firstName"  data-name="user.firstName" name="firstName" value="{{firstName}}"   type="text" placeholder="First Name">
            <span class="red-star">*</span>
            </fieldset>
            
            <fieldset class="field">  
            <input id="lastName"  data-name="user.lastName" name="lastName"  value="{{lastName}}" type="text" placeholder="Last Name">
              <span class="red-star">*</span>
            </fieldset>
            
            {{#if status}}
	            <fieldset class="field"> 
	   		    <input id="mailId"  data-name="user.mailId" name="mailId"  value="{{email}}" type="text" placeholder="Email">
	    	  	<span class="red-star">*</span>
	            </fieldset>
            {{/if}}
            
            <div class="alert-register"><span>*Last name will not be shown publicly</span></div>
             <div class="field">
             <textarea id="aboutYourself" data-name="user.aboutYourself" value="" name="aboutYourself"  name="aboutYourself" cols="" rows="" placeholder="Tell us a little about yourself."></textarea>
            </div>
            <fieldset class="field">  
            <input id="schoolName"  data-name="user.schoolName" name="schoolName" value=""  type="text" placeholder="School Name">
            <input type="hidden" id="associatedSchoolId" >
              <span class="red-star">*</span>
              <span class="loading" style="display:none;"> 
                <!-- <img src ="/beamstream/images/loading.gif"> -->
              </span>
            </fieldset>
            <fieldset class="field">  
            <input id="major"  data-name="user.major" name="major" value=""  type="text" placeholder="Major " >
             <span class="red-star">*</span>
            </fieldset>
            <div class="profile-select-block">
              <fieldset class="field">  
              <select id="gradeLevel" data-name="user.gradeLevel" name="gradeLevel" class="selectpicker-info " style="display: none;" placeholder="Grade Level?">
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduated(Master's)">Graduated(Master's)</option>
                <option value="Graduated(Phd)">Graduated(Phd)</option>
                <option value="Other">Other</option>
              </select>
               <span class="red-star select-star">*</span>
               </fieldset>
            </div>
            <div class="profile-select-block">
              <fieldset class="field">
              <select id="degreeProgram" data-name="user.degreeProgram" name="degreeProgram" class="selectpicker-info " style="display: none;" placeholder="Degree Program?">
                <option value="Associate's(AA)">Associate's(AA)</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="Doctorate(Phd)">Doctorate(Phd)</option>
                <option value="Other">Other</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
            </div>
            
            <fieldset class="field">  
            <input style="display:none;" type="text" placeholder="Degree " value="" name="otherDegree" data-name="user.otherDegree" id="otherDegree">
             <span class="red-star">*</span>
            </fieldset>
            
            
            <fieldset class="field">  
            <input style="display:none;" type="text" placeholder="Degree " value="" name="otherDegree" data-name="user.otherDegree" id="otherDegree">
             <span class="red-star">*</span>
            </fieldset>
            
            <div class="profile-select-block">
          
              <fieldset class="field">   
              <select id="graduate" data-name="user.graduate" name="graduate" class="selectpicker-info" placeholder="Graduated?">
                <option value="attending">Still Attending</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
            </div>
            
             <div id="degreeExpected-set" class="profile-select-block" style="display: none;">
              <fieldset  class="field" >   
              <select id="degreeExpected" data-name="user.degreeExpected" name="degreeExpected" class="selectpicker-info " placeholder="Degree Expected?">
        				<option value="Winter 2014">Winter 2014</option>
        				<option value="Summer 2015">Summer 2015</option>
        				<option value="Winter 2015">Winter 2015</option>
        				<option value="Summer 2016">Summer 2016</option>
        				<option value="Winter 2016">Winter 2016</option>
        				<option value="Summer 2017">Summer 2017</option>
        				<option value="Winter 2017">Winter 2017</option>
        				<option value="Summer 2018">Summer 2018</option>
        				<option value="Winter 2018">Winter 2018</option>
        				<option value="No Degree Expected">No Degree Expected</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
            </div>
            
            
          <!--   <fieldset id="graduationDate-set" class="field" style="display:none;"> 
        	 	<input id="graduationDate" data-name="user.graduationDate" value="" name="graduationDate"  class="datepicker calender-box" type="text" placeholder="Date"  />
				<div class="new-arrow date-arrow"><span><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></span></div>
          	</fieldset> -->
          
            <fieldset id="graduationDate-set"  style="display:none;">
            <div data-date-viewmode="years"   id="datepicker" class="input-append date field">
                      <input type="text" readonly="" id="graduationDate" data-name="user.graduationDate" value="" name="graduationDate" placeholder="Graduation Date"  class="datepicker calender-box">
                         <div class="new-arrow date-arrow ">
                          <span class="add-on courseFinishDate">
                         	 <span class="caret display-caret pull-right"></span>
                          </span>
                        </div>
                     
                </div>
                <span class="red-star select-star">*</span>
             </fieldset>    
            
            <fieldset class="field location-block">
            <input id="location" data-name="user.location" name="location" value="{{location}}" type="text" placeholder="Location" class="location-note">
            <span class="red-star select-star">*</span>
             <span class="location-icon location-toolip" data-original-title="Use Current Location"></span>
           </fieldset>
          
           <fieldset class="field">
            <input id="cellNumber" data-name="user.cellNumber" name="cellNumber" type="text" placeholder="(999) 999-9999">
            </fieldset>
            <div class="alert-register"><span>*For mobile usage options.</span></div>
          </div>
        </div>

          <div class="middle-container">

<ul class="profile-top-menu profile-white register-top-white">
            <h3>Personality</h3>
            <h5>Coming Soon</h5>
          </ul>

  <div class="profile-center-container">

          <div class="roud-slider">
         	  <div id="step_1" class="step-box step-box1">
	              <h3>Step 1 of 3 </h3>
	              <h4>Make registration a breeze - Connect Your Social Networks</h4>
	              <a id ="skip_step1" class="disable-step" href="#">Skip Step</a> <a id="done_step1" href="#">Continue</a> 
              </div>
              
              <div id="step_2" style="display:none;" class="step-box step-box1 step-box2 step-two">
	              <h3>Step 1 of 3 </h3>
	              <h4>Basic Profile Section</h4>
		          <a id="step2-reset" class="disable-step" href="#">Reset</a> 
		          <a id="done_step2" href="#">Continue</a> 
		           <a href="#" class="register-back" id="step2_back">Back</a> 
	          </div>
	          
	          <div id="step_3" style="display:none;" class="step-box">
	              <h3>Step 3 of 3 </h3>
					<h4>Upload Your Main Profile Photo</h4> <span class="profile-loading" style="display:none;;"> </span>
	              <a id="skip_step3" class="disable-step" href="#">Skip Step</a> 
	              <a class="browse" href="#">Upload Photo</a>   
	               <a href="#" class="register-back" id="step3_back">Back</a>
              </div>



    	<input type="file" id="uploadProfilePic" name="uploadProfilePic"  style="display:none;"> 
      <div id="upload-step">
        <div id="step3_block" class="round-block upload-photo step-one-photo"> 
          {{#if photo}}
          <a > <img src="{{photo}}" width="148" height="37" id="profile-photo"></a> 
                    
          {{else}}	             
          <a > <img src="/beamstream-new/images/step-one-pic.png" width="148" height="37" id="profile-photo"></a>
          {{/if}}
        </div>
      </div>
    </div>
 
        </div>
        
        <!-- for  popups after Upload Photo -->
        
        
        
        
			<div id="selectUploadPhoto"  class="modal hide fade registration-modal white-modal-block in bootbox modal fade in" role="dialog" aria-labelledby="myModalLabel" tabindex="-1" style="overflow:hidden;" aria-hidden="false">				
				<div class="modal-body">You don't want to add your stunning profile pic?</div>
							<div class="modal-footer">
								<a id="continue" class=" invite-green-btn class-modal-btn startBeam-btn btn btn googledocclose" href="#">Skip</a>
								<a id="addPhoto" class="invite-green-btn class-modal-btn modal-button btn btn googledocclose" href="#">Upload Photo</a> 
							</div>
						</div>
			           <ul class="profile-top-menu profile-white register-top-white photo-project">
			             <div id="photoUploader">  </div>	
            			</ul>
            			<br/>
            <ul class="profile-top-menu profile-white register-top-white photo-project">
              <h3>Photos & Projects</h3>
              <h5>Coming Soon</h5>
            </ul>
        </div>
        <div class="profile-right-container">
          <div id="step1_block" class="profile-white active-border" style="visibility:hidden;"><!--DH MAKE VISIBLE WHEN JANRAIN IS READY-->
            <h5>Connect with:</h5>
            <ul class="register-social">
              <li >
                
                 <a class="facebook register-toolip-outer" href="#" data-original-title="Sweet, Lookin good!"> <span class="facebook"></span> <span class="shadow">Facebook</span></a>
                <div class="social-close"></div>
              </li>
              <li>
                 
                <a class="twitter register-toolip-outer" href="#" data-original-title="Sweet, Lookin good!"> <span class="twitter"></span> <span class="shadow">Twitter</span></a>
                <div class="social-close"></div>
              </li>
              <li> <a class="google" href="#"> <span class="google-plus"></span> <span class="shadow">Google</span></a> </li>
              <li> <a class="link-in" href="#"> <span class="link-in"></span> <span class="shadow">Linkedin</span></a> </li>
            </ul>
            <div class="clear"></div>
          </div>
          <div class="coming-soon-reg">
            <div class="add-skills">
              <h3> Interests & Skills</h3>
              <h5>Coming Soon</h5>
            </div>
          </div>
        </div>
      </div>
 

      
      
