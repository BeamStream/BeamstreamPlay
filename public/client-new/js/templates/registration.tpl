<!--/***
* BeamStream
*
* Author                : Cuckoo Anna (cuckoo@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/January/2013
* Description           : Backbone model for user details 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/ -->
<div class="container-fluid">
 <div class="main-container ">
 <div class="profile-wrapper">
        <div class="profile-left-container">
        <h6><span>*</span>Required Fields </h6>
          <div id="step2_block" class="profile-white registration-info box-active">
            <fieldset class="field">  
            <input id="firstName" name="firstName" data-name="user.firstName" type="text" placeholder="First Name">
            <span class="red-star">*</span>
            </fieldset>
            <fieldset class="field">  
            <input id="lastName"  name="lastName" type="text" data-name="user.lastName" placeholder="Last Name">
              <span class="red-star">*</span>
            </fieldset>
            <div class="alert-register"><span>*Last Name will not be shown publicly</span></div>
            <fieldset class="field">  
            <input id="schoolName" name="schoolName" data-name="user.schoolName" type="text" placeholder="School Name">
              <span class="red-star">*</span>
            </fieldset>
            <fieldset class="field">  
            <input id="major" name="major" data-name="user.major"  type="text" placeholder="Major " >
             <span class="red-star">*</span>
            </fieldset>
            <div class="field">
                <textarea id="aboutYourself" name="aboutYourself" data-name="user.aboutYourself" cols="" rows="" placeholder="Tell us a little about yourself."></textarea> </div>
            <div class="profile-select-block">
              <fieldset>  
              <select id="gradeLevel" name="gradeLevel" class="selectpicker-info " style="display: none;">
                <option  name="" selected="selected" >Grade Level?</option>
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
              <div class="select-arrow-white"><img src="images/white-arrow.png" width="15" height="8"></div>
            </div>
            <div class="profile-select-block">
              <fieldset>
              <select id="degreeProgram" name="degreeProgram" class="selectpicker-info " style="display: none;">
                <option selected="selected" >Degree Program?</option>
                <option value="Assosiates(AA)">Assosiates(AA)</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="Doctorate(Phd)">Doctorate(Phd)</option>
                <option value="Other">Other</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
              <div class="select-arrow-white"><img src="images/white-arrow.png" width="15" height="8"></div>
            </div>
            <div class="profile-select-block">
          
              <fieldset>   
              <select id="graduate" name="graduate" class="selectpicker-info " style="display: none;">
                <option selected="selected" >Graduated?</option>
                <option value="attending">Still Attending</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
              <div class="select-arrow-white"><img src="images/white-arrow.png" width="15" height="8"></div>
            </div>
            <fieldset class="field">
            <input id="location" name="location" data-name="user.location" type="text" placeholder="Location" class="location-note">
            <span class="red-star select-star">*</span>
             <span class="location-icon location-toolip" data-original-title="Use Current Location"><img src="images/loacation-icon.png" width="16" height="20"></span>
           </fieldset>
            
           
           <div class="field">
               <input id="cellNumber" name="cellNumber" data-name="user.cellNumber" type="text" placeholder="Cell Number"> </div>
            <div class="alert-register"><span>*For mobile usage options.</span></div>
          </div>
        </div>
        <div class="profile-center-container">

          <ul class="profile-top-menu profile-white register-top-white">
            <h3> Add Personality</h3>
            <h5>Coming Soon</h5>
          </ul>
          <div class="roud-slider">
         	  <div id="step_1" class="step-box step-box1">
	              <h3>Step 1 of 3 </h3>
	              <h4>Connect Your Social Networks</h4>
	              <a href="#">RESET</a> <a id="done_step1" href="#">NEXT</a> 
              </div>
              
              <div id="step_2" style="display:none;" class="step-box step-box1 step-box2">
	              <h3>Step 2 of 3 </h3>
	              <h4>Basci Profile Section</h4>
		          <a href="#">RESET</a> <a id="done_step2" href="#">NEXT</a> 
	          </div>
	          
	          <div id="step_3" style="display:none;" class="step-box">
	              <h3>Step 3 of 3 </h3>
	              <h4>Upload Your Main Profile Photo</h4>
	              <a href="#">BROWSE</a> <a id="done_step3" href="#">DONE</a> 
              </div>
             <div id="upload-step" >
	             <div id="step3_block" class="round-block upload-photo step-one-photo  "> 
	             <a href="#"> </a> 
	             </div>
             </div>
              
             
              
              
            <ul class="profile-top-menu profile-white register-top-white photo-project">
              <h3> Add Photos / Projects</h3>
              <h5>Add on NExt Page</h5>
            </ul>
          </div>
        </div>
        <div class="profile-right-container">
          <div id="step1_block" class="profile-white active-border">
            <h5>Connect with:</h5>
            <ul class="register-social">
              <li>
                <div class="tick-register"></div>
                 <a class="facebook register-toolip-outer" href="#" data-original-title="Sweet, Lookin good!"> <span><img width="33" height="34" src="images/face-book-icon.png"></span> <span class="shadow">Facebook</span></a>
                <div class="social-close"><img src="images/social-close.png" width="9" height="9"></div>
              </li>
              <li>
                <div class="tick-register"></div>
                <a class="twitter register-toolip-outer" href="#" data-original-title="Sweet, Lookin good!"> <span><img src="images/twitter-icon.png" width="33" height="34"></span> <span class="shadow">Twitter</span></a>
                <div class="social-close"><img src="images/social-close.png" width="9" height="9"></div>
              </li>
              <li> <a class="google" href="#"> <span><img src="images/google-plus-icon.png" width="33" height="34"></span> <span class="shadow">Google</span></a> </li>
              <li> <a class="link-in" href="#"> <span><img src="images/in-icon.png" width="33" height="34"></span> <span class="shadow">Linkedin</span></a> </li>
            </ul>
            <div class="clear"></div>
          </div>
          <div class="profile-white">
            <div class="add-skills">
              <h3> Add Interests / Skills</h3>
              <h5>Coming Soon</h5>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>


