 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/September/2012
	 * Description           : Backbone view for main stream page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.StreamView = Backbone.View.extend({
	
		 events :{
			 
			 /* For new design work  */
			 "click .close-btn" : "closeStreamTab",
			 "click .cancel-btn " : "closeRemoveOption",
			 "click .stream-tab a" : "renderSubMenuPages",
			 "click #chat-status" : "openOnlineUsersWindow",
			 "click .sortable li" : "renderRightContenetsOfSelectedStream",
			 "click #show-info" :"showDetails",
//			 "mouseenter #show-stream-types" : "showStreamTypesPopup",
//			 "mouseleave #show-stream-types" : "hideStreamTypesPopup",
			 "click #classstream" :"ShowClassStreamPopup",
			 

		 },
		 
	
	
	    initialize:function () {
	    	
	    	console.log('Initializing Stream View');
	     	BS.urlRegex1 = /(https?:\/\/[^\s]+)/g;
	     	BS.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
	     	BS.urlRegex2 =  /^((http|https|ftp):\/\/)/;
	     	
			BS.activeDiv = '<div class="active-curve"><img src="images/active-curve.png" width="20" height="58"></div>';

	     	
    		this.source = $("#tpl-main-stream").html();
    		this.template = Handlebars.compile(this.source);
                this.getonlineusers();
	    		
    		// for pagination in message feed
			BS.pageForKeyword = 1;
			BS.pageLimit = 10;
         
	    },
	 
	    /**
	     * render view
	     */
	    render:function (eventName) {
	    	
	       this.getStreams();
	       $(this.el).html(this.template({"data":this.model.toJSON(),"schools" : BS.mySchools}));
	       return this;
	    },
	    
	    /**
	     * NEW THEME - display a popup that showa all type of streams  
	     */
	    showStreamTypesPopup: function(){
	    	 
	    	// stops the hide event if we move from the trigger to the popup element
	    	if (this.hideDelayTimer) clearTimeout(this.hideDelayTimer);
	           
	    	// don't trigger the animation again if we're being shown, or already visible
	    	if (this.shown) {
	    		return;
	    	}else 
	    	{
	    		this.beingShown = true;
	    		var x= $('#streams-list-block').position();
	    		var top = x.top - 85;
	    		// reset position of popup box
	    		$('.streams-popup').css({
	    			top:  top,
	    			left: 355,
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
	    
	    /**
	     * NEW THEME - hide popup that showa all type of streams  
	     */
	    hideStreamTypesPopup: function(){
	    	
	    	// reset the timer if we get fired again - avoids double animations
	    	if (this.hideDelayTimer) clearTimeout(this.hideDelayTimer);
		      
	    	// store the timer so that it can be cleared in the mouseover if required
	    	this.hideDelayTimer = setTimeout(function () {
	    	  
	    		this.hideDelayTimer = null;
	    		$('.streams-popup').animate({
	    				top: '-=' + this.distance + 'px',
	    				opacity: 0
	    			}, this.time, 'swing', function () {
    				// once the animate is complete, set the tracker variables
    				this.shown = false;
    				// hide the popup entirely after the effect (opacity alone doesn't do the job)
    				$('.streams-popup').css('display', 'none');
		        });
	    	}, this.hideDelay);
	    	
	    },
	    
	    /**
	     * NEW THEME - get all streams
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
						 BS.myClasses = '';
						 var classStreams ='';
						 _.each(datas, function(data) {
							 
							 streams+='<li id ="'+data.id.id+'" name="'+data.streamName+'" ><a  id ="'+data.id.id+'" name ="'+data.streamName+'"  href="#" class="icon1">'+data.streamName+'</a>'
			                        +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
			                        +'<span class="menu-count"> 10</span>'
			                        +'<span class="close-btn drag-rectangle" data-original-title="Delete"><img  src="images/close.png"></span>'
			                        +'</li>';
							 
							 
							 BS.myClasses+= '<li><a id ="'+data.id.id+'" href="#">'+data.streamName+'</a></li>';
							    
						 });
						 
						 BS.myClasses+= '<li><a href="#">Degree Program</a></li>'
							 			+'<li><a href="#">My Graduating Year </a></li>'
							 			+'<li><a href="#">My School</a></li>'
							 			+'<li><a href="#">Public</a></li>';
						  
						 
						 $('#sortable4').html(streams);
						 self.slider();
						 
						 // make first li as active li
						 $('#sortable4 li:first').addClass('active');
						 
						 $('#sortable4 li:first').append(BS.activeDiv);
						 
						 var streamName = $('#sortable4 li.active a').attr('name');
						 
						 // dynamic details for top stream submenus 
						 var topMenuDetails = {
								 streamName : streamName,
						 }
						 
						 /* render right container contents corresponds to each streams*/
				         rightContentSource = $("#tpl-stream-right-container").html();
				         rightContentTemplate = Handlebars.compile(rightContentSource);
			    	     $('.right-container').html(rightContentTemplate(topMenuDetails));
				    	   
				    	   
			    	     /* render discussion middle contents corresponds to each streams*/
			    	     middleContentSource = $("#tpl-overview-middle-contents").html();
			    	     middleContentTemplate = Handlebars.compile(middleContentSource);
			    	     $('#common-middle-contents').html(middleContentTemplate);
			    	     
					}
			 });
	    },
            
            
               /**
                * NEW THEME- Use the method to list the online users
                */
            getonlineusers : function(eventName){
                var content = ''; 
                var me = '';
                var self = this;
                console.log("our id ="+BS.loggedUserId);
                $.ajax({
                    type : 'GET',
                    url : BS.onlineUsers,
                    dataType : "json",
                success : function(users) {
                	var usersnumber = 0;
                    
                    if(users.length != 0)  {
                    	  usersnumber =users.length-1;
                    	_.each(users, function(user) {
                        	
	                        	var image ;
	                            if(user.profileImageUrl =='')
	                            {
	                            	image = "images/chat-imge.jpg";
	                            }
	                            else
	                            {
	                            	image = user.profileImageUrl;
	                            }
	                            if(BS.loggedUserId == user.id.id )
	                            {
	                            	me +='<a href="#"><img src="'+image+'" width="30" height="28"> <span>Me </span> <span class="online-chat">Online</span></a> ';
	                            	$('#me').html(me);
	                            }
	                            else
	                            {
		                            content +='<li> <a href="#"><img src="'+image+'" width="30" height="28"> <span>'+user.firstName+' </span> <span class="online-chat">Online</span></a> </li>'
	                            }
                                  
                            });
                	 }
                     else
                     {
//                        content += '<li class="nouser">  <span>Their is no online users </span>  </li>';  
                     }
                    $('#onlinechatbox').append(content);
                    $('.online-count').text('Online('+usersnumber+')');
                    self.Scrollbar();
                    },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
//                    content += '<li class="online">  <span>Their is no other online users </span>  </li>';   
                    $('.online-count').text('Online(0)');
//                    $('#onlinechatbox').append(content); 
                    self.Scrollbar(); 
                    }
                    }); 
                },
                
                /**
                * NEW THEME- method to display scroller in onlineusers box
                */
            Scrollbar :function(eventName){
                $("#user-online").mCustomScrollbar({
                    set_width:false, /*optional element width: boolean, pixels, percentage*/
                    set_height:false, /*optional element height: boolean, pixels, percentage*/
                    horizontalScroll:false, /*scroll horizontally: boolean*/
                    scrollInertia:550, /*scrolling inertia: integer (milliseconds)*/
                    scrollEasing:"easeOutCirc", /*scrolling easing: string*/
                    mouseWheel:"auto", /*mousewheel support and velocity: boolean, "auto", integer*/
                    autoDraggerLength:true, /*auto-adjust scrollbar dragger length: boolean*/
                    scrollButtons:{ /*scroll buttons*/
                        enable:false, /*scroll buttons support: boolean*/
                        scrollType:"continuous", /*scroll buttons scrolling type: "continuous", "pixels"*/
                        scrollSpeed:20, /*scroll buttons continuous scrolling speed: integer*/
                        scrollAmount:40 /*scroll buttons pixels scroll amount: integer (pixels)*/
                        },
                    advanced:{
                        updateOnBrowserResize:true, /*update scrollbars on browser resize (for layouts based on percentages): boolean*/
                        updateOnContentResize:false, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
                        autoExpandHorizontalScroll:false /*auto expand width for horizontal scrolling: boolean*/
                        },
                    callbacks:{
                        onScroll:function(){}, /*user custom callback function on scroll event*/
                        onTotalScroll:function(){}, /*user custom callback function on bottom reached event*/
                        onTotalScrollOffset:0 /*bottom reached offset: integer (pixels)*/
                        }                   
                    }); 
                },
	    
	    
	    /**
	     * NEW THEME- open a close option below the stream name tab (left side container)  to close that stream 
	     */
	    closeStreamTab :function(eventName){
	    	eventName.preventDefault();
	    	var self = this;
	    	var streamId = $(eventName.target).parents('li').attr('id');
	    	var StreamName = $(eventName.target).parents('li').attr('name');
	    	
	    	// set new style for li
             
            var removeOption = '<a href="#" class="red-active-icon1">'+StreamName+' </a>'
            				   +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
            				   +'<span class="remove-btn"><a href="#">Remove</a></span> <span class="remove-btn cancel-btn "><a href="#">Cancel</a></span>';
	    	
	    	$(eventName.target).parents('li').addClass("icon1 red-active");
	    	$(eventName.target).parents('li').html(removeOption);
	    	$('.tooltip').remove();
	    	
	    	
	    },
	    
	    /**
	     *  NEW THEME- close the remove option 
	     */
	    closeRemoveOption: function(eventName){
	    	eventName.preventDefault();
	    	var self = this;
	    	var streamId = $(eventName.target).parents('li').attr('id');
	    	var StreamName = $(eventName.target).parents('li').attr('name');
	    	
	    	// set previous style for li
	    	var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>'
			                   +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
			                   +'<span class="menu-count" style="display:none;"> 10</span>'
			                   +'<span class="close-btn drag-rectangle" data-original-title="Delete"><img  src="images/close.png"></span>';

 	    	$(eventName.target).parents('li').removeClass("icon1 red-active");
	    	$(eventName.target).parents('li').html(removeOption);
	    	$('.drag-rectangle').tooltip()		
	        
	    	
	    },
	    /**
	     *  NEW THEME-set active class for stream sub menu and render corresponding middle contents 
	     */
	    renderSubMenuPages: function(eventName){
	    	eventName.preventDefault();
	    	var id = eventName.target.id;
	    	 
		    //render middle contents
		    this.renderMiddleContents(id);
	    },
	    
	    /**
	     * NEW THEME - opne online users window
	     */
	    openOnlineUsersWindow: function(eventName){
	    	 $('#user-online').toggle('slow');
	    },
	    
	    
	    /**
	     * NEW THEME - render right contenets of a selected stream
	     */
	    renderRightContenetsOfSelectedStream: function(eventName){
	    	
	    	eventName.preventDefault();
	    	if($('a.done').text() == 'DONE')
	    		return;
		    var id = eventName.target.id;
		    if(!id)
		    	return;
		    var streamName = eventName.target.name;
		      
		    streamName = $('#'+id+'').attr('name');
		
		    // set active style for stream 
		    $('.sortable li.active').find('div.active-curve').remove();
		    $('.sortable li.active').removeClass('active');
		   
		    $('.sortable li#'+id).addClass('active');
		    $('.sortable li.active').append(BS.activeDiv);
		    
		    // dynamic details for top stream submenus 
			var topMenuDetails = {
					 streamName : streamName,
			}
			
			var currentlyActiveSubMenu = $('.stream-tab a.active').attr('id');
			 
			
			/* render right container contents corresponds to each streams*/
	        rightContentSource = $("#tpl-stream-right-container").html();
	        rightContentTemplate = Handlebars.compile(rightContentSource);
	        $('.right-container').html(rightContentTemplate(topMenuDetails));
	        
	        //render middle contents
	        this.renderMiddleContents(currentlyActiveSubMenu);
	    	
	    },
	    
	    /**
	     * NEW THEME - renderMiddle Contents of stream page
	     */
	    renderMiddleContents: function(subMenu){
	    	
	    	var self = this;
	    	$('.stream-tab a.active').removeClass('active');
		    $('#'+subMenu).addClass('active');
		    var streamId =  $('.sortable li.active').attr('id');
		    var streamName= $('.sortable li.active').attr('name');
	    	if(subMenu == "calendar_tab")
		    {
		    	BS.calendarView = new BS.CalendarView();
				BS.calendarView.render();
  				$('#common-middle-contents').html(BS.calendarView.el);
			   	
		    }
		    else if(subMenu == "discussion_tab")
		    {
		    	 
				BS.discussionView = new BS.DiscussionView();
				BS.discussionView.render();
  				$('#common-middle-contents').html(BS.discussionView.el);
  				
  				$('#select-privateTo').text(streamName);
  				$('#private-to-list').html(BS.myClasses);
  				$('.page-loader').hide();
  				
  				// get all messages
  				BS.pagenum =1;  
                if(streamId)
                	BS.discussionView.getAllMessages(streamId,BS.pagenum,BS.pageLimit);
  				
		    }
		    else if(subMenu == "question_tab")
		    {
		    	
				BS.questionView = new BS.QuestionView();
				BS.questionView.render();
  				$('#common-middle-contents').html(BS.questionView.el);
  				
  				$('#select-privateTo').text(streamName);
  				$('#private-to-list').html(BS.myClasses);
  				
  				$('.drag-rectangle').tooltip();	
  			    $('.page-loader').hide();
  			    
  			    // get all questions
  				BS.QPagenum =1;  
                if(streamId)
                	BS.questionView.getAllQuestions(streamId,BS.QPagenum,BS.pageLimit);
                
		    }
		    else if(subMenu == "deadline_tab")
		    {
		    	 BS.deadlineView = new BS.DeadlineView();
				 BS.deadlineView.render();
		    	 $('#common-middle-contents').html(BS.deadlineView.el);
		    }
		    else
		    {
		    	BS.overView = new BS.OverView();
				BS.overView.render();
  				$('#common-middle-contents').html(BS.overView.el);
		    }
		    $('#main-photo').attr("src",BS.profileImageUrl);
	    	
	    },
	    
	    /**
	     * NEW THEME - show stream details on top 
	     */
	    showDetails: function(eventName){
	    	eventName.preventDefault();
	    	$('.show-info').toggle(100);
	    	
	    },
	    
	    /**
	     * NEW THEME - show class stream page popup
	     */
	    ShowClassStreamPopup: function(eventName){
	    	eventName.preventDefault();
	    	BS.AppRouter.navigate("classStream", {trigger: true});
	    },
	    
	  /*
	  * slider for stream list
	   */
	   slider: function(){
	            $('span.close-btn').hide();     
	            $('div.drag-icon').hide();
	            $(".scroller").simplyScroll({
		            customClass: 'vert',
		            orientation: 'vertical',
		            auto: false,
		            manualMode: 'end',
		            frameRate: 20,
		            speed: 8,
		            
	            });	
	            
	            var activeStream = '';
	            
	            $(".done").toggle(function () {         
	                  $('a.done').text('DONE');
	                 
	                  activeStream =  $('.sortable li.active').attr('id');
	                  $('.sortable li.active').find('div.active-curve').remove();
	      		      $('.sortable li.active').removeClass('active');
	      		     
	      		      $('.menu-count').hide();
	                  $('span.close-btn').show();
	                  $('div.drag-icon').show();
	                  $('#sortable1, #sortable2').sortable();
					  $('#sortable3').sortable({
						  items: ':not(.disabled)'
					  });
				      $('#sortable-with-handles').sortable({
				    	  handle: '.handle'
				      });
				      $('#sortable4, #sortable5').sortable({
				    	  connectWith: '.connected'
				      });
			    },function () { 
			    	
	                 $('a.done').text('EDIT');  
	                 
	                 $('.sortable li#'+activeStream).addClass('active');
	     		     $('.sortable li.active').append(BS.activeDiv);
	     		     
	                 $('span.close-btn').hide(); 
	                 $('div.drag-icon').hide();
	                 
	                 $('.menu-count').show();
	                 $('#sortable1').remove(); 
	                 $('#sortable4, #sortable5').sortable('destroy');
	                 $('li').removeAttr('draggable');
	                 
	                 /* remove if any red actvated stream li */
	                 $("#sortable4 li").each(function(n) {
	                	 var streamId = $(this).attr('id');
	 	     	    	 var StreamName = $(this).attr('name');
	 	     	    	 if($(this).hasClass('red-active'))
	 	     	    	 {
	 	     	    		 
	 	     	    		var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>'
	 	     	    		+'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange" style="display: none;">'
	 	     	    		+'<img src="images/menu-left-icon.png">'
	 	     	    		+'</div>'
	 	     	    		+'<span class="menu-count" > 10</span>'
	 	     	    		+'<span class="close-btn drag-rectangle" data-original-title="Delete" style="display: none;">'
	 	     	    		+'<img src="images/close.png">'
	 	     	    		+'</span>';
	 	     	    		 
	 	     	    		if(streamId == activeStream )
	 	     	    		{
	 	     	    			removeOption+= '<div class="active-curve">'
	 	     	    				       +'<img width="20" height="58" src="images/active-curve.png">'
	 	     	    				       +'</div>';
	 	     	    		}
	 	     	    		 
	 	     	    		
	 	     	    		$(this).removeClass("icon1 red-active");
	 	     	    		$(this).html(removeOption);
	 		     	    	$('.drag-rectangle').tooltip()	

	 	     	    		 
	 	     	    	 }
	                 });
	                 
	                 
	            });		
	            
	            $('.drag-rectangle').tooltip()		
	   }
	   
	});
