BS.ProfileView = Backbone.View.extend({

	events: {
	      'click #save': 'saveProfile',
	      'click #complete': 'saveProfile',
	      'change #profile-image' :'displayImage',
	      'change #my-video' :'displayVideo',
	      'click .delete-image' :'deleteSelectedImage',
	      'click .delete-video' :'deleteSelectedVideo',
	       "keyup #mobile" : "checkNumber",
	      "focusout #mobile" : "arragePhone",
	      "click .close-button" : "closeScreen"
//	      'click .back-button' :'backToPrevious'
	 },
	 
    initialize:function () {
    	
        console.log('Initializing Profile View');
        this.image = null;
    	this.video = null;
        
        this.source = $("#tpl-profile-reg").html();
		this.template = Handlebars.compile(this.source);
       
        BS.phReg =/^[(][0-9]{3}[)][\s][0-9]{3}[-][0-9]{4}$/;
        BS.num = {};
        BS.digits = 0;
        BS.bar = $('.bar');
        
    },
  
    render:function (eventName) {
    	 
        $(this.el).html(this.template({profilePhoto : BS.profileImageUrl}));
        return this;
    },
    /**
     * rearrange phone number 
     */
    checkNumber : function(){
    	
    	var  num = $('#mobile').val();
    	var numText = num.replace(/\D/g,"");
       	
    	var length = num.replace(/\D/g,"").length;
        if(length > 9)
        {
        	phno ='('+ numText.substring(0,3) + ') ' + numText.substring(3,6) + '-' + numText.substring(6,10);
        	$('#mobile').val(phno);
        	$('#num-validation').html("allow 10 digits only");
        }
        
    },
    /**
     * arrange phone number when it lost the focus
     */
       arragePhone :function(){
       	 
       	var phno = '';
       	var numCount = $('#mobile').val().length;
       	var  num = $('#mobile').val();
       	var numText = num.replace(/\D/g,"");
       	if(!num)
       	  return;
       	if(!num.match(BS.phReg))
       	{  
       		phno ='('+ numText.substring(0,3) + ') ' + numText.substring(3,6) + '-' + numText.substring(6,10);
       		if(!phno.match(BS.phReg))
       		{
       			$('#num-validation').html("Invalid number");
       		}
       		else
       		{
       			
       			$('#num-validation').html("");
       			$('#mobile').val(phno);
       		}
       	}
       	else
       	{
       		$('#num-validation').html("");
       	}
       	 
       },
       
       

    /**
     * save / post profile details
     */
    saveProfile:function (eventName) {
    	eventName.preventDefault();
    	var status = true;
    	var validate = jQuery('#profile-form').validationEngine('validate');
    	if(validate == true)
    	{
    	   if($('#mobile').val())
    	   {
    		   if(!($('#mobile').val().match(BS.phReg)))
    		   {
    			   status = false;
    		   }
    	   }
    	   if(status == true)
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

	        	    	   // navigate to main stream page after a tome period
	        	    	    setTimeout(function() {
	        	    	    	BS.AppRouter.navigate("streams", {trigger: true});
			    		    }, 500);
		        	    	
		        	    	
		   			    }
	        	    }
	        	});
    	   }
    	   else
    	   {
    		   $('#num-validation').html("Invalid  number");
    		   $('#mobile').focus();
    	   }
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
//    	BS.content = '<ul class="gallery clearfix"></ul><ul class="gallery clearfix">';
    	
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
//							   BS.content+= '<a href="'+data+'" rel="prettyPhoto[gallery2]"  ><img src="'+data+'" width="60" height="60" alt="This is a pretty long title" /></a>';
 
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
//					BS.content+= '</ul>';
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
      eventName.preventDefault();
  	  BS.AppRouter.navigate("class", {trigger: true});
    },
    
    /**
     * close profile screen
     */
    closeScreen :function(eventName){
  	  eventName.preventDefault();  
      BS.AppRouter.navigate("streams", {trigger: true});
    }
	
	
    
});
