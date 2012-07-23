BS.ProfileView = Backbone.View.extend({

	events: {
	      'click #save': 'saveProfile',
	      'click #complete': 'saveProfile',
	      'change #profile-image' :'displayImage',
	      'change #my-video' :'displayVideo',
	      'click .delete-image' :'deleteSelectedImage',
	      'click .delete-video' :'deleteSelectedVideo',
//	      'click .back-button' :'backToPrevious'
	 },
	 
    initialize:function () {
    	
        console.log('Initializing Profile View');
        this.image = null;
    	this.video = null;
        this.template= _.template($("#tpl-profile-reg").html());
        
         BS.bar = $('.bar');
        
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
    		 
    		// for progress bar for file uploading
            $('.progress-container').show();
    		BS.progress = setInterval(function() {
    			 BS.bar = $('.bar');
    		   
    		    if (BS.bar.width()==380) {
    		        clearInterval(BS.progress);
    		        $('.progress').removeClass('active');
    		    } else {
    		    	 BS.bar.width( BS.bar.width()+20);
    		    }
    		    BS.bar.text( BS.bar.width()/4 + "%");
    		}, 800);
         
    		
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
        	    		//BS.bar = $('.bar');
        	    	    BS.bar.width(400);
        	    	    BS.bar.text("100%");
        	    	    clearInterval(BS.progress);
        	    	  
	        	    	// navigate to main stream page
	        	    	BS.AppRouter.navigate("streams", {trigger: true});
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
    	 
    	 var self = this;;
    	 $('#image-info').show();
    	 file = e.target.files[0];
    	 
    	
         var reader = new FileReader();
         
         /* Only process image files. */
         if (!file.type.match('image.*')) {
        	 
        	 console.log("Error: file type not allowed");
        	 $('#profile-photo').attr("src","images/no-photo.png");
		     $('#profile-photo').attr("name", "profile-photo");
		     $('.delete-image').hide();
		     $('#image-info').html('File type not allowed');
 
         }
         else
         {
        	 
        	 /* capture the file informations */
             reader.onload = (function(f){
            	 
            	 self.image = file;
            	 return function(e){ 
            		
            		 $('#image-info').html(f.name);
            		 $('.delete-image').show();
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
    	var self = this;;
    	$('#video-info').show();
    	
    	 var file = e.target.files[0];
    	 
         var reader = new FileReader();
         
         /* Only process video files. */
         if (!file.type.match('video.*')) {
        	 
        	 console.log("Error: file type not allowed");
        	 $('#profile-video').attr("src","images/no-video.png");
		     $('#profile-video').attr("name", "profile-photo");
		     $('#video-error').html('File type not allowed');
		     $('.delete-video').hide();
		     $('#video-info').html('File type not allowed');
 
         }
         else
         {
        	  
        	 /* capture the file informations */
             reader.onload = (function(f){
            	 self.video = file;
            	 return function(e){ 
            		 
            		 $('#video-info').html(f.name);
           		     $('.delete-video').show();
        		   
        		     $('#profile-video').attr("src","images/no-video.png");
        		     $('#profile-video').attr("name", f.name);
        		     
        		     $('#videodata').val(e.target.result);
        		     $('#videodata').attr("name", f.name);
        			 
        		 };
            })(file);
             
            // read the image file as data URL
            reader.readAsDataURL(file);
         }
    },
    
   /**
    * get all profile image urls
    */
    
    getProfileImages : function(page){
    	var first =false;
    	BS.content = '';
   	    $.ajax({
				type : 'GET',
				url : BS.allProfileImages,
				dataType : "json",
				success : function(datas) {
					 
					_.each(datas, function(data) {
						if(first == false)
						{
							if(page == "files")
							   BS.content+= '<a href="'+data+'" class="lytebox" data-lyte-options="group:vacation" data-title="Profile Images"><img id ="main-photo" src="'+data+'"  alt="username photo"></a>';
							else
								BS.content+= '<a href="'+data+'" class="lytebox" data-lyte-options="group:vacation" data-title="Profile Images"><img id ="main-photo" src="'+data+'"  width="189" height="156"  alt="username photo"></a>';
 
							first =true;
						}
						else
						{
							BS.content+= '<a href="'+data+'" class="lytebox" data-lyte-options="group:vacation" data-title=""></a>';
						}
						 
			        });
					BS.content+= '';
			    	 $('#profile-images').html(BS.content);					 
				},
				 
		 });
		 
    },
    /**
     * delete selected/uploaded images
     */
    deleteSelectedImage :function(eventName){
    	eventName.preventDefault();
    	this.image='';
    	$('#profile-image').val('');
    	$('#image-info').hide();
    	$('.delete-image').hide();
    	$('#profile-photo').attr("src","images/no-photo.png");
	    $('#profile-photo').attr("name", "profile-photo");
    },
    /**
     * delete selected/uploaded videos
     */
    deleteSelectedVideo :function(eventName){
    	eventName.preventDefault();
    	this.video='';
    	$('#my-video').val('');
    	$('#video-info').hide();
    	$('.delete-video').hide();
    	$('#profile-video').attr("src","images/no-video.png");
	    $('#profile-video').attr("name", "profile-photo");
    },
    
    /**
     * back button function
     */
    backToPrevious :function(){
  	  BS.AppRouter.navigate("class", {trigger: true});
    }
	
    
});
