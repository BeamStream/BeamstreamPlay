BS.ProfileView = Backbone.View.extend({

	events: {
	      "click #save": "saveProfile",
	      "click #complete": "saveProfile",
	      'change #profile-image' :'displayImage',
	      'change #my-video' :'displayVideo'
	 },
	 
    initialize:function () {
    	
        console.log('Initializing Profile View');
        this.image = null;
    	this.video = null;
        this.template= _.template($("#tpl-profile-reg").html());
        
    },
    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    
    /**
     * save / post profile details
     */
    saveProfile:function (eventName) {
    	eventName.preventDefault();
    	
    	var validate = jQuery('#profile-form').validationEngine('validate');
    	if(validate == true)
    	{
    		$('#loading').css('display','block');
    		var data;
        	data = new FormData();
     	    data.append('imageData', this.image);
     	    data.append('videoData', this.video);
     		data.append('mobile',$('#mobile').val());
     		data.append('upload',$('#upload').val());
     		 
        	/* post profile page details */
        	$.ajax({
        	    type: 'POST',
        	    data: data,
        	    url: BS.saveProfile,
        	    cache: false,
        	    contentType: false,
        	    processData: false,
        	    success: function(data){
        	    	 
        	    	if(data.status == "Success") 
	   			    {
        	    		$('#loading').css('display','none');
	        	    	// navigate to main stream page
	        	    	BS.AppRouter.navigate("streams", {trigger: true, replace: true});
	   			    }
        	    }
        	});
        	
    	}
    	else
    	{
    		console.log("validation: " + $.validationEngine.defaults.autoHidePrompt);
    	}
    	 
    },
   
    
    /**
     * display profile photo
     */
    
    displayImage:function (e) {
    	
    	 file = e.target.files[0];
    	 this.image = file;
         var reader = new FileReader();
         
         /* Only process image files. */
         if (!file.type.match('image.*')) {
        	 
        	 console.log("Error: file type not allowed");
        	 $('#profile-photo').attr("src","images/no-photo.png");
		     $('#profile-photo').attr("name", "profile-photo");
		     $('#image-error').show();
 
         }
         else
         {
        	 $('#image-error').hide();
        	 /* capture the file informations */
             reader.onload = (function(f){
            	 return function(e){ 
        			 
        		     $('#profile-photo').attr("src",e.target.result);
        		     $('#profile-photo').attr("name", f.name);
        		     $('#imagedata').val(e.target.result);
        		     $('#imagedata').attr("name", f.name);
        			 
        		 };
            })(file);
             
            // read the image file as data URL
            reader.readAsDataURL(file);
         }
    },
    
    
    /**
     * display profile video
     */
    displayVideo:function (e) {
    	 
    	 var file = e.target.files[0];
    	 this.video = file;
         var reader = new FileReader();
         
         /* Only process video files. */
         if (!file.type.match('video.*')) {
        	 
        	 console.log("Error: file type not allowed");
        	 $('#profile-video').attr("src","images/no-photo.png");
		     $('#profile-video').attr("name", "profile-photo");
		     $('#video-error').show();
 
         }
         else
         {
        	 $('#video-error').hide();
        	 
        	 /* capture the file informations */
             reader.onload = (function(f){
            	 return function(e){ 
        					
        		     $('#profile-video').attr("src",e.target.result);
        		     $('#profile-video').attr("name", f.name);
        		     
        		     $('#videodata').val(e.target.result);
        		     $('#videodata').attr("name", f.name);
        			 
        		 };
            })(file);
             
            // read the image file as data URL
            reader.readAsDataURL(file);
         }
    },
    
  
    
});
