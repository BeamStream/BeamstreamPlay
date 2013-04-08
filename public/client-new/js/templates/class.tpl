<!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 28/February/2013
		* Description           : Templates for class page
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->



<div class="right-container">
        <div class="classic-information-block">
          <div class="classic-information-left">
            <h5>Class Information</h5>
              
	              <div class="profile-select-block invite-select invite-grade-select field" >
	                <select id="schoolId" data-name="class.schoolId" name="schoolId"  class="selectpicker-info " style="display: none;">
	                  <option selected="selected" value="" >School Name</option>
	                </select>
	                
	                <div class="invite-school-arrow "><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></div>
	              </div>
              
              <div class="field"> 
              	<input id="classCode"  data-name="class.classCode"  name="classCode"  type="text" placeholder="Class Code" name="" class="small-text ">
              </div>
			  <div class="field"> 
              <input id="className" data-name="class.className" name="className" type="text" placeholder="Enter the name of your class"  class="big-text">
 			 </div>
              
               <div class="field"> 
              	<input id="classTime"  data-name="class.classTime"  name="classTime"  type="text" placeholder="Class Time"  class="time-text">
             
            <div class="invite-small-select profile-select-block field time_select" >
                <select id="time" class="selectpicker-info " name="time" style="display: none;">
                  <option selected="selected" value="AM">AM</option>.
                  <option value="PM">PM</option>
                  
                </select>
                <div class="invite-small-arrow"><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></div>
              </div>
             
              </div>
               
              
              
              <div class="invite-calender field">  <input id="startingDate" data-name="class.startingDate" value="" name="startingDate"  class="datepicker calender-box" type="text" placeholder="Class start date" />
 
 				<div class="new-arrow date-arrow"><span><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></span></div>
              </div>
            
               <div class="invite-small-select invite-small-last profile-select-block field" >
                <select id="classType" data-name="class.classType" name="classType" class="selectpicker-info " style="display: none;">
                  <option value="semester">Semester</option>
				<option value="quarter">Quarter</option>
                </select>
                <div class="invite-small-arrow"><img src="/beamstream-new/images/white-arrow.png" width="15" height="8"></div>
              </div>
              
             
              <div class="invite-bottom-btn">
              
            <a href="#myModal" class="invite-orange-btn" data-toggle="modal">Add More Classmates</a>
             <a href="#" class="invite-orange-btn">Invite Educator To Claim</a>
              <a href="#" id="create-stream" class="invite-green-btn">Create (Join) Stream</a>
            
            
                
              </div>
              
           </div>
          <div class="classic-information-right">
            <h5> Class access</h5>
            <ul class="access-menu">
              <li><a href="#" class="open-online">Open Online Class</a></li>
              <li><a href="#" class="invite-only"> Invite Only</a></li>
              <li><a href="#" class="users-request">Users Requests</a>
                <div class="orange-tick"></div>
              </li>
            </ul>
          </div>
        </div>
        
        
         <!---- for  popups after Create stream----->
			<div id="selectNextStep" style="top: 65% !important; Z-index:9999" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				  <div class="modal-header">
				    <h3>What Next ?</h3><button type="button" class="close" data-dismiss="modal" aria-hidden="true">Close</button>
				  </div>
				  <div class="modal-body">    
				  <div class="invite-bottom-btn">
 		  			<a id="addMoreClass" class="invite-green-btn" href="#">+ Add More Classes</a>  
 		  			<a id="startBeam" class="invite-green-btn" href="#">Start using BeamStream</a>
 		  			</div>
			  	</div>
	 		</div>			
	
	
	
      
      
<!--         <div id="myModal" class="modal hide fade invite-pop-up" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> -->
<!--           <div class=" pop-close"> -->
<!--             <button type="button" class="close" data-dismiss="modal" aria-hidden="true">Close <img src="/beamstream-new/images/close-pop.png" width="22" height="22"></button> -->
<!--           </div> -->
<!--           <div class="invite-pop-outer"> -->
<!--             <div class="invite-pop-info"> -->
<!--               <div class="pop-up-header"> -->
<!--                 <h3>Invite your people to BeamStream</h3> -->
<!--               </div> -->
<!--               <div class="pop-up-container"> -->
              
