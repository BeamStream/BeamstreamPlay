 
BS.StreamView = Backbone.View.extend({

	 events :{
           "mouseenter .trigger" : "mouseOver",
           "mouseleave .trigger" : "mouseOut",
           "click #school" : "renderPopups",
           "click #sign-out" : "signOut",
           "click #classstream" :"classStream",
           "click #projectStream" :"projectstream",
           "click #studyStream" :"studyStream",
           "click #groupStream" :"groupStream",
           "click #peerStream" : "peerStream",
           "click #friendStream" :"friendStream",
           "click #streams-list li" : "selectOneStream",
           "click #post-msg": "postMessage",
           "click ul#select-streams li a" : "showStreamList",
           "click #icon-up" :"slideUp",
           "click #icon-down" : "slideDown",
           "click a.rock" : "rockedIt",
//           "mouseenter i.rocked" : "showRockers",
//           "mouseleave  i.rocked" : "hideRockers"
        	   
		  
	 },
	

    initialize:function () {
    	
    	 console.log('Initializing Stream View');
    
    	/* for hover over */
	    this.distance = 10;
	    this.time = 250;
	    this.hideDelay = 500;
	    this.hideDelayTimer = null;
	    // tracker
	    this.beingShown = false;
	    this.shown = false;
	    this.trigger = $('.trigger');
	    this.popup = $('.popup').css('opacity', 0);
    	 
       
		this.source = $("#tpl-main-stream").html();
		this.template = Handlebars.compile(this.source);
    },

    render:function (eventName) {
    	
    	this.newUser = new BS.SingleUser();
        this.newUser.fetch({success: function(e) {  
        	 
			 $('.username').text(e.attributes.firstName + ' ' + e.attributes.lastName);
			 $('li.location .icon-location').after(e.attributes.location);
			 $('li.occupation .icon-silhouette').after(e.attributes.userType.name);
			 $('#user-dropdown .arrow').before(e.attributes.firstName + ' ' + e.attributes.lastName);
			 $('li.screen_name').text(e.attributes.firstName + ' ' + e.attributes.lastName);
		}});
     
       this.getStreams();
 
       $(this.el).html(this.template);
        
       return this;
    },
    
    /**
     * get all streams
     */
    getStreams :function(){
    	 
    	 var self =this;
        /* get all streams  */
		 $.ajax({
				type : 'GET',
				url : BS.allStreamsForAUser,
				dataType : "json",
				success : function(datas) {
					
					 var streams ='';
					 _.each(datas, function(data) {
							 
							streams+= '<li><span class="flag-piece"></span><a id ="'+data.id.id+'" href="#">'+data.streamName+' <i class="icon"></i></a><span class="popout_arrow"><span></span></span></li>';
					 });
					  
					 $('#streams-list').html(streams);
					 $('#streams-list li:first').addClass('active');
					 
					 // display the messages of the first stream in the stream list by default
                     var streamId = $('#streams-list li.active a').attr('id');
                     if(streamId)
                      self.getMessageInfo(streamId);
             
				}
		 });
    },
    
   
    /**
     *  hover over for Create Stream button
     */
    mouseOver:function () {
    	 
    	 // stops the hide event if we move from the trigger to the popup element
	     if (this.hideDelayTimer) clearTimeout(this.hideDelayTimer);
           
	     // don't trigger the animation again if we're being shown, or already visible
	     if (this.shown) {
	        return;
	     } else 
	     {
	    	this.beingShown = true;
            var x= $('#create_stream').position();
            var top = x.top - 150;
	        // reset position of popup box
	    	$('.popup').css({
		        top:  top,
		        left: 380,
		        display: 'block' // brings the popup back in to view
	        })
	        // (we're using chaining on the popup) now animate it's opacity and position
	        .animate({
		        top: '-=' + this.distance + 'px',
		        opacity: 1
	        },this.time, 'swing', function() {  
		        // once the animation is complete, set the tracker variables
		        this.beingShown = false;
		        this. shown = true;
	        });
	      }
    },
    
    
    mouseOut:function (){
    	 
    	  // reset the timer if we get fired again - avoids double animations
	      if (this.hideDelayTimer) clearTimeout(this.hideDelayTimer);
	      
	      // store the timer so that it can be cleared in the mouseover if required
	      this.hideDelayTimer = setTimeout(function () {
	    	  
	    	  this.hideDelayTimer = null;
	    	  $('.popup').animate({
		          top: '-=' + this.distance + 'px',
		          opacity: 0
	          }, this.time, 'swing', function () {
		          // once the animate is complete, set the tracker variables
		          this.shown = false;
		          // hide the popup entirely after the effect (opacity alone doesn't do the job)
		          $('.popup').css('display', 'none');
	        });
	      }, this.hideDelay);
    },
 
    
    renderPopups: function(){
    	
    	$('.modal-backdrop').show();
    	this.school1 = new BS.SchoolView();
    	this.school1.render();
    	$('#school-popup').html(this.school1.el);
        $('.modal .datepicker').datepicker();
  
    },
    /*
     * display class stream
     */
    classStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.classStream = new BS.ClassStreamView();
    	this.classStream.render();
    	$('#school-popup').html(this.classStream.el);
    },
    /*
     * display Project stream screen
     */
    projectstream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.projectStream = new BS.ProjectStreamView();
    	this.projectStream.render();
    	$('#school-popup').html(this.projectStream.el);
    
    },
    /*
     * display Study stream
     */
    studyStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.studytStream = new BS.StudyStreamView();
    	this.studytStream.render();
    	$('#school-popup').html(this.studytStream.el);
    
    },
    
    /*
     * display Group stream
     */
    groupStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.grouptStream = new BS.GroupStreamView();
    	this.grouptStream.render();
    	$('#school-popup').html(this.grouptStream.el);
    
    },
    
    /*
     * display Peer stream
     */
    peerStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.peertStream = new BS.PeerStreamView();
    	this.peertStream.render();
    	$('#school-popup').html(this.peertStream.el);
    
    },
    
    /**
     * display friend stream
     */
    friendStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.friendStream = new BS.FriendStreamView();
    	this.friendStream.render();
    	$('#school-popup').html(this.friendStream.el);
    
    },
    
    /**
     * select one stream from stream list
     */
    selectOneStream :function(eventName){
      eventName.preventDefault();
      var id = eventName.target.id;
      $('#streams-list li.active').removeClass('active');
      $('#'+id).parents('li').addClass('active');
      
      // call the method to display the messages of the selected stream
      this.getMessageInfo(id);
       
    },
    /**
     * post a message
     */
    postMessage :function(eventName){
      eventName.preventDefault();
      var self= this;
      /* get message details from form */
      var messageAccess;
      var streamId = $('#streams-list li.active a').attr('id');
      var message = $('#msg').val();
     
      var msgAccess =  $('#id-private').attr('checked');
  	  if(msgAccess == "checked")
  	  {
  		messageAccess = "Private";
  	  }
  	  else
  	  {
  		messageAccess = "Public";
  	  }
      
  	  /* post message information */
      $.ajax({
			type : 'POST',
			url : BS.postMessage,
			data : {
				message : message,
				streamId : streamId,
				messageAccess :messageAccess
			},
			dataType : "json",
			success : function(data) {
				   
				  // append the message to message list
				  var datas = {
					 		"datas" : data
				  }
				  
//				// get all rockers list
//				  _.each(data, function(msg) {
//					  self.getRockers(msg.id.id);
//				  });
				  var source = $("#tpl-messages").html();
				  var template = Handlebars.compile(source);
				  $('.timeline_items').prepend(template(datas));
				  $('#msg').val("");
			}
		});
 
    },
    
    /**
     * get all details about messages and its comments of a stream
     */
    getMessageInfo :function(streamid){
 
         var self = this;
         /* get all messages of a stream  */
		 $.ajax({
				type : 'POST',
				url : BS.streamMessages,
				data :{
					streamId :streamid
				},
				dataType : "json",
				success : function(data) {
					 
					  //display the messages
					  var datas = {
					 		"datas" : data
					  }
					  
//					  // get all rockers list
//					  _.each(data, function(msg) {
//						  self.getRockers(msg.id.id);
//					  });
					  var source = $("#tpl-messages").html();
					  var template = Handlebars.compile(source);
					  $('.timeline_items').html(template(datas));
             
				}
		 });
    	
    	
    },
    
    /**
     * show stream list corresponds to each streamtype
     */
    showStreamList:function(eventName){
    	
     	eventName.preventDefault();
    	var id = eventName.target.id;
    	$('#select-streams li.active').removeClass('active');
  	    $('#'+id).parents('li').addClass('active');
  	    $('#streams-list').slideUp();
  	    // show all streams
  	    if(id == 'all-streams')
  	    {
  	    	 this.getStreams();
  	    	
  	    }
  	    // show all classStreams
  	    else if(id == 'classStreams-list')
  	    {
  	    	$('#streams-list').html('');
  	    }
  	    // show all projectStreams
  	    else if(id == 'projectStreams-list')
  	    {
  	    	$('#streams-list').html('');
  	    }
  	    else
  	    {
  	    	
  	    }
  	   $('#streams-list').slideDown();
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
				
					 BS.AppRouter.navigate("login", {trigger: true, replace: true});
				}
		 });
		
	 },
	 /**
	  * slide up for left most stream list
	  */
	 slideUp :function(eventName){
		 eventName.preventDefault();
		 $('#streams-list').slideUp();
		 
	 },
	 /**
	  * slide down for left most stream list
	  */
	 slideDown:function(eventName){
		 eventName.preventDefault();
		 $('#streams-list').slideDown();
	 },
	 
	 /**
	  * get Rocked count
	  */
	 
	 rockedIt :function(eventName){
		 
		 eventName.preventDefault();
		 var element = eventName.target.parentElement;
		 var msgId =$(element).closest('li').attr('id');
		 
		 // get all rockers list
		 this.getRockers(msgId);
 
	 },
	 /**
	  * get rockers 
	  */
	 getRockers :function(msgId){
		 
		 $.ajax({
             type: 'POST',
             url:BS.rockedIt,
             data:{
            	  messageId:msgId
            	 },
            	 
             dataType:"json",
             success:function(data){
            	// display the count in icon
            	$('li#'+msgId+'').find('i').find('i').html(data.totalroks);
//            	  var ul = '<ul>';
//            	_.each(data.rockers, function(rocker) {
//					 
//            		ul+= '<li>'+rocker+'</li>';
//			    });
//            	ul+='</ul>';
//                $('#'+msgId+'-rockers').html(ul);
//                $('#'+msgId+'-rockers').hide();
             }
          });
		 
	 },
	 
	 /**
	  * show rockers list on hover over
	  */
	 
	 showRockers:function(eventName){
		 
		 eventName.preventDefault();
		  
		 $(eventName.target).attr('data-original-title', 'hello') ;
		 var element = eventName.target.parentElement;
		 var msgId =$(element).closest('li').attr('id');
		 
		 $('#'+msgId+'-rockers').show();
	 },
	 
	 /**
	  * hide rockers list
	  */
	 hideRockers:function(eventName){
		 eventName.preventDefault();
		 var element = eventName.target.parentElement;
		 var msgId =$(element).closest('li').attr('id');
		 $('#'+msgId+'-rockers').hide();
	 },
});