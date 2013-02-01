 <!-- 	* BeamStream
		*
		* Author                : Aswathy P.R (aswathy@toobler.com)
		* Company               : Toobler
		* Email:                : info@toobler.com
		* Web site              : http://www.toobler.com
		* Created               : 01/February/2013
		* Description           : Templates for beta user registration page
		* ==============================================================================================
		* Change History:
		* ----------------------------------------------------------------------------------------------
		* Sl.No.  Date   Author   Description
		* -
  -->
  
 
<h3>Join The Bete List</h3>
 
<form>
    <div class="row-grp">
        <label>Email Address </label><div class="field"><input type="text" placeholder="Enter Your Email Address"  data-name="user.mailId" name="mailId" /></div>
    </div></br>
    <div class="row-grp">
      <button id="betaRegister" type="button">Join The Beta List</button> 
    </div>
</form>

<div id="edit-bootstrap_popup" class="modal hide fade in" style="display: none; ">
	<div class="modal-header">
     	<a class="close" data-dismiss="modal">×</a>
        <h3></h3>
    </div>
	<div class="modal-body">
  		<h4>Edit {{type}}</h4>
  	    <input type="hidden" id="edittype" value="{{type}}">
 		<div id="error" class="invalid-validation" style="margin-left:20px; color:red;"></div>
		<p>
			<form name="add-new-school-form" id="add-new-school-form">

    			<div class="element">
		          <label name="media-title" for="school-name">Title </label>
		          <input class="popup_text" type="text" name="schoolName" id="media-title" placeholder="NAME of {{type}}" value="{{title}}">
		          <input type="hidden" id="parent-Id" value="">
    			</div>
     			<div class="element">
		          <label name="media-description" for="website">Description<span class="star"> </span></label>
		          <textarea class="popup_text" id="media-description" class="gdoc-description" placeholder="DESCRIPTION of {{type}}" >        
		          {{description}}</textarea>
    	  	   </div>
       	 </form>
        </p>		        
    </div>
    <div class="modal-footer">
     <a href="#" id ="sveeditdoc" class="btn btn-primary pull-left btn-success"  >Save</a>
    </div>
</div>   