<!--               <div class="pop-info-block"> -->
<!--               <div class="pop-up-container-left"> -->
<!--                   <div class="pop-email-box"> -->
<!--                     <input type="text" name="" placeholder="Email Address"> -->
<!--              	     <a href="#"> Send from your email client</a> -->
<!--                     <ul class="email-social-icons"> -->
<!--                       <li class="yahoo"><a href="#">Yahoo</a></li> -->
<!--                       <li class="google-plus"><a href="#">Yahoo</a></li> -->
<!--                       <li class="msn"><a href="#">Yahoo</a></li> -->
<!--                       <li class="other"><a href="#">Yahoo</a></li> -->
<!--                       <li class="other1"><a href="#">Yahoo</a></li> -->
<!--                       <li class="other2"><a href="#">Yahoo</a></li> -->
<!--                       <span> Import contacts from services above.</span> -->
<!--                     </ul> -->
<!--                   </div> -->
<!--                   <div class="pop-other-accounts"> -->
<!--                     <h3> Connect other accounts</h3> -->
<!--                     <ul class="register-social"> -->
<!--                       <li> -->
<!--                         <div class="tick-register"><img width="19" height="15" src="/beamstream-new//beamstream-new/images/green-tick.png"></div> -->
<!--                         <a href="#" class="facebook"> <span><img width="33" height="34" src="/beamstream-new/images/face-book-icon.png"></span> <span class="shadow">Facebook</span></a> </li> -->
<!--                       <li> -->
<!--                         <div class="tick-register"><img width="19" height="15" src="/beamstream-new/images/green-tick.png"></div> -->
<!--                         <a href="#" class="twitter"> <span><img width="33" height="34" src="/beamstream-new/images/twitter-icon.png"></span> <span class="shadow">Twitter</span></a> </li> -->
<!--                       <li> <a href="#" class="google"> <span><img width="33" height="34" src="/beamstream-new/images/google-plus-icon.png"></span> <span class="shadow">Google</span></a> </li> -->
<!--                       <li> <a href="#" class="link-in"> <span><img width="33" height="34" src="/beamstream-new/images/in-icon.png"></span> <span class="shadow">Link In</span></a> </li> -->
<!--                     </ul> -->
<!--                   </div> -->
<!--                 </div> -->

<!--               <div class="pop-up-container-right"> -->
<!--                   <h4> 1,289 All My Friends <span>(by connected accounts)</span> </h4> -->
<!--                   <div class="stream-wrapper pop-chat-block"> -->
<!--                     <div class="search-all-freinds"> -->
<!--                       <input type="text" name="" placeholder="Search all friends "> -->
<!--                       <div class="btn-group invite-dropdown-outer pop-select-right"> -->
<!--                         <button class="btn normal-dropdown invite-drop show-all-pop-up">Show All</button> -->
<!--                         <button class="btn blue-button invite-drop" data-toggle="dropdown"> <span class="caret sort-caret"></span></button> -->
<!--                         <ul class="dropdown-menu display-sub"> -->
<!--                           <li><a href="#">Products</a></li> -->
<!--                           <li><a href="#">Products</a></li> -->
<!--                           <li><a href="#">Products </a></li> -->
<!--                         </ul> -->
<!--                       </div> -->
<!--                     </div> -->
<!--                     <div class="pop-up-scroll-block"> -->
<!--                       <div id="user-online1" class="scroll-block scroll-chat-view scroll-block-popup"> -->
<!--                       <a href="#" class="scroll-select-all">Select All</a> -->
<!--                       <div class="pop-up-scroll-container pop-scroll-left"> -->
<!--                    <ul> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message-single">Message</a><a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                 </ul> -->
<!--                       </div> -->
                      
<!--                       <div class="pop-up-scroll-container pop-scroll-right"> -->
<!--                    <ul> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message-single">Message</a><a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                   <li><a href="#" class="social-scroll-icon-message">Message</a><a href="#" class="social-scroll-icon-facebook">Facebook</a> <a href="#"><img width="30" height="28" src="/beamstream-new/images/chat-imge-03.jpg"> <span>Alina Kay </span></a>  <div class="scroll-tick"><img src="/beamstream-new/images/green-tick.png" width="19" height="15"></div> </li> -->
<!--                 </ul> -->
<!--                       </div> -->
<!--                       </div> -->
<!--                       </div> -->
<!--                     </div> -->
<!--                   </div> -->

<!--               </div> -->

<!--                <div class="pop-bottom">  </div> -->
<!--                   <div class"clear"></div> -->
<!--                 </div> -->
<!--                 <div class="clear"></div> -->
<!--               </div> -->
<!--             </div> -->
<!--           </div> -->
        </div>
 
 