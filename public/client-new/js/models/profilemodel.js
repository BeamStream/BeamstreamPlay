/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/september/2012
	 * Description           : For profile data
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.Profile = Backbone.Model.extend({
	     
	        defaults: {
	        	
	        	imageName:null,
	        	imageData:null,
	        	videoData:null,
	        	videoName:null,
	            mobile:null,
	            upload:null
	        },
	        
	        url:BS.profileImage,
	        
	});

 

 
