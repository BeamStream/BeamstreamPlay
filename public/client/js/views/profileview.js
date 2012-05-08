window.ProfileView = Backbone.View.extend({

	events: {
	      "click #save": "saveprofile",
	 },
	 
    initialize:function () {
    	
        console.log('Initializing Profile View');
        this.template= _.template($("#tpl-profile-reg").html());
        
        
        /* get locally stored data */
        var localStorageKey = "notes"; 
	    var data = localStorage.getItem(localStorageKey);
		if (data == null) {
			//console.log('Nothing in store');
		}
		else if (data.length === 0) {
			//console.log('Store contains empty value');
		}
		else
		{
			console.log(localStorage['classcode']);
		}
		  	   
	  	  
        
        
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    
    /* save profile details */
    saveprofile:function (eventName) {
    	
    	var photoUrl =  "http://localhost/client/images/no-photo.png";//$('#my_image').attr('src','second.jpg');
        var videoUrl = "http://localhost/client/images/video.mp3";
        var mobile = $('#mobile').val(); 
        var upload = $("#upload option:selected").text();
        
        var profile = new Profile();
        profile.set({photourl: photoUrl, videourl: videoUrl, mobile: mobile, upload: upload});
        profile.save();
        
        
       
    }
    
   
    
});