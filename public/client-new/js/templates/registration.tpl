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
  		<div class="req-field">
 		<span>*</span><h6>Required Fields </h6>
		</div>
       
          <div id="step2_block" class="profile-white registration-info box-active">
             <fieldset class="field">  
            <input id="firstName"  data-name="user.firstName" name="firstName" value=""  type="text" placeholder="First Name">
            <span class="red-star">*</span>
            </fieldset>
            <fieldset class="field">  
            <input id="lastName"  data-name="user.lastName" name="lastName"  value="" type="text" placeholder="Last Name">
              <span class="red-star">*</span>
            </fieldset>
            <div class="alert-register"><span>*Last Name will not be shown publicly</span></div>
            <fieldset class="field">  
            <input id="schoolName"  data-name="user.schoolName" name="schoolName" value=""  type="text" placeholder="School Name">
              <span class="red-star">*</span>
            </fieldset>
            <fieldset class="field">  
            <input id="major"  data-name="user.major" name="major" value=""  type="text" placeholder="Major " >
             <span class="red-star">*</span>
            </fieldset>
             <div class="field">
             <textarea id="aboutYourself" data-name="user.aboutYourself" value="" name="aboutYourself"  name="aboutYourself" cols="" rows="" placeholder="Tell us a little about yourself."></textarea>
            </div>
            <div class="profile-select-block">
              <fieldset class="field">  
              <select id="gradeLevel" data-name="user.gradeLevel" name="gradeLevel" class="selectpicker-info " style="display: none;">
                <option value="" selected="selected" >Grade Level?</option>
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
              <div class="select-arrow-white"><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></div>
            </div>
            <div class="profile-select-block">
              <fieldset class="field">
              <select id="degreeProgram" data-name="user.degreeProgram" name="degreeProgram" class="selectpicker-info " style="display: none;">
                <option selected="selected" value="" >Degree Program?</option>
                <option value="Assosiates(AA)">Assosiates(AA)</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="Doctorate(Phd)">Doctorate(Phd)</option>
                <option value="Other">Other</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
              <div class="select-arrow-white"><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></div>
            </div>
            <div class="profile-select-block">
          
              <fieldset class="field">   
              <select id="graduate" data-name="user.graduate" name="graduate" class="selectpicker-info " style="display: none;">
                <option selected="selected"  value="">Graduated?</option>
                <option value="attending">Still Attending</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
               <span class="red-star select-star">*</span>
              </fieldset>
              <div class="select-arrow-white"><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></div>
            </div>
            <fieldset class="field">
            <input id="location" data-name="user.location" name="location" value="" type="text" placeholder="Location" class="location-note">
            <span class="red-star select-star">*</span>
             <span class="location-icon location-toolip" data-original-title="Use Current Location"></span>
           </fieldset>
            
          
           <fieldset class="field">
            <input id="cellNumber" data-name="user.cellNumber" name="cellNumber" type="text" placeholder="Cell Number">
            </fieldset>
            <div class="alert-register"><span>*For mobile usage options.</span></div>
          </div>
        </div>

          <div class="middle-container">

<ul class="profile-top-menu profile-white register-top-white">
            <h3> Add Personality</h3>
            <h5>Coming Soon</h5>
          </ul>

  <div class="profile-center-container">

          <div class="roud-slider">
         	  <div id="step_1" class="step-box step-box1">
	              <h3>Step 1 of 3 </h3>
	              <h4>Make registration a breeze - Connect Your Social Networks</h4>
	              <a href="#">RESET</a> <a id="done_step1" href="#">NEXT</a> 
              </div>
              
              <div id="step_2" style="display:none;" class="step-box step-box1 step-box2 step-two">
	              <h3>Step 2 of 3 </h3>
	              <h4>Basci Profile Section</h4>
		          <a id="step2-reset" href="#">RESET</a> <a id="done_step2" href="#">NEXT</a> 
	          </div>
	          
	          <div id="step_3" style="display:none;" class="step-box">
	              <h3>Step 3 of 3 </h3>
	              <h4>Upload Your Main Profile Photo</h4>
	              <a class="browse" href="#">BROWSE</a> <a id="done_step3" href="#">DONE</a> 
              </div>


 <input type="file" id="uploadProfilePic" name="uploadProfilePic"  style="display:none;"> 
             <div id="upload-step">
	             <div id="step3_block" class="round-block upload-photo step-one-photo"> 
	             <a class="browse" href="#"> </a> 
	            
	             </div>
             </div>

		</div>
 
        </div>

           <ul class="profile-top-menu profile-white register-top-white photo-project">
              <h3> Add Photos / Projects</h3>
              <h5>Add on NExt Page</h5>
            </ul>

        </div>
        <div class="profile-right-container">
          <div id="step1_block" class="profile-white active-border">
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
      
      
<script>
$('.selectpicker-info').selectpicker({
    style: 'register-select'
	});
</script>