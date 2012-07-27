 
BS.StreamView = Backbone.View.extend({

	 events :{
           "mouseenter .trigger" : "mouseOver",
           "mouseleave .trigger" : "mouseOut",
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
           "click i.rocked" : "rockedIt",
           "mouseenter a#rocks" : "showRockers",
           "mouseleave a#rocks" : "hideRockers",
           "click .edit_profilepicture" : "showProfilePage",
           "click .nav-tabs li" : "showActive",
           "click .class-nav-list li" :"showListActive",
           "keypress #msg" : "postMessageOnEnterKey",
 
	 },
	 

    initialize:function () {
    	console.log('Initializing Stream View');
    	BS.urlRegex = /(https?:\/\/[^\s]+)/g;
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
        
       this.getStreams();
//       this.getClassStreams("public");
       $(this.el).html(this.template(this.model.toJSON()));
        
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
					 var classStreams ='';
					 _.each(datas, function(data) {
						 
							streams+= '<li ><span class="flag-piece"></span><a id ="'+data.id.id+'" name ="'+data.streamName+'" href="#">'+data.streamName+' <i class="icon"></i></a><span class="popout_arrow"><span></span></span></li>';
	 						classStreams+= '<li  id="'+data.id.id+'"><a id="'+data.id.id+'"  href="#">'+data.streamName+'</a></li>';

					 });
					 
					 $('#streams-list').html(streams);
					 $('#streams-list li:first').addClass('active');
					 
					 
					 
					 // display the messages of the first stream in the stream list by default
                     var streamId = $('#streams-list li.active a').attr('id');
                     var streamName = $('#streams-list li.active a').attr('name');
                     
      
                     
                     // render sub menus in stream page
                     var source = $("#tpl-stream-page-menus").html();
             		 var template = Handlebars.compile(source);
             		 $('#sub-menus').html(template({streamName : streamName}));
             		 
             	     // right one list
             		 $('#public-classes').html(classStreams);
             		 
             		 
             		//set active class on right top
	                 $('#public-classes').find('li.active').removeClass('active');
	              	 $('#public-classes').find('li#'+streamId+'').addClass('active');
             		
                     if(streamId)
                      self.getMessageInfo(streamId);
             
				}
		 });
    },
    /**
     * get all class streams of a user
     */
    getClassStreams : function(type){
    	 
    	 var self =this;
         /* get all streams  */
 		 $.ajax({
 				type : 'GET',
 				url : BS.classStreamsForUser,
 				dataType : "json",
 				success : function(datas) {
 					
 					 var classStreams ='';
 					 var streams ='';
 					 _.each(datas, function(data) {
 						 
 						streams+= '<li  ><span class="flag-piece"></span><a id ="'+data.id.id+'" name ="'+data.streamName+'" href="#">'+data.streamName+' <i class="icon"></i></a><span class="popout_arrow"><span></span></span></li>';
 						classStreams+= '<li  id="'+data.id.id+'"><a id="'+data.id.id+'"  href="#">'+data.streamName+'</a></li>';
 					 });
 					 if(type == 'sort')
 					 {
 						 $('#streams-list').html(streams);
 						 $('#streams-list li:first').addClass('active');
 						 
 						 // display the messages of the first stream in the stream list by default
 	                     var streamId = $('#streams-list li.active a').attr('id');
 	                     var streamName = $('#streams-list li.active a').attr('name');
 	                     
 	                    //right one list
 	             		 $('#public-classes').html(classStreams);

 	                     
 	                     //set active class on right top
 	                     $('#public-classes').find('li.active').removeClass('active');
 	              	     $('#public-classes').find('li#'+streamId+'').addClass('active');
 	                     
 	                     // render sub menus in stream page
 	                     var source = $("#tpl-stream-page-menus").html();
 	             		 var template = Handlebars.compile(source);
 	             		 $('#sub-menus').html(template({streamName : streamName}));
 	             		 
 	             		  	             		 
 	             		 if(streamId)
 	                        self.getMessageInfo(streamId);
 	             	 
 	                     
 					 }
 					 else if(type == "public")
 					 {
 						 $('#public-classes').html(classStreams);
 						 
 						 //set active  for the same activated class at left 
 						 var sId = $('#streams-list li.active a').attr('id');
 						 $('#public-classes').find('li#'+sId+'').addClass('active');
 					 }
 					 
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
            var top = x.top - 45;
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
      var streamName = eventName.target.name;
      
      streamName = $('#'+id+'').text();

      $('#streams-list li.active').removeClass('active');
      $('#'+id).parents('li').addClass('active');
      
      //set active class on right top
      $('#public-classes').find('li.active').removeClass('active');
	  $('#public-classes').find('li#'+id+'').addClass('active');
      
      // render sub menus in stream page
      var source = $("#tpl-stream-page-menus").html();
	  var template = Handlebars.compile(source);
	  $('#sub-menus').html(template({streamName : streamName}));
		 
      // call the method to display the messages of the selected stream
	  $('.timeline_items').html("");
      this.getMessageInfo(id);
       
    },
    /**
     * post a message
     */
    postMessage :function(eventName){
    	 
   //   eventName.preventDefault();
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
  	  
  	  //find link part from the message
      var link =  message.match(BS.urlRegex); 
      if(link)
      {
    	  /* post url information */
          $.ajax({
    			type : 'POST',
    			url : BS.bitly,
    			data : {
    				 link : link[0]
    			},
    			dataType : "json",
    			success : function(data) {
    				 message = message.replace(link[0],data.data.url);
    				 self.postMsg(message,streamId,messageAccess);
    			}
    		});
      }
      //if link not present
      else
      {
    	  self.postMsg(message,streamId,messageAccess);
      }
  	  
    },
    /**
     * post message with shortURL if present
     */
    postMsg:function(message,streamId,messageAccess){
    	
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
  				   if(data.status == "Failure")
  				   {
  					   alert("Enter School & Class to post a message in a stream");
  				   }
  				   else
  				   {
  					      // append the message to message list
  						_.each(data, function(data) {
  							 
  							var msgBody = data.messageBody;
  							var linkTag =  msgBody.replace(BS.urlRegex, function(url) {
					             return '<a href="' + url + '">' + url + '</a>';
					        });
  							  
  							var datas = {
   							 	 "datas" : data,
   						    }
  							  
  							var source = $("#tpl-messages").html();
  	  						var template = Handlebars.compile(source);
  	  						$('.timeline_items').prepend(template(datas));
  	  						
  	  						//get profile image of logged user
  	  					    $('img#'+data.id.id+'-img').attr("src", BS.profileImageUrl);
  	  					    
  	  						if(linkTag)
  	  						  $('div#'+data.id.id+'-id').html(linkTag);
  	  						
  	  						 // embedly
	  	  					 $('div#'+data.id.id+'-id').embedly({
		 					   	  maxWidth: 200,
		 				          wmode: 'transparent',
		 				          method: 'after',
		 					      key:'4d205b6a796b11e1871a4040d3dc5c07'
	  	  					 });
  	  						
  				         });
  						 
  				   }
  				   $('#msg').val("");
  				 
  			}
  		});
    	
    } ,
    
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
 
					  _.each(data, function(data) {
							
							var msgBody = data.messageBody;
							var linkTag =  msgBody.replace(BS.urlRegex, function(url) {
					             return '<a href="' + url + '">' + url + '</a>';
					        });
							  
							var datas = {
 							 	 "datas" : data,
 						     }
							  
							 var source = $("#tpl-messages").html();
	  						 var template = Handlebars.compile(source);
	  						 $('.timeline_items').prepend(template(datas));
	  						 
	  						 
	  						 /* get profile images for messages */
	  				          $.ajax({
	  				    			type : 'POST',
	  				    			url : BS.profileImage,
	  				    			data : {
	  				    				 userId :  data.userId.id
	  				    			},
	  				    			dataType : "json",
	  				    			success : function(imgUrl) {
	  				    				 
	  				    				$('img#'+data.id.id+'-img').attr("src", imgUrl);
	  				    			}
	  				    		});
	  				          
	  				          
	  						 if(linkTag)
	  						  $('div#'+data.id.id+'-id').html(linkTag);
	  						 
	  					     // embedly
	  						 $('div#'+data.id.id+'-id').embedly({
		  					   	  maxWidth: 200,
		  				          wmode: 'transparent',
		  				          method: 'after',
		  					      key:'4d205b6a796b11e1871a4040d3dc5c07'
	  				         });
				         });
						 
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
  	    	// this.getClassStreams("public");
  	    	
  	    }
  	    // show all classStreams
  	    else if(id == 'classStreams-list')
  	    {
//  	    	$('#streams-list').html('');
  	    	this.getClassStreams("sort");
  	    }
  	    // show all projectStreams
  	    else if(id == 'projectStreams-list')
  	    {
  	    	$('#streams-list').html('');
  	    	 $('#public-classes').html('');
  	    }
  	    else
  	    {
  	    	
  	    }
  	   $('#streams-list').slideDown();
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
		 
		 $.ajax({
             type: 'POST',
             url:BS.rockedIt,
             data:{
            	  messageId:msgId
             },
             dataType:"json",
             success:function(data){
            	 
            	// display the count in icon
            	$('li#'+msgId+'').find('i').find('i').html(data);
 
             }
          });
	 },
	 
	 /**
	  * get rockers 
	  */
	 getRockers :function(msgId,position){
		  
		 $.ajax({
             type: 'POST',
             url:BS.rockersList,
             data:{
            	  messageId:msgId
             },
             dataType:"json",
             success:function(data){
            	 
            	  // prepair rockers list
            	  var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">Who Rocked it ?</div><ul class="rock-list">';
            	_.each(data, function(rocker) {
					 
            		ul+= '<li>'+rocker+'</li>';
			    });
            	ul+='</ul>';
 
//        		$('#hover-lists-'+msgId+'').fadeIn("fast");
        		$('#hover-lists-'+msgId+'').fadeIn("fast").delay(1000).fadeOut('fast'); 
        		$('#hover-lists-'+msgId+'').html(ul);
             }
          });
	 },
	 
	 /**
	  * show rockers list on hover over
	  */
	 showRockers:function(eventName){
		 
		 eventName.preventDefault();
		
		 var element = eventName.target.parentElement;
		 var msgId =$(element).closest('li').attr('id');
		 var position = $('li#'+msgId+'').find('i').position();
		 this.getRockers(msgId,position);
 
	 },
	 
	 /**
	  * hide rockers list
	  */
	 hideRockers:function(eventName){
//		 eventName.preventDefault();
//		 var element = eventName.target.parentElement;
//		 var msgId =$(element).closest('li').attr('id');
//		 $('#hover-lists-'+msgId+'').fadeOut("fast");
//		 
//		// setTimeout(function(){ ('#hover-lists-'+msgId+'').fadeOut("fast"); }, 3000);
 
	 },
	 
  
	 /**
	  * navigate to profile page to edit profile pic
	  */
	 showProfilePage : function(eventName){
		  
		 eventName.preventDefault();
		 BS.AppRouter.navigate("profile", {trigger: true});
	 },
	 
	 /**
	  * show as active 
	  */
	 
	 showActive :  function(eventName){
		  
		 $('.nav-tabs li.active').removeClass('active');
		 $(eventName.target).parents('li').addClass('active');
	 },
	 
	 showListActive : function(eventName){
		 eventName.preventDefault();
		 
		 var streamId = eventName.target.id;
		 $('.class-nav-list li.active').removeClass('active');
		 $(eventName.target).parents('li').addClass('active');
		 
		 
		 
		 //set active class on right top
         $('#streams-list').find('li.active').removeClass('active');
   	     $('#streams-list').find('a#'+streamId+'').parent('li').addClass('active');
   	     
   	    // call the method to display the messages of the selected stream
         this.getMessageInfo(streamId);
		 
	 },
	 
	 postMessageOnEnterKey : function(eventName){
		 var self = this;
		 if(eventName.which == 13) {
			 self.postMessage(); 
		 }

	 },
	 
 
	 
});