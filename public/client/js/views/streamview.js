BS.StreamView = Backbone.View.extend({

	 events :{
           "mouseenter .trigger" : "mouseOver",
           "mouseleave .trigger" : "mouseOut",
           "click #school" : "renderPopups",
           "click #classstream" :"classStream",
           "click #projectStream" :"projectstream",
           "click #studyStream" :"studyStream",
           "click #groupStream" :"groupStream",
           "click #peerStream" : "peerStream",
           "click #friendStream" :"friendStream",
           "click #all-streams" : "showAllStreams",
           "click #classStreams-list" : "showClassStreams",
           "click #projectStreams-list" : "showProjectStreams",
           "click #streams-list li" : "selectOneStream"
           
        	   
		  
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
				}
		 });
    },
    /*
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
               
	        // reset position of popup box
	    	$('.popup').css({
		        top:  810,
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
//    	$(".modal select:visible").selectBox();
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
     *  Show all streams
     */
    showAllStreams :function(eventName){
    	eventName.preventDefault();
    	var id = eventName.target.id;
    	$('#select-streams li.active').removeClass('active');
   	    $('#'+id).parents('li').addClass('active');
    	this.getStreams();
    	
    },
    
    /**
     * list all class streams
     */
    
    showClassStreams :function(eventName){
    	eventName.preventDefault();
    	var id = eventName.target.id;
    	$('#select-streams li.active').removeClass('active');
  	    $('#'+id).parents('li').addClass('active');
    	$('#streams-list').html('');
    },
    /**
     * show all project streams
     */
    showProjectStreams:function(eventName){
    	eventName.preventDefault();
    	var id = eventName.target.id;
    	$('#select-streams li.active').removeClass('active');
  	    $('#'+id).parents('li').addClass('active');
    	$('#streams-list').html('');
    },
    /**
     * select one stream from stream list
     */
    selectOneStream :function(eventName){
      eventName.preventDefault();
      var id = eventName.target.id;
      $('#streams-list li.active').removeClass('active');
      $('#'+id).parents('li').addClass('active');
    }
});