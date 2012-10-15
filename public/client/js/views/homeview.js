BS.NavView = Backbone.View.extend({
  
	events:{
		
   	 "click #school-pop" : "renderPopups",
   	 "click #class-pop" : "renderClassPopups",
   	 "click #sign-out" : "signOut",
   	 "click nav li" : "showActiveClass",
   	 "click #settings" : "renderSettings"
     
   },
	
    initialize:function () {      
      var self=this;
      var source = $("#tpl-navs").html();
      this.template = Handlebars.compile(source);     
      this.model.bind("change", this.render, this);
    
    },

    render:function (eventName) {
       $(this.el).html(this.template(this.model.toJSON()));
       return this;
    },
    /**
     * show profile picture
     */
    showProfilePic : function(eventName){
    	
    	var userData  = this.model.toJSON();
    	 
    	/* get profile images for user */
        $.ajax({
  			type : 'POST',
  			url : BS.profileImage,
  			dataType : "json",
  			data : {
	    				 userId :  userData.id.id
	    			},
  			success : function(data) {
  				
  			     // default profile image
				 if(data.status)
				 {
					  
					 BS.profileImageUrl = "images/unknown.jpeg";
	    	        	 
				 }
				 else
				 {   
					 // shoe primary profile image 
					 if(data.contentType.name == "Image")
					 {
						 BS.profileImageUrl = data.mediaUrl;
					 }
					// shoe primary profile video 
					 else
					 {
						 BS.profileImageUrl = data.frameURL;
					 }
				 }
  			 
	    	     $('#right-photo').attr("src",BS.profileImageUrl);
  	        	
  			}
  	   });
    },
    
    /**
     * show school popups
     */
    renderPopups: function(eventName){
    	  
    	 eventName.preventDefault();
//    	 BS.editSchool = true;
    	 localStorage["editSchool"]="true";
    	 BS.AppRouter.navigate("school", {trigger: true});
  
    },
    /**
     * render class popup
     */
    renderClassPopups :function(eventName){
    	eventName.preventDefault();
//    	BS.editClass = true;
    	localStorage["editClass"]="true";
    	BS.AppRouter.navigate("class", {trigger: true});
    },
    
    /**
     * render settings view
     */
    renderSettings :function(eventName){
    	eventName.preventDefault();
    	BS.AppRouter.navigate("settings", {trigger: true});
    },
    /**
	 * function for sign out
	 */
	 signOut :function(eventName){
		 eventName.preventDefault();
		 
		 /* expires the usersession  */
		 $.ajax({
				type : 'GET',
				url : BS.signOut,
				dataType : "json",
				success : function(datas) {
					 localStorage.clear();  
					 localStorage["regInfo"] = '';
//					 BS.user.set('loggedin', false);
					 $('#middle-content').children().detach();
					 BS.AppRouter.navigate("login", {trigger: true});
				}
		 });
	 },
 
	 /**
	  * show active class
	  * 
	  */
	 showActiveClass :function(eventName){
		 
		 eventName.preventDefault();
		 var id = eventName.target.id;
	      
		 $('nav li.active').removeClass('active');
	     $('#'+id).addClass('active');
	     if(id == "file-media")
	     {
	    	 BS.AppRouter.navigate("filesMedia", {trigger: true});
		   	
	     }
	     else if(id == "streamsGroups")
	     {
	    	 BS.AppRouter.navigate("streams", {trigger: true});
	     }
	 }
 
});


/**
 * For stream page sub menus 
 */


BS.StreamPageMenuView = Backbone.View.extend({
	  
    initialize:function () {      
      var self=this;
      var source = $("#tpl-stream-page-menus").html();
      this.template = Handlebars.compile(source);     
      
    
    },

    render:function (eventName) {
    	  
       $(this.el).html(this.template());
       return this;
    },

    
    
 
});