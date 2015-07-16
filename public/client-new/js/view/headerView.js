/***
* BeamStream
*
* Author                : Aswathy .P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 20/March/2013
* Description           : Backbone view for header 
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView'], function(FormView){
	var HeaderView;
	HeaderView = FormView.extend({
		objName: 'HeaderView',
		
		events:{
			'click #sign-out':'signOut'
		},

		onAfterInit: function(){	
            this.data.reset();
            
            var LoggedProUrl = localStorage["loggedUserProfileUrl"]
            
            var profileName = LoggedProUrl.substring(LoggedProUrl.indexOf('BeamStream/') +11);
            
            $('#right-top-photo').attr('src','https://s3.amazonaws.com/BeamStream/header_'+profileName);
        },
        
        /**
		 * function for sign out
		 */
		 signOut :function(eventName){
			 
			 eventName.preventDefault();
		
			
			 
			 /* expires the user session  */
			 $.ajax({
					type : 'GET',
					url : '/signOut',
					dataType : "json",
					success : function(data) {
						if(data.status == "Success"){
														
							localStorage["loggedUserProfileUrl"] =  '';
			            	localStorage["loggedUserId"] =  '';
							window.location = "/login";
							
						}
						else
						{
							alert(data.message);
						}
					}
			 });
		 },
 
	})
	return HeaderView;
});
