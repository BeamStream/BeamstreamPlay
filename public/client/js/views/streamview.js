BS.StreamView = Backbone.View.extend({

	 events :{
           "mouseenter .trigger" : "mouseOver",
           "mouseleave .trigger" : "mouseOut",
           "click #school" : "renderPopups",
           "click #classstream" :"classStream"
 
		  
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
        
        $(this.el).html(this.template);
        return this;
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
    
    }
    
    
});