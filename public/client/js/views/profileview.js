window.ProfileView = Backbone.View.extend({

	events: {
	      "click #save": "saveProfile",
	      "click #complete": "complete",
//	      "click #profile-photo": "uploadPhoto",
	 },
	 
    initialize:function () {
    	
        console.log('Initializing Profile View');
        this.template= _.template($("#tpl-profile-reg").html());
        
        
        /* TODO get locally stored data */
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
    
    /**
     * save / post profile details
     */
    saveProfile:function (eventName) {
    	
    
    	//TODO: Test f
    	
    	/*
    	eventName.preventDefault();
    	var regDetails = this.getRegDetails();*/
    	
    	/* post data with school,class & profile details */
    	/*
		$.ajax({
			type : 'POST',
			url : "http://192.168.10.10/client/api.php",
			data : {
				data : regDetails
			},
			dataType : "json",
			success : function(data) {
				var source = $("#tpl-success").html();
				var template = Handlebars.compile(source);
				$("#success").html(template(data));
			}
		});

		*/
    },
    
    /**
     * save whole details when click on 'COMPLETE' button
     */
    complete:function (eventName) {
    	
    	eventName.preventDefault();
    	
//    	var regDetails = this.getRegDetails();
//    	
//    	/* post data with school,class & profile details */
//		$.ajax({
//			type : 'POST',
//			url : "http://192.168.10.10/client/api.php",
//			data : {
//				data : regDetails
//			},
//			dataType : "json",
//			success : function(data) {
//				var source = $("#tpl-success").html();
//				var template = Handlebars.compile(source);
//				$("#success").html(template(data));
//			}
//		});
    },
    
    /**
     * upload profile photo
     */
    uploadPhoto:function (eventName) {
    	eventName.preventDefault();
        console.log("34534");
        console.log($('#profile-photo').val());
    },		
    
    
    getRegDetails:function (eventName) {
    	var i;
	    var profileModel = new Profile();
	    profileModel.set({
	    	photoUrl : "http://localhost/client/images/no-photo.png",
	    	videoUrl :"http://localhost/client/images/video.mp3",
	    	mobile : $('#mobile').val(),
	    	upload : $('#upload').val(),
		});
		 
		var profileDetails = JSON.stringify(profileModel);

		/* get local stored registration details */
		var localStorageKey = "registration";
		var data = localStorage.getItem(localStorageKey);

		var regData = jQuery.parseJSON(data);

		// add profile details to local
		regData[0].profile = jQuery.parseJSON(profileDetails);

		var regDetails = JSON.stringify(regData);
		localStorage.setItem(localStorageKey, regDetails);

		console.log(regDetails);
		return regDetails;

    },	
   
    
});