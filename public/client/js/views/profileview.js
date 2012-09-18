BS.ProfileView = Backbone.View.extend({

	events: {
	      'click #save': 'saveProfile',
	      'click #complete': 'saveProfile',
	      'change #profile-image' :'displayImage',
	      'change #my-video' :'displayVideo',
	      'click .delete-image' :'deleteSelectedImage',
	      'click .delete-video' :'deleteSelectedVideo',
	       'keyup #mobile' : "checkNumber",
	      'focusout #mobile' : "arragePhone",
	      'click .close-button' : "closeScreen",
	      'click .back' :'backToPrevious',
	      'click .pfofile-radio': "selectImageStatus",
	      
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
        $(".radio").dgStyle();
        //remove the janrain component if it already exists
        if($('#janrain-share'))
         $('#janrain-share').remove();
        
    },
  
    render:function (eventName) {
    	/* check whether its a edit profile or not */
    	var edit = "";
    	if(BS.editProfile)
    	{
    		edit = "yes";
        }
    	else
    	{
    		edit = "";
    	}
    	
    	
        $(this.el).html(this.template({profilePhoto : BS.profileImageUrl , edit : edit}));
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
        	$('#num-validation').html("");
        	$('#mobile').val(phno);
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
       	if(!num || num.match(/^[\s]*$/))
       	{
       		$('#num-validation').html("");
       		return;
       	}
       	  
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
    	var validate = $('#profile-form').valid();
    	if(validate == true)
    	{
    	   if($('#mobile').val())
    	   {
    		   if(!($('#mobile').val().match(BS.phReg)))
    		   {
    			   if($('#mobile').val().match(/^[\s]*$/))
    			   {
    				   status = true;
    			   }
    			   else
    			   {
    				   status = false;
    			   }
    			   
    		   }
    	   }
    	   if(status == true)
    	   {
    	 
	    		// for progress bar for file uploading
	            $('.progress-container').show();
	    		BS.progress = setInterval(function() {
	    			 BS.bar = $('.bar');
	    		   
	    		    if (BS.bar.width()== 392) {
	    		        clearInterval(BS.progress);
	    		        $('.progress').removeClass('active');
	    		    } else {
	    		    	 BS.bar.width( BS.bar.width()+8);
	    		    }
	    		    BS.bar.text( BS.bar.width()/4 + "%");
	    		}, 800);
	    		
	    		
	    		var data;
	        	data = new FormData();
	     	    data.append('imageData', this.image);
	     	    data.append('videoData', this.video);
	     		data.append('mobile',$('#mobile').val());
	     		data.append('upload',$('#upload').val());
//	     		data.append('imageStatus', $('input[name=img-status]:checked').val());
//	     		data.append('videoStatus', $('input[name=video-status]:checked').val());
	     		 
	     		
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
	        	    	    $(".star").hide();
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
    	BS.images = '<div class="gallery clearfix"></div><div class="gallery clearfix">';
    	
   	    $.ajax({
				type : 'GET',
				url : BS.allProfileImages,
				dataType : "json",
				success : function(datas) {
					  
					_.each(datas, function(data) {
						 
						if(first == false)
						{
                                                    
							if(page == "files")
							{
							    
							   BS.images+= '<a href="'+data+'" rel="prettyPhoto[gallery2]"  ><img src="'+data+'" width="185px" height="141px"  /></a>';
							}
							else
							{
								BS.images+= '<a href="'+data+'" rel="prettyPhoto[gallery2]"> </a> ';
							}
							first =true;
						}
						else
						{
							BS.images+= '<a href="'+data+'" rel="prettyPhoto[gallery2]"> </a> ';
						}
						 
			        });
					BS.content+= '';
					$('#profile-images').html(BS.images);	

 			    	$("area[rel^='prettyPhoto']").prettyPhoto();
 					$(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
 					$(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
 			
				}
				 
		 });
		 
    },
    
    /**
     * get all profile videos urls
     */
     
     getProfileVideos : function(){
     	var first =false;
     	 
     	BS.videos = '<div class="gallery clearfix"></div><div class="gallery clearfix">';
     	
    	    $.ajax({
 				type : 'GET',
 				url : BS.allProfileVideos,
 				dataType : "json",
 				success : function(datas) {
 					  
 					_.each(datas, function(data) {
 						 
 						if(first == false)
 						{
                                                     
 							BS.videos+= '<a href="'+data+'" rel="prettyPhoto[movies]" ><img src="images/image2.jpg"  width="185px" height="141px" /></a>';
// 							BS.videos+= '<a href="http://trailers.apple.com/movies/disney/tronlegacy/tronlegacy-tsr1_r640s.mov?width=640&height=272" rel="prettyPhoto[movies]" ><img src="images/image2.jpg"  width="185px" height="141px" /></a>';

 							first =true;
 						}
 						else
 						{
 							BS.videos+= '<a href="'+data+'" rel="prettyPhoto[movies]" > </a>';
// 							BS.videos+= '<a href="http://trailers.apple.com/movies/paramount/shutterisland/shutterisland-tvspot1_r640s.mov?width=640&height=272" rel="prettyPhoto[movies]" > </a>';
 							
 						}
 						 
 			        });
 					 
 					BS.videos+= '</div>';
 			    	$('#profile-videos').html(BS.videos);
 			    	
 			    	
 			    	$("area[rel^='prettyPhoto']").prettyPhoto();
 					$(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
 					$(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
 			
 				}
				
 				 
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
    backToPrevious :function(eventName){
      eventName.preventDefault();
      $(".star").hide();
  	  BS.AppRouter.navigate("class", {trigger: true});
    },
    
    /*
     * close the screen
     */
    closeScreen : function(eventName){
  	  eventName.preventDefault(); 
  	$(".star").hide();
  	  BS.AppRouter.navigate('streams', {trigger: true});
    },
	/**
	 * select primary/secondary status of image/video
	 */
    selectImageStatus :function(eventName){
    	var id = eventName.target.id;
        if(id == "img-primary") 
        {
        	$('#video-secondary').attr("checked","checked");
        }
        else if(id == "img-secondary")
        {
        	$('#video-primary').attr("checked","checked");
        }
        else if(id == 'video-primary')
        {
        	$('#img-secondary').attr("checked","checked");
        }
        else
        {
        	$('#img-primary').attr("checked","checked");
        }
    	
    },
   
    
});
