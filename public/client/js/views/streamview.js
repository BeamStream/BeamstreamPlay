 
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
           "click i.rock-message" : "rockMessage",
           "click i.rock-comment" :"rockComments",
           "mouseenter a#rocks" : "showRockers",
           "click a.rock" : "preventDefault",
           "mouseenter a#cmtrock" : "showCommentRockers",
           "click .edit_profilepicture" : "showProfilePage",
           "click .nav-tabs li" : "showActive",
           "click .class-nav-list li" :"showListActive",
           "keypress #msg" : "postMessageOnEnterKey",
           "click .comment": "showCommentSection",
           "keypress .add_message_comment" : "addComment",
           "click .hide_comments" : "hideComments",
           "click .show_comments" : "showComments",
           "click #sort-messages li a" : "sortMessages",
           "keypress #sort_by_key" : "sortMessagesByKey",
           "click .msg-follow" : "followMessage",
//           "click #msg"  : "showBitleys",
           "click .social_media" : "uncheckPrivate",
           "click #id-private" : "makePrivate",
//           "keyup #msg" : "makeBitly",
        	"click .username a" : "renderPublicProfile"
           
 
	 },
	 

    initialize:function () {
    	console.log('Initializing Stream View');
    	BS.urlRegex1 = /(https?:\/\/[^\s]+)/g;
    	BS.urlRegex = /^(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\/]*$/i ;
    	BS.urlRegex2 =  /^((http|https|ftp):\/\/)/;
    	BS.commentCount = 0;
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
		
		
		/* pagination on scrolling */
		
		BS.msgSortedType = '';
		BS.pagenum = 1;
		BS.pageForVotes = 1;
		BS.pageForDate = 1;
		BS.pageForKeyword = 1;
		BS.pageLimit = 10;
	    var self = this;
	    
		$(window).bind('scroll', function (ev) {
			 
			var streamPage = $('nav li.active').attr('id');
			
			if(streamPage == "streamsGroups")
			{
				var scrollTop =$(window).scrollTop();
				var docheight = $(document).height();
				var widheight = $(window).height();
				if(scrollTop + 1 == docheight- widheight || scrollTop == docheight- widheight){
				
			 	   var t = $('.timeline_items').find('li');
				   if(t.length != 0)
				   {
						$('.page-loader').show();
						var streamId = $('#streams-list li.active a').attr('id');
					
						if(BS.msgSortedType == "")
						{    BS.pagenum++;
							self.getMessageInfo(streamId,BS.pagenum,BS.pageLimit);
						}
						else if(BS.msgSortedType == "vote")
						{    BS.pageForVotes++
							 self.sortByVotes(streamId,BS.pageForVotes,BS.pageLimit)
						}
						else if(BS.msgSortedType == "keyword")
						{
							BS.pageForKeyword++;
							var keyword = $('#sort_by_key').val();
							self.sortBykeyword(streamId,keyword,BS.pageForKeyword,BS.pageLimit);
						}
						else if(BS.msgSortedType == "date")
						{
							 BS.pageForDate++;
							 self.sortByDate(streamId,BS.pageForDate,BS.pageLimit);
						}
				   }
				 }
				else
				{
					  $('.page-loader').hide();
				}
			}
			
		 });
    },
 
     
    render:function (eventName) {
        
       this.getStreams();
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
	              	 $('.timeline_items').html("");
	              	 BS.pagenum =1;  
                     if(streamId)
                      self.getMessageInfo(streamId,BS.pagenum,BS.pageLimit);
             
				}
		 });
    },
    
    /**
     * get all class streams of a user
     */
    getClassStreams : function(type){
    	 
    	 var self =this;
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
 	             		 $('.timeline_items').html("");
 	             		 BS.pagenum =1;
 	             		 if(streamId)
 	             			self.getMessageInfo(streamId,BS.pagenum,BS.pageLimit);
 	             	 
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
 
    /**
     * display class stream
     */
    classStream :function(eventName) {
    	eventName.preventDefault();
    	BS.AppRouter.navigate("classStream", {trigger: true});
    },
    
    /**
     * display Project stream screen
     */
    projectstream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.projectStream = new BS.ProjectStreamView();
    	this.projectStream.render();
    	$('#school-popup').html(this.projectStream.el);
    
    },
    
    /**
     * display Study stream
     */
    studyStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.studytStream = new BS.StudyStreamView();
    	this.studytStream.render();
    	$('#school-popup').html(this.studytStream.el);
    
    },
    
    /**
     * display Group stream
     */
    groupStream :function(eventName) {
    	 
    	$('.modal-backdrop').show();
    	this.grouptStream = new BS.GroupStreamView();
    	this.grouptStream.render();
    	$('#school-popup').html(this.grouptStream.el);
    
    },
    
    /**
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
      
      
      $('#sort-messages').find('li.active').removeClass('active');
	  $('#highest-rated').closest('li').addClass('active');
		 
      //set active class on right top
      $('#public-classes').find('li.active').removeClass('active');
	  $('#public-classes').find('li#'+id+'').addClass('active');
      
      // render sub menus in stream page
      var source = $("#tpl-stream-page-menus").html();
	  var template = Handlebars.compile(source);
	  $('#sub-menus').html(template({streamName : streamName}));
		 
      // call the method to display the messages of the selected stream
	  $('.timeline_items').html("");
	  
	  BS.pagenum = 1;
	  this.getMessageInfo(id,BS.pagenum,BS.pageLimit);
       
    },
    /**
     * post a message
     */
    postMessage :function(eventName){
      //var urlLink ='';
      var self= this;
      /* get message details from form */
      var messageAccess;
      var streamId = $('#streams-list li.active a').attr('id');
      var message = $('#msg').val();
      BS.updatedMsg =  message;
      
      if(!message.match(/^[\s]*$/))
      {
    	 
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
	    	  
	    	 if(!BS.urlRegex2.test(link[0])) {
	    		urlLink = "http://" + link[0];
	  	  	 }
	    	 else
	    	 {
	    		 urlLink =link[0];
	    	 }
	    	  
	    	 if(!urlLink.match(/^(http:\/\/bstre.am\/)/))
			 { 
	    		 
	    	  /* post url information */
	          $.ajax({
	    			type : 'POST',
	    			url : BS.bitly,
	    			data : {
	    				 link : urlLink
	    			},
	    			dataType : "json",
	    			success : function(data) {
	    				 message = message.replace(link[0],data.data.url);
	    				 self.postMsg(message,streamId,messageAccess);
	    			}
	    		});
			 }
	    	 else
	    	 {     
	    		 self.postMsg(message,streamId,messageAccess);
	    	 }
	    	
	      }
	      //if link not present
	      else
	      {
	    	  self.postMsg(message,streamId,messageAccess);
	      }
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
  					     /*auto ajax push */
  					   
 
  					   
  					      // append the message to message list
  						_.each(data, function(data) {
  							
  							var msgBody = data.messageBody;
  							var link =  msgBody.match(BS.urlRegex);
  							var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
  								 
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
                                   
  				   $('.selector').html("");
                   $('.selector').hide();
                   $('.emdform').find('input[type="hidden"].preview_input').remove();
                   $('#msg').val("");
 
  			}
  		});
    	
    } ,
    
    /**
     * get all details about messages and its comments of a stream
     */
    getMessageInfo :function(streamid,pageNo,limit){
    	 
         var self = this;
         /* get all messages of a stream  */
		 $.ajax({
				type : 'POST',
				url : BS.streamMessages,
				data :{
					streamId :streamid,
					pageNo : pageNo,
					limit : limit
					
				},
				dataType : "json",
				success : function(data) {
					 
					   //hide page loader image
					   if(!data.length)
						   $('.page-loader').hide();
						   
					    //display the messages
					  _.each(data, function(data) {
						  
							var msgBody = data.messageBody;
							var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
					             return '<a href="' + url + '">' + url + '</a>';
					        });
							  
							var datas = {
 							 	 "datas" : data,
 						    }
							  
							var source = $("#tpl-messages").html();
	  						var template = Handlebars.compile(source);
	  						$('.page-loader').hide();
	  						$('.timeline_items').append(template(datas));
	  						 
	  						/* check whether the user is follwer of a message or not */
	  				         $.ajax({
	  				    			type : 'POST',
	  				    			url : BS.isAFollower,
	  				    			data : {
	  				    				 messageId : data.id.id
	  				    			},
	  				    			dataType : "json",
	  				    			success : function(status) {
	  				    				 if(status == "true")
	  				    				   $('#'+data.id.id+'-follow').html("Unfollow");
	  				    			}
	  				    	 });
	  						 
	  						 
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
	  						 
	  						self.showAllComments(data.id.id);
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
  	    	 $('.timeline_items').html("");
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
	  * Rock Messages
	  */
	 
	 rockMessage :function(eventName){
		 
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
	  * Rock comments
	  */
	 rockComments :function(eventName){
		 
		 eventName.preventDefault();
		 var element = eventName.target.parentElement;
		 var commentId =$(element).closest('li').attr('id');
		 var messageId =$(element).closest('li').parent('ul').parent('article').parent('li').attr('id');
		 
		 $.ajax({
             type: 'POST',
             url:BS.rockingTheComment,
             data:{
            	  commentId:commentId,
            	  messageId : messageId
             },
             dataType:"json",
             success:function(data){
            	 
            	// display the count in icon
            	$('li#'+commentId+'').find('i').find('i').html(data);
 
             }
          });
	 },
	 
	 /**
	  * get list of message rockers 
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
	  * show comment rockers list on hover over
	  */
	 showCommentRockers:function(eventName){
		 
		 eventName.preventDefault();
		 var element = eventName.target.parentElement;
		 var commentId =$(element).closest('li').attr('id');
		 var position = $('li#'+commentId+'').find('i').position();
		 var messageId =$(element).closest('li').parent('ul').parent('article').parent('li').attr('id');
		 
		 $.ajax({
             type: 'POST',
             url: BS.commentRockers,
             data:{
            	  commentId:commentId,
            	  messageId :messageId
             },
             dataType:"json",
             success:function(data){
            	 
            	  // prepair rockers list
            	  var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">Who Rocked it ?</div><ul class="rock-list">';
            	_.each(data, function(rocker) {
					 
            		ul+= '<li>'+rocker+'</li>';
			    });
            	ul+='</ul>';
 
        		$('#cmthover-lists-'+commentId+'').fadeIn("fast").delay(1000).fadeOut('fast'); 
        		$('#cmthover-lists-'+commentId+'').html(ul);
             }
          });
 
	 },
	 
 
	 
  
	 /**
	  * navigate to profile page to edit profile pic
	  */
	 showProfilePage : function(eventName){
		  
		 eventName.preventDefault();
		 BS.editProfile = true;
		 BS.AppRouter.navigate("profile", {trigger: true});
	 },
	 
	 /**
	  * show as active 
	  */
	 showActive :  function(eventName){
		  
		 $('.nav-tabs li.active').removeClass('active');
		 $(eventName.target).parents('li').addClass('active');
	 },
	 
	 /**
	  * active li on class list
	  */
	 showListActive : function(eventName){
		 eventName.preventDefault();
		 
		 var streamId = eventName.target.id;
		 $('.class-nav-list li.active').removeClass('active');
		 $(eventName.target).parents('li').addClass('active');
		 
		 //set active class on right top
         $('#streams-list').find('li.active').removeClass('active');
   	     $('#streams-list').find('a#'+streamId+'').parent('li').addClass('active');
   	     
   	     // call the method to display the messages of the selected stream
   	     $('.timeline_items').html("");
   	     
   	     BS.pagenum = 1;
   	     this.getMessageInfo(streamId,BS.pagenum,BS.pageLimit);
		 
	 },
	 /**
	  * post message on enter key press
	  */
	 postMessageOnEnterKey : function(eventName){
		 var self = this;
		 
		 
		 if(eventName.which == 13) {
			 self.postMessage(); 
		 }
		 if(eventName.which == 32){
			 
			 var text = $('#msg').val();
			 var links =  text.match(BS.urlRegex); 
			 
			  /* create bitly for each url in text */
//			 _.each(links, function(link) {
				  
					 if(links)
				     {
						 
						 if(!BS.urlRegex2.test(links[0])) {
					    		urlLink = "http://" + links[0];
					  	 }
					     else
					     {
					    		urlLink =links[0];
					     }
						 /* don't create bitly for shortened  url */
						 if(!urlLink.match(/^(http:\/\/bstre.am\/)/))
						 { 
				    	  /* create bitly  */
				          $.ajax({
				    			type : 'POST',
				    			url : BS.bitly,
				    			data : {
				    				 link : urlLink 
				    			},
				    			dataType : "json",
				    			success : function(data) {
				    				 var msg = $('#msg').val();
				    				 message = msg.replace(links[0],data.data.url);
				    				 $('#msg').val(message);
				    				
				    			}
				    		});
				        }
				      }
//				});
			
			
		 }
		 $('#msg').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});

	 },
	 /**
	  * show all comments of a message
	  */
	 showAllComments :function(msgId)
	 {
	 
		 var parentMsg = msgId;
		 var parent =$('#'+parentMsg+'').closest('li').attr('id');
 		  
		 $.ajax({
             type: 'POST',
             url: BS.allCommentsForAMessage,
             data:{
            	  messageId:parent
             },
             dataType:"json",
             success:function(datas){
            	 
            	 var cmtCount  = datas.length;
            	 
            	 _.each(datas, function(data) {
			  			
		  			 var comments = $("#tpl-comments").html();
					 var commentsTemplate = Handlebars.compile(comments);
					 $('#'+parent+'-commentlists').prepend(commentsTemplate(data));
					 
					 
					 /* get profile images for comments */
				      $.ajax({
				    			type : 'POST',
				    			url : BS.profileImage,
				    			data : {
				    				 userId :  data.userId.id
				    			},
				    			dataType : "json",
				    			success : function(imgUrl) {
				    				$('#'+data.id.id+'-image').attr("src" ,imgUrl); 
				    			}
				      });
					  
		  		});
            	 if(cmtCount)
                 {
            		 /* for comment Header   */
        			 var cmdHead = $("#tpl-comment-header").html();
        			 var cmdHeadTemplate = Handlebars.compile(cmdHead);
        			 $('#'+parent+'-header').html(cmdHeadTemplate({parentId : parent , cmtCount : cmtCount}));
        			 $('#'+parent+'-hideComment').addClass('disabled');
        			 $('#'+parent+'-commentlists').hide();
                 }
            	
              
             }
          });
	 },
	 /**
	  * show comment section
	  */
	 showCommentSection : function(eventName){
		 eventName.preventDefault();
		 var parentMsg = eventName.target.id;
		 var parent =$('#'+parentMsg+'').closest('li').attr('id');
		 
		 /* for comment box */
		 var commentBox = $("#comment-box").html();
		 var cmtBoxTemplate = Handlebars.compile(commentBox);
		 $('#'+parent+'-add-comment').html(cmtBoxTemplate({parentId : parent}));
		 
	 },
	 
	 /**
	  * add comments for messages
	  */
	 addComment : function(eventName){
		 
		 var parentMsg = eventName.target.id;
		 var parent =$('#'+parentMsg+'').closest('li').attr('id');
		 var cmtCount =  $('#'+parent+'-cmtCount').text();
		 
		 /* post comments on enter key press */
		 if(eventName.which == 13) {
			 
			 eventName.preventDefault(); 
			 var commentText = $('#'+parent+'-cmtBox').val();
			
			 /* post comments information */
		        $.ajax({
		  			type : 'POST',
		  			url : BS.newComment,
		  			data : {
		  				messageId : parent,
		  				comment : commentText
		  			},
		  			dataType : "json",
				  	success : function(datas) { 
				  				 
				  		$('#'+parent+'-cmtBox').val('');
				  	    
				  		_.each(datas, function(data) {
				  			 cmtCount++; 
				  			 var comments = $("#tpl-comments").html();
							 var commentsTemplate = Handlebars.compile(comments);
							 
							 $('#'+parent+'-commentlists').append(commentsTemplate(data));
							 $('#'+data.id.id+'-image').attr("src" ,BS.profileImageUrl );
							 
							 if(!$('#'+parent+'-commentlists').is(':visible'))
							 {  
								 var newComments = $("#tpl-new-comments").html();
								 var newCmtTemplate = Handlebars.compile(newComments);
								 $('#'+parent+'-newcommentlists').append(newCmtTemplate(data));
								 $('#'+data.id.id+'-newCmtImage').attr("src" ,BS.profileImageUrl );
							 }
							 
				  		});
				  				
						 /* for comment Header   */
						 var cmdHead = $("#tpl-comment-header").html();
						 var cmdHeadTemplate = Handlebars.compile(cmdHead);
						 $('#'+parent+'-header').html(cmdHeadTemplate({parentId : parent , cmtCount : cmtCount}));
				  		 $('#'+parent+'-showComment').addClass('disabled');
//				  		 $('#'+parent+'-cmtCount').html(cmtCount);
 
				  	}
		  		});

		 }
	 },
	 
	 /**
	  * hide comments under each messages
	  */
	 
	 hideComments :function(eventName){
		 
		 eventName.preventDefault(); 
		
		 var parentMsg = eventName.target.id;
		 var parent =$('#'+parentMsg+'').closest('li').attr('id');		
		 
		 $hide = $('#'+parent+'-hideComment');
         $show = $('#'+parent+'-showComment'); 
         $comments = $('#'+parent+'-commentlists');
         $newComments = $('#'+parent+'-newcommentlists');
		 if ($comments.is(':visible') ||  $newComments.is(':visible')) {
             $show.removeClass('disabled');
             $hide.addClass('disabled');
             $('#'+parent+'-newcommentlists').html("");
             $comments.slideUp();
         }
	 },
	 
	 /**
	  * show comments under each messages
	  */
	 
	 showComments :function(eventName){
		 eventName.preventDefault(); 
		 
		 var parentMsg = eventName.target.id;
		 var parent =$('#'+parentMsg+'').closest('li').attr('id');		
		 $hide = $('#'+parent+'-hideComment');
         $show = $('#'+parent+'-showComment'); 
         $comments = $('#'+parent+'-commentlists');
         if (!$comments.is(':visible')) {
             $hide.removeClass('disabled');
             $show.addClass('disabled');
             $('#'+parent+'-newcommentlists').html('');
             $comments.slideDown();
         }
	 },
	 /**
	  *  sort stream messages
	  */
	 sortMessages:function(eventName){
		 eventName.preventDefault(); 
		 var self = this;
		 var sortKey = eventName.target.id;
		 var streamId = $('#public-classes').find('li.active').attr('id') ;
		 $('#sort-messages').find('li.active').removeClass('active');
		 $('#'+sortKey+'').closest('li').addClass('active');	
		
		 if(sortKey == "highest-rated")
		 {
			 BS.msgSortedType = "vote";
			 $(".timeline_items").html('');
			 BS.pageForVotes = 1;
			 self.sortByVotes(streamId,BS.pageForVotes,BS.pageLimit)
		 }
		 else if(sortKey == "date")
		 {
			 BS.msgSortedType = "date";
			 $(".timeline_items").html('');
			 BS.pageForDate = 1;
			 self.sortByDate(streamId,BS.pageForDate,BS.pageLimit);
 
		 }
		 else if(sortKey == "profile-relevance")
		 {
			 
		 }
//		 else if(sortKey == "vote")
//		 {
//			 BS.msgSortedType = "vote";
//			 $(".timeline_items").html('');
//			 BS.pageForVotes = 1;
//			 self.sortByVotes(streamId,BS.pageForVotes,BS.pageLimit)
//		 }
			 
	 },
	 
	 /**
	  * sort by keyword
	  */
	 sortMessagesByKey :function(eventName){
		
		 var self = this;
 		 if(eventName.which == 13) {
 			BS.msgSortedType = "keyword";
 			BS.pageForKeyword = 1;
 			 $(".timeline_items").html('');
			 var keyword = $('#sort_by_key').val();
			 var streamId = $('#public-classes').find('li.active').attr('id') ;
			 
			 self.sortBykeyword(streamId,keyword,BS.pageForKeyword,BS.pageLimit);
			
		 } 
	 },
	 
	 /**
	  * get all messages and diplay in the sorted order
	  */
	 displayMessages : function(data){
		 
		  //display the messages
 		   var self = this;
		  _.each(data, function(data) {
				
				var msgBody = data.messageBody;
				var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
		             return '<a href="' + url + '">' + url + '</a>';
		        });
				  
				var datas = {
				 	 "datas" : data,
			     }
				  
				 var source = $("#tpl-messages").html();
					 var template = Handlebars.compile(source);
					 $('.timeline_items').append(template(datas));
					 
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
					 
					self.showAllComments(data.id.id);
	         });
 	
	 },
	 /**
	  * follow each messages
	  */
	 followMessage : function(eventName){
		 eventName.preventDefault();
		 var element = eventName.target.parentElement;
		 var msgId =$(element).closest('li').attr('id');
		 var text = $('#'+eventName.target.id).text();
		 
		 $.ajax({
	        type: 'POST',
	        url:BS.followMessage,
	        data:{
	            messageId:msgId
	        },
	        dataType:"json",
	        success:function(data){
	        	 if(text == "Unfollow")
	    		 {
	    			 $('#'+eventName.target.id).html("Follow");
	    		 }
	        	 else
	        	 {
	        		 $('#'+eventName.target.id).html("Unfollow");
	        	 }
	            
	        }
	     });
		 
		
	 },
	 
	 
	 /**
	  * get messages and sort by votes 
	  */
	 sortByVotes :function(streamId,pageNo,limit){
		 var self =this;
		 $.ajax({
	  			type : 'POST',
	  			url : BS.sortByVote,
	  			data : {
	  				 streamId :streamId,
	  				 pageNo : pageNo,
	  				 limit  : limit
	  				 
	  			},
	  			dataType : "json",
			  	success : function(data) {
			  		
			  	  //hide page loader image
					if(!data.length)
						$('.page-loader').hide();
			  		self.displayMessages(data);
			  	}
	  		});
	 },
	 /**
	  *get messages and sort by keuwords
	  */
	 sortBykeyword :function(streamId,keyword,pageNo,limit){
		 var self = this;
		 $.ajax({
	  			type : 'POST',
	  			url :BS.sortByKey,
	  			data : {
	  				 streamId :streamId,
	  				 keyword : keyword,
	  				 pageNo : pageNo,
	  				 limit  : limit
	  				 
	  			},
	  			dataType : "json",
			  	success : function(data) {
			  	  //hide page loader image
				  if(!data.length)
					   $('.page-loader').hide();
			  	  self.displayMessages(data);
			  	}
	  		});
	 },
	 /**
	  * get messages and sort by data
	  */
	 sortByDate : function(streamId,pageNo,limit){
		 var self = this;
		 $.ajax({
	  			type : 'POST',
	  			url : BS.sortByDate,
	  			data : {
	  				 streamId :streamId,
	  				 pageNo : pageNo,
	  				 limit  : limit
	  			},
	  			dataType : "json",
			  	success : function(data) {
			  	  //hide page loader image
					if(!data.length)
						$('.page-loader').hide();
			  		self.displayMessages(data);
			  	}
	  		});
	 },
	 
	  
	 
	 /**
	  * when a user clicks on a social media icon or icons for sharing the check mark is un checked.
	  */
	 uncheckPrivate :function(eventName){
		 eventName.preventDefault(); 
		 $('#id-private').attr('checked',false);
		 var seletedId = eventName.target.parentElement.id;
		 if($('#'+seletedId).hasClass('active'))
		 {
			 $('#'+seletedId).removeClass('active');
			 
		 }
		 else
		 {
			 $('#'+seletedId).addClass('active');
		 }
		 
	 },
	 /**
	  * @TODO
	  */
	 makePrivate :function(){
		 if($('#id-private').attr('checked')== 'checked')
		    $('li.social_media a').removeClass('active');
	 },
	 /**
	  * prevent default action 
	  */
	 preventDefault : function(eventName){
		 eventName.preventDefault(); 
	 },
	 
	 /**
	  * render public profile view
	  */
	 
	 renderPublicProfile :function (eventName){
		 console.log(eventName.target.id);
	 },
	 /** 
	  * make bitly
	  */
	 makeBitly : function(eventName){
		 console.log("dgdfg");
	 }
});