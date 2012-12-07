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
			 "click #post-button" : "postMessage",
			 "click .follow-button" : "followMessage",
			 "click .rock-message" : "rockMessage",
			 "click .rocks" : "rockMessage",
			 "click .rocks-up" : "rockMessage",
			 "click .add-comment" : "showCommentTextArea",
			 "click .show-all" : "showAllList",
			 "click .show-all-comments" : "showAllCommentList",
			 "keypress .add-message-comment" : "addMessageComments",
			 "keyup .add-message-comment" : "deleteCommentText",
			 "focusout .add-message-comment" : "removeCommentTextArea",
			 "click .rock-comments" : "rockComment",
			 "click .rocks-small a" : "rockComment",
			 "keypress #msg-area" : "postMessageOnEnterKey",
			 "click #upload-files" : "showUploadSection",
			 "change #upload-files-area" : "getUploadedData",
			 "click #private-to-list li" :"selectPrivateToList",
			 "click #private-to" : "checkPrivateAccess",
			 "click #share-discussions li a" : "actvateShareIcon",
			 "click #sortBy-list" : "sortMessages",
			 "click #date-sort-list" : "sortMessagesWithinAPeriod",
			 "keypress #sort_by_key" : "sortMessagesByKey",
			
	//		 "click .ask-button" :"askQuestions",
	//		 "click .add-poll " : "displayOptionsEntry",
	//		 "click #add_more_options" :"addMoreOptions"
	 
	           
		 },
		 
	//	 /**
	//	  * New - Design --Ask Questions 
	//	  * 
	//	  */
	//	 askQuestions : function(eventName){
	//		 eventName.preventDefault();
	//		 var questionText = $('#question').val();
	//		 var options = new BS.OptionCollection();
	//		 
	//		 for(var i=1 ; i <= BS.options ; i++)
	//		 {
	//			 var option = new BS.Option();
	//			 var optionData = $('#option'+i).val();
	//			 option.set({optionId:i ,optionData:optionData});
	//			 options.add(option);
	//		 }
	////		 var optionInfo = JSON.stringify(options);
	//		 var question = new BS.Question();
	//		 question.set({id:1 ,question:questionText ,options:options});
	//		 var questionInfo = JSON.stringify(question);
	//		 console.log("---"  + questionInfo);
	//		 BS.options = 0;
	//		 data = {
	//				 question : question2,
	//				 pollsOptions : optionInfo
	//		 }
	//		 console.log(data);
			 
			 /* post profile page details */
	//         $.ajax({
	//             type: 'POST',
	//             data:{data: questionInfo},
	//             url: BS.newQuestion,
	//             cache: false,
	//             dataType : "json",
	//             success: function(data){
	//            	 
	//             }
	//         }); 
	//		  
	//	 },
	//	 /**
	//	  * New -Design -- display option entry fields 
	//	  */
	//	 displayOptionsEntry : function (eventName){
	//		 eventName.preventDefault();
	//		 BS.options = 2;
	//		  
	//		 $('.answer').css('display', 'block');
	//	 },
	//	 
	//	 /**
	//	  * New-Design --- Add more options 
	//	  */
	//	 addMoreOptions : function(eventName){
	//		 eventName.preventDefault();
	//		 var options =' <li> <input type="text" id="option'+BS.options+'" placeholder="Add an Option"></li>';
	//		 var parent = $('#add_more_options').parents('li');
	//		 $(parent).before(options);
	//		 console.log(parent);
	//		 
	//	 },
	
	    initialize:function () {
	    	
	    	console.log('Initializing Stream View');
	     	BS.urlRegex1 = /(https?:\/\/[^\s]+)/g;
	     	BS.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
	     	BS.urlRegex2 =  /^((http|https|ftp):\/\/)/;
	  //    	BS.commentCount = 0;
	    	/* for hover over */
	  //	    this.distance = 10;
	  //	    this.time = 250;
	  //	    this.hideDelay = 500;
	  //	    this.hideDelayTimer = null;
		    // tracker
	   //	    this.beingShown = false;
	   //	    this.shown = false;
	   //	    this.trigger = $('.trigger');
	   //	    this.popup = $('.popup').css('opacity', 0);
		    
    		this.source = $("#tpl-main-stream").html();
    		this.template = Handlebars.compile(this.source);
	    		
	    		// for pagination in message feed
    		BS.pagenum = 1;
    		BS.pageLimit = 10;
	    		
	    		
	    		/* Start --New Design */
	//    		  
	//    		BS.options = 2;
	    		
	    		/* End */
	    		  
	    		
	    		
	    		
	//		this.slider();
			
			/* for PUBNUB auto push */
	        this.setupPushConnection();
	
	        
			/* pagination on scrolling */
			BS.msgSortedType = '';
			BS.pagenum = 1;
			BS.pageForVotes = 1;
			BS.pageForDate = 1;
			BS.pageForKeyword = 1;
			BS.pageLimit = 10;
		    var self = this;
		    self.file = "";
			$(window).bind('scroll', function (ev) {
				var scrollTop =$(window).scrollTop();
				var docheight = $(document).height();
				var widheight = $(window).height();
				if(scrollTop + 1 == docheight- widheight || scrollTop == docheight- widheight){
			 	   var t = $('#all-messages').find('div.follow-container');
				   if(t.length != 0)
				   {
						$('.page-loader').show();
						var streamId = $('.sortable li.active').attr('id');
					
						if(BS.msgSortedType == "")
						{    
							BS.pagenum++;
							self.getAllMessages(streamId,BS.pagenum,BS.pageLimit);
						}
						else if(BS.msgSortedType == "vote")
						{    
							BS.pageForVotes++
							self.sortByHighestRated(streamId,BS.pageForVotes,BS.pageLimit)
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
							 self.sortByMostRecent(streamId,BS.pageForDate,BS.pageLimit);
						}
				   }
				 }
				else
				{
					  $('.page-loader').hide();
				}
			 });          
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
						 var classStreams ='';
						 _.each(datas, function(data) {
							 
							 streams+='<li id ="'+data.id.id+'" name="'+data.streamName+'" ><a  id ="'+data.id.id+'" name ="'+data.streamName+'"  href="#" class="icon1">'+data.streamName+'</a>'
			                        +'<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"><img src="images/menu-left-icon.png"></div>'
			                        +'<span class="close-btn drag-rectangle" data-original-title="Delete"><img  src="images/close.png"></span>'
			                        +'</li>';
							    
						 });
						  
						 
						 $('#sortable4').html(streams);
						 self.slider();
						 
						 // make first li as active li
						 $('#sortable4 li:first').addClass('active');
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
		    var id = eventName.target.id;
		    if(!id)
		    	return;
		    var streamName = eventName.target.name;
		      
		    streamName = $('#'+id+'').text();
		
		    $('.sortable li.active').removeClass('active');
		    $('.sortable li#'+id).addClass('active');
		    
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
  				
  				// get all messages
  				BS.pagenum =1;  
                if(streamId)
                  self.getAllMessages(streamId,BS.pagenum,BS.pageLimit);
  				
		    }
		    else if(subMenu == "question_tab")
		    {
		    	
				BS.questionView = new BS.QuestionView();
				BS.questionView.render();
  				$('#common-middle-contents').html(BS.questionView.el);
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
	     * NEW THEME - get all messages of a stream
	     */
	    getAllMessages :function(streamid,pageNo,limit){
	    	
//	    	 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
//	         var trueurl='';
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
						self.displayMessages(data);
					}
			 });
	    	
	    },
	    
	    /**
	     * NEW THEME - fetch and show all comments of a message
	     */
	    showAllComments: function(msgId){
	    	var count = 0;
			var parentMsg = msgId;
//			var parent =$('#'+parentMsg+'').closest('li').attr('id');
			$.ajax({
				type: 'POST',
	            url: BS.allCommentsForAMessage,
	            data:{
	            	messageId:parentMsg
	            },
	            dataType:"json",
	            success:function(datas){
	            	 
	            	var cmtCount  = datas.length;
	            	 
	            	_.each(datas, function(data) {
	            		 
		  			    var comments = $("#tpl-discussion-messages-comment").html();
					    var commentsTemplate = Handlebars.compile(comments);
					    $('#'+parentMsg+'-allComments').prepend(commentsTemplate(data));
							 
					    /* get profile images for comments */
				        $.ajax({
				        	type : 'POST',
			    			url : BS.profileImage,
			    			data : {
			    				 userId :  data.userId.id
			    			},
			    			dataType : "json",
			    			success : function(pofiledata) {
			    				var imgUrl;
			    				if(pofiledata.status)
			    				{
			    					imgUrl = "images/profile-img.png";
			    				}
			    			    else
		    				    {   
			    			    	// shoe primary profile image 
		    					    if(pofiledata.contentType.name == "Image")
		    					    {
		    					    	imgUrl = pofiledata.mediaUrl;
		    					    }
			    					// shoe primary profile video 
			    					else
			    					{
			    						imgUrl = pofiledata.frameURL;
			    					}
	  				    		}
			    				$('#'+data.id.id+'-image').attr("src" ,imgUrl); 
			    			}
				        });
							  
	            	});
	        	    if(cmtCount)
	                {
	        	    	$('#'+parentMsg+'-totalComment').html(cmtCount);
	        	    	$('#'+parentMsg+'-allComments').hide();
//	        	    	/* for comment Header   */
//	        	    	var cmdHead = $("#tpl-comment-header").html();
//	        	    	var cmdHeadTemplate = Handlebars.compile(cmdHead);
//	        	    	$('#'+parent+'-header').html(cmdHeadTemplate({parentId : parent , cmtCount : cmtCount}));
//	        	    	$('#'+parent+'-hideComment').addClass('disabled');
//	        	    	$('#'+parent+'-commentlists').hide();
	                }
	            }
			});
	    },
	    /**
	     * NEW THEME - post message on enter key
	     */
	    postMessageOnEnterKey: function(eventName){
	    	var self = this;
			 
			if(eventName.which == 13) {
				self.postMessage(); 
			}
			if(eventName.which == 32){
				 
				var text = $('#msg-area').val();
			    var links =  text.match(BS.urlRegex); 
					 
			    /* create bitly for each url in text */
				if(links)
				{
						 
					if(!BS.urlRegex2.test(links[0])) {
						urlLink = "http://" + links[0];
				  	}
			     	else
			     	{
			    		urlLink =links[0];
			     	}
						 
					//To check whether it is google docs or not
					if(!urlLink.match(/^(https:\/\/docs.google.com\/)/))  
		            { 
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
				    				 var msg = $('#msg-area').val();
				    				 message = msg.replace(links[0],data.data.url);
				    				 $('#msg-area').val(message);
						    				
				    			}
				    		});

							$('#msg-area').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});
						          
				        }
		            }
			    }
		 	}
    	},
	    /**
	     * NEW THEME - post messages on post button click 
	     */
	    postMessage: function(eventName){
//	    	eventName.preventDefault();
	    	// upload file 
	        var self = this;
	        var streamId =  $('.sortable li.active').attr('id');
	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
	        var message = $('#msg-area').val();
	        
	      
	        //get message access private ? / public ?
	        var messageAccess;
	        var msgAccess =  $('#private-to').attr('checked');
		    if(msgAccess == "checked")
		    {
		    	messageAccess = "Private";
		    }
		    else
		    {
		  	    messageAccess = "Public";
		    }
		    
		    var trueurl='';
	        if(this.file )
	        {
	        	
	        	$('#file-upload-loader').css("display","block");

	        	var data;
	            data = new FormData();
	            data.append('docDescription',message);
	            data.append('docAccess' ,messageAccess);
	            data.append('docData', self.file);  
	            data.append('streamId', streamId);  
	           
	            /* post profile page details */
	            $.ajax({
	            	type: 'POST',
	                data: data,
	                url: BS.uploaddocFrmComputer,
	                cache: false,
	                contentType: false,
	                processData: false,
	                dataType : "json",
	                success: function(data){
	                	$('#msg-area').val("");
	              	    self.file = "";
	              	    $('#file-upload-loader').css("display","none");
	              	    $('.embed-info').css("display","none");
	                  	 
	  	                var datas = {
	  	                		"datas" : data,
	  		            }						  

//                        $('input#'+data.id.id+'-url').val(msgUrl);  
                        $('img#'+data.id.id+'-img').attr("src", BS.profileImageUrl);
	                           
	                           
                        /*show image preview icons  */
	                    
                        //var links =  msgBody.match(BS.urlRegex); 
                        var msgUrl=  data.messageBody.replace(BS.urlRegex1, function(msgUrlw) {
                        	trueurl= msgUrlw;    
                            return msgUrlw;
                        });
                        var extension = (trueurl).match(pattern);  //to get the extension of the uploaded file    
	                           

	                           
	                    // set first letter of extension in capital letter  
	  	                extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
	  	                	return letter.toUpperCase();
	  	                });
	  	                var datVal =  BS.filesMediaView.formatDateVal(data.timeCreated);
	    		                  
	                    if(data.messageType.name == "Image")
	  					{
	                    	var source = $("#tpl-messages_with_images").html();
	  	  						
	  					}
	  					else if(data.messageType.name == "Video")
	  					{
	  						var source = $("#tpl-messages_with_images").html();
	  	  						
	  					}
	  					else
	  					{
	  						var previewImage = '';
	  						var commenImage ="";
	  						var type = "";
	  							 
	  						if(extension == 'Ppt')
	  						{
	  							previewImage= "images/presentations_image.png";
	  	                        type = "ppt";
	  						}
	  						else if(extension == 'Doc')
	  						{
  								previewImage= "images/docs_image.png";
  								type = "doc";
	  						}
	  						else if(extension == 'Pdf')
	  						{
  								previewImage= data.anyPreviewImageUrl;
  								type = "pdf";
	  						}
  							else
  							{
  								previewImage= "images/textimage.png";
  								commenImage = "true";
  								type = "doc";
	  								
  							}
	  							
  							var datas = {
							    "datas" : data,
                                "datVal" :datVal,
                                "previewImage" :previewImage,
                                "extension" : extension,
                                "commenImage" : commenImage,
                                "type" : type
  					        }	
	  						
  						    var source = $("#tpl-messages_with_docs").html();
	    						
  						}
	                           
                        var template = Handlebars.compile(source);
                        $('#all-messages').prepend(template(datas));
                        $('img#'+data.id.id+'-img').attr("src", BS.profileImageUrl);
//                        $('input#'+data.id.id+'-url').val(msgUrl); 
	                      	 
                      	/* for video popups */
	                    $("area[rel^='prettyPhoto']").prettyPhoto();
    					$(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
    					$(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
	        			
                    }
                }); 
        	}
	        else
	        {
	        	 
	  	        /* get message details from form */
	  	        BS.updatedMsg =  message;
	  	        if(!message.match(/^[\s]*$/))
	  	        {   
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
	  	                 
	  	                var msgBody = message;
	  	                var link =  msgBody.match(BS.urlRegex);                             
	  	                var msgUrl=  msgBody.replace(BS.urlRegex1, function(msgUrlw) {
	  	                    trueurl= msgUrlw;                                                                  
	  	                    return msgUrlw;
	  	                });
	  	                
	  	                //to get the extension of the uploaded file 
	  	                var extension = (trueurl).match(pattern);
	  	                
	  	                //To check whether it is google docs or not
	  	                if(!urlLink.match(/^(https:\/\/docs.google.com\/)/))   
	  	                {
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
                                         self.postMsgToServer(message,streamId,messageAccess);
	  	                            }
  	                             });
  	                         }
  	                         else
  	                         {  
  	                        	 self.postMsgToServer(message,streamId,messageAccess);
  	                         }
                 		 }  //doc
	  	                 else    //for docupload
	  	                 {     
	  	                	 self.postMsgToServer(message,streamId,messageAccess);
	  	                 }
                     }
	                 //if link not present
	                 else
	                 {                
	                	 self.postMsgToServer(message,streamId,messageAccess);
	                 }
              	 }
             }
    	 },
    	 
    	 /**
    	  * NEW THEME - POST message details to server 	
    	  */
    	 postMsgToServer: function(message,streamId,messageAccess){
    		 
    		 var self = this; 
             var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
             var trueurl='';
             
             /* post message information to server */
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
   				
            		 /* if status is failure (not join a class or school) then show a dialog box */      
   				     if(data.status == "Failure")
   				     {
//						 var alert = '<div id="dialog" title="Message !">You need to add a stream first.</br><a  onClick="closeAlert();" class="alert-msg " href="#create_stream"> Create Stream</a></div>';
//						 $('#alert-popup').html(alert);
//						 
//						 $( "#dialog" ).dialog({
//							 autoOpen: false ,
//							 modal: true,
//		  					 draggable: false,
//		  				     resizable: false
//						 });
//						 
//						 $( "#dialog" ).dialog('open');
//						 $( "#dialog" ).dialog({ height: 100 });
   					
			         }
   				     else
   				     {
   				    	 // append the message to message list
   				    	 _.each(data, function(data) {

   				    		 /* PUBNUB -- AUTO AJAX PUSH */ 
   				    		 var streamId =  $('.sortable li.active').attr('id');
                             PUBNUB.publish({
                            	 channel : "stream",
  		                         message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,prifileImage : BS.profileImageUrl}
                             }) 
   							
                             var msgBody = data.messageBody;
                             var msgUrl=  msgBody.replace(BS.urlRegex1, function(msgUrlw) {
                            	 trueurl= msgUrlw;                                                                  
                            	 return msgUrlw;
                             });
                             
                             //to get the extension of the uploaded file
                             var extension = (trueurl).match(pattern);  
                             
                             //to check whether the url is a google doc url or not
                             if(data.messageType.name == "Text")                          
                             {	
                            	 if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) 
                                 {   
                            		 messageType = "googleDocs";

                                 }
                            	 else
                            	 {    
                            		 messageType = "messageOnly";
                            		 var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
                            			 return '<a target="_blank" href="' + url + '">' + url + '</a>';
                            		 });
 	                                             
                            	 }
                             }                                                      
                             else
                             {         
                                 // url has extension then set first letter of extension in capital letter  
   	   		                	 extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
   	   		                		 return letter.toUpperCase();
   	   		                	 });

                    		 }
   							  
                             var datas = {
                            		 "datas" : data,
                             }	
                              
                             // set a format style to date
                             BS.filesMediaView = new BS.FilesMediaView(); 
                             var datVal =  BS.filesMediaView.formatDateVal(data.timeCreated);
    			                    
                             // if message conatains googledoc url
                             if(messageType == "googleDocs")
 							 {
                            	 
                            	 var datas = {
                            			 "datas" : data,
                            			 "datVal" :datVal,
                            			 "previewImage" : "images/google_docs_image.png",
                            			 "type" : "googleDoc"
	 							 }	
 								 var source = $("#tpl-messages_with_docs").html();
 	         		  						
     						 }
                             // if message conatains messages only without any uploaded files
 							 else if(messageType == "messageOnly")
 							 {
 								 var source = $("#tpl-discussion-messages").html();
     						 }
                             // if message conatains  uploaded files
 							 else
 							 {
 								 if(data.messageType.name == "Image")
 								 {
 									 var source = $("#tpl-messages_with_images").html();
 								 }
 								 else if(data.messageType.name == "Video")
 								 {
 									 var source = $("#tpl-messages_with_images").html();
 								 }
 								 else
 								 {
 									 var previewImage = '';
 									 var commenImage ="";
 									 var type = "";
     								 
 									 /* check its extensions and set corresponding preview icon images */
 									 if(extension == 'Ppt')
 									 {
 										 previewImage= "images/presentations_image.png";
 										 type = "ppt";
 									 }
 									 else if(extension == 'Doc')
 									 {
 										 previewImage= "images/docs_image.png";
 										 type = "doc";
 									 }
 									 else if(extension == 'Pdf')
 									 {
 										 previewImage= data.anyPreviewImageUrl;
 										 type = "pdf";
 									 }
 									 else
 									 {
 										 previewImage= "images/textimage.png";
 										 commenImage = "true";
 										 type = "doc";
								 	 }
     									
 									 var datas = {
 											 "datas" : data,
 											 "datVal" :datVal,
 											 "previewImage" :previewImage,
 											 "extension" : extension,
 											 "commenImage" : commenImage,
 											 "type" : type
						        	 }	
     								
 								     var source = $("#tpl-messages_with_docs").html();
     		  						 
								 }
 	         								
     						 }
            			                    
                             var template = Handlebars.compile(source);
                             $('#all-messages').prepend(template(datas));

                             //get profile image of logged user
                             $('img#'+data.id.id+'-img').attr("src", BS.profileImageUrl);
                            
  							 if(linkTag)
  								 $('p#'+data.id.id+'-id').html(linkTag);
  						
  							 var url=data.messageBody;				
  							 if(data.messageType.name == "Text")
  							 {  
  								 //to check the extension of the url                                            
                                 if(!url.match(/^(https:\/\/docs.google.com\/)/)) 
                                 {	
                                	 // embedly
                                	 $('p#'+data.id.id+'-id').embedly({
                                		 maxWidth: 200,
 	                                	 wmode: 'transparent',
                                		 method: 'after',
                                		 key:'4d205b6a796b11e1871a4040d3dc5c07'
		  	  					 	 });
                                 }
                                 else
                                 {            
                                	//insert google doc image for doc url
                                 }        
                         	 }                                          
                             else      //insert value to hidden field
                             {
                            	 $('input#'+data.id.id+'-url').val(msgUrl);  
                             }                                           
		    	 		 });
			    	 	 _.each(data, function(data) {
			    	 		 showJanrainShareWidget(data.messageBody, 'View my Beamstream post', 'http://beamstream.com', data.messageBody);
			    	 	 });
		     		 }      
   				     
   				     /* delete default embedly preview */
			  		 $('div.selector').attr('display','none');
			  		 $('div.selector').parents('form.ask-disccution').find('input[type="hidden"].preview_input').remove();
			  		 $('div.selector').remove();
   				  	 $('#msg-area').val("");

    	 		 }
     		 });
 		 },
 		 
 		 /**
 		  * NEW THEME - Follow a message
 		  */
 		followMessage: function(eventName){
 			eventName.preventDefault();
 			 
 			var element = eventName.target.parentElement;
 			var messageId =$(element).parents('div.follow-container').attr('id');
 			
 			var text = $('#'+eventName.target.id).text();
 		
 			var self =this;
 			$.ajax({
 				type: 'POST',
 		        url:BS.followMessage,
 		        data:{
 		        	messageId:messageId
 		        },
 		        dataType:"json",
 		        success:function(data){
 		        	
 		        	//set display
 		        	if(text == "Unfollow")
 		    		{
 		        		 $('#'+eventName.target.id).text("Follow");
 		    		}
 		        	else
 		        	{
 		        		$('#'+eventName.target.id).text("Unfollow");
 		        	}
 		        	 
 	                /* Auto push */   
 		        	var streamId =  $('.sortable li.active').attr('id');
// 	                PUBNUB.publish({
// 	                	channel : "stream",
// 	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId}
// 	                })
	            }
	        });
	    },
	    
	    /**
	     * NEW THEME - Rocking messages
	     */
	    rockMessage: function(eventName){
	    	
	    	eventName.preventDefault();
			var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			var self = this;
			
			$.ajax({
				type: 'POST',
	            url:BS.rockedIt,
	            data:{
	            	messageId:messageId
	            },
	            dataType:"json",
	            success:function(data){
	            	console.log($('#'+messageId+'-msgRockCount').attr('class')); 
	            	if($('#'+messageId+'-msgRockCount').hasClass('rocks'))
	            	{
	            		$('#'+messageId+'-msgRockCount').removeClass('rocks');
	            		$('#'+messageId+'-msgRockCount').addClass('rocks-up');
	            	}
	            	else
	            	{
	            		$('#'+messageId+'-msgRockCount').removeClass('rocks-up');
	            		$('#'+messageId+'-msgRockCount').addClass('rocks');
	            	}
	            	
	            	// display the count in icon
	                $('#'+messageId+'-msgRockCount').find('span').html(data);
	                //auto push
	                var streamId =  $('.sortable li.active').attr('id');
					PUBNUB.publish({
						channel : "msgRock",
	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,msgId:messageId}
	                })
             	}
            });
        },
	    
        /**
         * NEW THEME - Show comment text area on click
         */
        showCommentTextArea: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			
			// show / hide commet text area 
			if($('#'+messageId+'-addComments').is(":visible"))
			{
				
				$('#'+messageId+'-msgComment').val('');
				$('#'+messageId+'-addComments').slideToggle(300); 
				
				
			}
			else
			{
				$('#'+messageId+'-msgComment').val('');
				$('#'+messageId+'-addComments').slideToggle(200); 
				
			}
			
        },
        
        /**
         * NEW THEME - remove the comment text area when it lost focus without any content
         */
        removeCommentTextArea: function(eventName){
        	
        	var parent =$(eventName.target).parents('div.follow-container').attr('id');
        	
        	//slide up the comment text area if the text is empty
        	if($(eventName.target).val() == "")
        	{
        		 $('#'+parent+'-addComments').slideUp(200); 
        	}
        },
        
        /**
         * NEW THEME -- hide comment test area when we delete the comment text from text area
         */
        deleteCommentText: function(eventName){
        	var element = eventName.target.parentElement;
        	var parent =$(element).parents('div.follow-container').attr('id');
        	var commentText = $('#'+parent+'-msgComment').val();
        	if(commentText == "")
        		$('#'+parent+'-addComments').slideUp(200); 
        },
        
        /**
         *  NEW THEME - post new comments on enter key press
         */
        addMessageComments: function(eventName){
        	
        	var element = eventName.target.parentElement;
        	var parent =$(element).parents('div.follow-container').attr('id');
        	var totalComments =  $('#'+parent+'-totalComment').text();
        	var commentText = $('#'+parent+'-msgComment').val();
        	

        	 
        	var self =this;
        
        	/* post comments on enter key press */
        	if(eventName.which == 13) {
        		
        		eventName.preventDefault(); 
   			 	
//   			
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
   				  				 
   				  		$('#'+parent+'-msgComment').val('');
   				  	    $('#'+parent+'-addComments').slideUp(200); 
   				  		
   				  		_.each(datas, function(data) {
   				  			totalComments++; 
   				  			var comments = $("#tpl-discussion-messages-comment").html();
   							var commentsTemplate = Handlebars.compile(comments);
   							 
   							$('#'+parent+'-allComments').prepend(commentsTemplate(data));
   							$('#'+data.id.id+'-image').attr("src" ,BS.profileImageUrl );
   							 
   							if(!$('#'+parent+'-allComments').is(':visible'))
   							{  
   								var newComments = $("#tpl-discussion-messages-newComment").html();
   								var newCmtTemplate = Handlebars.compile(newComments);
   								$('#'+parent+'-newCommentList').prepend(newCmtTemplate(data));
   								$('#'+data.id.id+'-newCmtImage').attr("src" ,BS.profileImageUrl );
   								
   							}
   							$('#'+parent+'-show-hide').text("Hide All");
   							$('#'+parent+'-totalComment').text(totalComments);
   							/* auto push */
   		  					var streamId = $('.sortable li.active').attr('id');
   			                PUBNUB.publish({
   			                	channel : "comment",
		                        message : { pagePushUid: self.pagePushUid ,data:data,parent:parent,cmtCount:totalComments,prifileImage : BS.profileImageUrl}
   			                })
   							 
			  		    });
   				  				

			  	    }
	  		    });
	        }
        },
        
        /**
         * NEW THEME-  Show / hide all comments of a message
         */
        showAllCommentList: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			if($('#'+messageId+'-allComments').is(":visible"))
			{
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideUp(600); 
				$('#'+messageId+'-show-hide').text("Show All");
			}
			else
			{
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideDown(600); 
				$('#'+messageId+'-show-hide').text("Hide All");
			}
        },
        /**
         * NEW THEME - show / hide all comments ..
         */
        showAllList: function(eventName){
        	eventName.preventDefault();
        	
        	var element = eventName.target.parentElement;
			var messageId =$(element).parents('div.follow-container').attr('id');
			if($('#'+messageId+'-show-hide').text() == "Hide All")
            {
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideUp(600); 
				$(eventName.target).text("Show All");
            }
			else
			{
				$('#'+messageId+'-newCommentList').html('');
				$('#'+messageId+'-allComments').slideDown(600);
				$(eventName.target).text("Hide All");
			}
			
        },
        
        /**
         * NEW THEME - Rock comments
         */
        rockComment: function(eventName){
        	
        	eventName.preventDefault();
        	
        	var commentId = $(eventName.target).parents('div.answer-description').attr('id');
        	var messageId = $(eventName.target).parents('div.follow-container').attr('id');
        	var self = this;
        	
        	/* Rock comment */
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
                	$('#'+commentId+'-rockCount').html(data);
                	
                	/*auto push */
    				var streamId = $('.sortable li.active').attr('id');
    				PUBNUB.publish({
                          channel : "commentRock",
                          message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,commentId:commentId }
                    })
     
                }
            });
        },
        
        /**
         * NEW THEME - show upload file section
         */
        showUploadSection: function(eventName){
        	eventName.preventDefault();
        	if($('.embed-info').is(":visible"))
        	{
        		$('.embed-info').css("display","none");
        	}
        	else
        	{
        		$('.embed-info').css("display","block");
        	}
        	
        	
        	
        },
        
        /**
         * NEW THEME -  get uploaded files 
         */
        getUploadedData: function(e){
        	var self = this;;
    	    file = e.target.files[0];
    	    var reader = new FileReader();
    	      
        	/* capture the file informations */
            reader.onload = (function(f){
            	self.file = file;
            })(file);
             
            // read the  file as data URL
            reader.readAsDataURL(file);
        },
        
        /**
         * NEW THEME - select private to class options
         */
        selectPrivateToList: function(eventName){
        	eventName.preventDefault();
        	$('#select-privateTo').text($(eventName.target).text());
        	
        	//uncheck private check box when select Public
        	if($(eventName.target).text() == "Public")
        	{
        		$('#private-to').attr('checked',false);
        	}
        	else
        	{
        		$('#private-to').attr('checked',true);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        
        /**
         * NEW THEME - select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	
        	if($('#private-to').attr('checked')!= 'checked')
        	{
        		$('#select-privateTo').text("Public");
            	
        	}
        	else
        	{
        		$('#select-privateTo').text("Class");
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        /**
         * NEW THEME - actvate share icon on selection
         */
        actvateShareIcon: function(eventName){
        	
        	eventName.preventDefault();
        	$('#private-to').attr('checked',false);
        	$('#select-privateTo').text("Public");
        	if($(eventName.target).parents('li').hasClass('active'))
        	{
        		$(eventName.target).parents('li').removeClass('active');
        	}
        	else
        	{
        		$(eventName.target).parents('li').addClass('active');
        	}
        	
        
        	
        	
        },
        
        /**
         * NEW THEME - sort messages within a period 
         */
        sortMessagesWithinAPeriod: function(eventName){
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
        
        /**
         *  NEW THEME - Sort Messages/Discussions
         */
        sortMessages: function(eventName){
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	$('#sortBy-select').text($(eventName.target).text());
        	
        	var sortBy = $(eventName.target).attr('name');
        	if(sortBy == "most-recent")
        	{
        		BS.msgSortedType = "date";
        		$('#all-messages').html('');
        		BS.pageForDate = 1;
        		self.sortByMostRecent(streamId,BS.pageForDate,BS.pageLimit);
        		
        	}
        	else if(sortBy == "highest-rated")
        	{
        		BS.msgSortedType = "vote";
        		$('#all-messages').html('');
        		BS.pageForVotes = 1;
        		self.sortByHighestRated(streamId,BS.pageForVotes,BS.pageLimit)
        	}
        		
        },
        
        /**
		 * NEW THEME - sort messages by keyword
		 */
		 sortMessagesByKey :function(eventName){
			
			 var self = this;
	 		 if(eventName.which == 13) {
	 			eventName.preventDefault();
	 			 BS.msgSortedType = "keyword";
	 			 BS.pageForKeyword = 1;
	 			 $('#all-messages').html('');
				 var keyword = $('#sort_by_key').val();
				 var streamId =$('.sortable li.active').attr('id');
				 self.sortBykeyword(streamId,keyword,BS.pageForKeyword,BS.pageLimit);
				
			 } 
		 },
		 
		 /**
		  * NEW THEME - get messages and sort by keywords
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
         * NEW THEME - sort messages by Most Recent 
         */
        sortByMostRecent: function(streamId,pageNo,limit){
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
         * NEW THEME - sort messages by highest rated
         */
        sortByHighestRated: function(streamId,pageNo,limit){
        	
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
         * NEW THEME - Display messages 
         */
        displayMessages: function(data){
        	
        	var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
        	var trueurl='';
        	var self = this;
        	
			//hide page loader image
			if(!data.length)
				$('.page-loader').hide();
				   
			//display the messages
			_.each(data, function(data) {
				var messageType ='';
				var msgBody = data.messageBody;
                                                
				//var links =  msgBody.match(BS.urlRegex); 
                var msgUrl=  msgBody.replace(BS.urlRegex1, function(msgUrlw) {
                	trueurl= msgUrlw;    
                    return msgUrlw;
                });
                
                //to get the extension of the uploaded file
                var extension = (trueurl).match(pattern);  
                
               
                if(data.messageType.name == "Text")
                {    
                    	 
                     //to check whether the url is a google doc url or not
                     if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) 
                     {
                    	 messageType = "googleDocs";
                     }
                     else
                     {
                    	 messageType = "messageOnly";
                         var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
                               return '<a target="_blank" href="' + url + '">' + url + '</a>';
                         });
                     }
                }
                else
                {          
                     // set first letter of extension in capital letter  
	                	 extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
	                	    return letter.toUpperCase();
	                	 });
                          
                }
               
				var datas = {
					 	 "datas" : data,
				    }
                BS.filesMediaView = new BS.FilesMediaView(); 
                var datVal =  BS.filesMediaView.formatDateVal(data.timeCreated);
					
				if(messageType == "googleDocs")
				{
					var datas = {
							    "datas" : data,
                                "datVal" :datVal,
                                "previewImage" : "images/google_docs_image.png",
                                "type" : "googleDoc"
				     }	
					var source = $("#tpl-messages_with_docs").html();
						
				}
				else if(messageType == "messageOnly")
				{
					
					var source = $("#tpl-discussion-messages").html();
						
				}
				else
				{
					if(data.messageType.name == "Image")
					{
						var source = $("#tpl-messages_with_images").html();
  						
					}
					else if(data.messageType.name == "Video")
					{
						var source = $("#tpl-messages_with_images").html();
  						
					}
					else
					{
						var previewImage = '';
						var commenImage ="";
						var type = "";
						 
						if(extension == 'Ppt')
						{
                            previewImage= "images/presentations_image.png";
                            type = "ppt";
                            
						}
						else if(extension == 'Doc')
						{
							previewImage= "images/docs_image.png";
							type = "doc";
							 	
						}
						else if(extension == 'Pdf')
						{
							 
							previewImage= data.anyPreviewImageUrl;
							type = "pdf";
						}
						else
						{
							previewImage= "images/textimage.png";
							commenImage = "true";
							type = "doc";
							
						}
						
						var datas = {
							    "datas" : data,
                                "datVal" :datVal,
                                "previewImage" :previewImage,
                                "extension" : extension,
                                "commenImage" : commenImage,
                                "type" : type
				        }	
					
					    var source = $("#tpl-messages_with_docs").html();
						
				  }
						
				}
				
//				$('.right-container').html(rightContentTemplate(topMenuDetails));
				var template = Handlebars.compile(source);
//					$('.page-loader').hide();
					$('#all-messages').append(template(datas));
					$('.drag-rectangle').tooltip();		
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
			    					 $('#'+data.id.id+'-follow').text("Unfollow");
			    			}
			    	 });
			         
			         
			         /* make a call to check whether the logged user is already rock this message*/ 
					 $.ajax({
			             type: 'POST',
			             url:BS.isARockerOfMessage,
			             data:{
			            	 messageId:data.id.id
			             },
			             dataType:"json",
			             success:function(result){
			            	 if(result == "true")
			            	 {
			            		 $('#'+data.id.id+'-msgRockCount').removeClass('rocks-up');
			            		 $('#'+data.id.id+'-msgRockCount').addClass('rocks');			            		 
			            	 }
			            	 else
			            	 {
			            		 $('#'+data.id.id+'-msgRockCount').removeClass('rocks');
			            		 $('#'+data.id.id+'-msgRockCount').addClass('rocks-up');
			            	 }
			            	 
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
			    			success : function(pofiledata) {
			    				var imgUrl;
			    				if(pofiledata.status)
			    				 {
			    					imgUrl = "images/profile-img.png";
			    				 }
			    				 else
			    				 {   
			    					 // shoe primary profile image 
			    					 if(pofiledata.contentType.name == "Image")
			    					 {
			    						imgUrl = pofiledata.mediaUrl;
			    					 }
			    					 // shoe primary profile video 
			    					 else
			    					 {
			    						imgUrl = pofiledata.frameURL;
			    					 }
			    				 }
			    				$('img#'+data.id.id+'-img').attr("src", imgUrl);
			    			}
			    	 });
				           
					 if(linkTag)
						 $('p#'+data.id.id+'-id').html(linkTag);
						 
                 var url=data.messageBody;
                 if(data.messageType.name == "Text"){   
                                     
                     if(!url.match(/^(https:\/\/docs.google.com\/)/)) {
                         // embedly
                         $('p#'+data.id.id+'-id').embedly({
                                 maxWidth: 200,
                                 msg : 'https://assets0.assembla.com/images/assembla-logo-home.png?1352833813',
	                             wmode: 'transparent',
	                             method: 'after',
	                             key:'4d205b6a796b11e1871a4040d3dc5c07'
                         });
                      }

                 }
                 else       
                 {
                    	 
                    	 if(data.messageType.name == "Image")
                    	 {
                    		   
//                    		 var content = '<div  class="gallery clearfix " style="clear: none !important;"></div><div class="gallery clearfix hrtxt"><a rel="prettyPhoto"  id="'+data.id.id+'"  href="' + msgUrl + '"><img class="previw-pdf" id="'+data.id.id+'" src="'+data.anyPreviewImageUrl+'" height="50" width="150" /></a></div>'


                    	 }
                    	 else if(data.messageType.name == "Video")
                    	 {
//                    		 var content = '<div  class="gallery clearfix " style="clear: none !important;"></div><div class="gallery clearfix hrtxt"><a rel="prettyPhoto" id="'+data.id.id+'"  href="' + msgUrl + '"><img class="previw-pdf" id="'+data.id.id+'" src="'+data.anyPreviewImageUrl+'" height="50" width="150" /></a></div>';
                    	 }
                    	 else
                    	 {
                    	 }
                    	 
//                         $('input#'+data.id.id+'-url').val(msgUrl); 
                    	 
                    	 /* for video popups */
                         $("area[rel^='prettyPhoto']").prettyPhoto();
      					 $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
      					 $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
      			
                   }
                   
						 
				   self.showAllComments(data.id.id);
		      });
		
        },
        
	    /**
	     * get all class streams of a user
	     */
	    getClassStreams: function(type){
	    	 
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
	    
	    /**
	     *  hide hover over list for Create Stream button
	     */ 
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
	     * get all details about messages and its comments of a stream
	     */
	    getMessageInfo :function(streamid,pageNo,limit){
	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
	         var trueurl='';
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
	                                                        
	//                                                        var links =  msgBody.match(BS.urlRegex); 
	                                                        var msgUrl=  msgBody.replace(BS.urlRegex1, function(msgUrlw) {
	                                                               trueurl= msgUrlw;    
	                                                               
	                                                                return msgUrlw;
	                                                             });
	                                                       var extension = (trueurl).match(pattern);  //to get the extension of the uploaded file                                                  
	                                                        if(!extension){                           //to check the extension of the url
	                                                        if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) {
	                                                            
	                                                             var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
	                                                                 return '<a class="strmdoc" id="'+data.id.id+'"  href="' + url + '">' + url + '</a>';
	                                                            });
	                                                        }
	                                                        else{
	                                                                    var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
	                                                                 return '<a target="_blank" href="' + url + '">' + url + '</a>';
	                                                            });
	                                                        }
	                                                        }
	                                                         else{         //url has extension
	                                                             var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {                                               
	                                                                 return '<a class="uploaded" id="'+data.id.id+'"  href="' + url + '">' + url + '</a>';
	                                                            });
	                                                         }
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
		  				    			success : function(pofiledata) {
		  				    				var imgUrl;
		  				    				if(pofiledata.status)
		  				    				 {
		  				    					imgUrl = "images/unknown.jpeg";
		  				    				 }
		  				    				 else
		  				    				 {   
		  				    					 // shoe primary profile image 
		  				    					 if(pofiledata.contentType.name == "Image")
		  				    					 {
		  				    						imgUrl = pofiledata.mediaUrl;
		  				    					 }
		  				    					 // shoe primary profile video 
		  				    					 else
		  				    					 {
		  				    						imgUrl = pofiledata.frameURL;
		  				    					 }
		  				    				 }
		  				    				$('img#'+data.id.id+'-img').attr("src", imgUrl);
		  				    			}
		  				    		});
		  				           
		  						 if(linkTag)
		  						  $('div#'+data.id.id+'-id').html(linkTag);
		  						 
	                                                         var url=data.messageBody;
	                                                         if(!extension){   //to check the extension of the url
	                                                         
	                                                        if(!url.match(/^(https:\/\/docs.google.com\/)/)) {
	                                                                // embedly
	                                                                    $('div#'+data.id.id+'-id').embedly({
	                                                                             maxWidth: 200,
	                                                                             msg : 'https://assets0.assembla.com/images/assembla-logo-home.png?1352833813',
	                                                                     wmode: 'transparent',
	                                                                     method: 'after',
	                                                                         key:'4d205b6a796b11e1871a4040d3dc5c07'
	                                                            });
	                                                        }
	                                                        
	                                                        else
	                                                            {
	 
	                                                        	var msgUrl=  msgBody.replace(BS.urlRegex1, function(msgUrl) {
	                                                                    
	                                                                $('input#'+data.id.id+'-url').val(msgUrl);
	                                                                return msgUrl;
	                                                             });
	//                                                        	$('input#'+data.id.id+'-url').val(msgUrl);
	                                                            var content = '<div class="stream-doc-block"><a class="strmdoc" id="'+data.id.id+'"  href="' + msgUrl + '"><img  id="'+data.id.id+'" src="images/googledocs.jpg" /></a></div>'
	                                                            $('#'+data.id.id+'-docurl').html(content);
	                                                            }
	                                                         }
	                                                         else      //insert value to hidden field
	                                                            {
	                                                              $('input#'+data.id.id+'-url').val(msgUrl);  
	                                                            }
		  						 
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
	  	    	console.log("else case");
	  	    }
	  	   $('#streams-list').slideDown();
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
		  * show UnRock Message  Only if a user has already Rocked the message
		  */
		 showUnrockMessage:function(eventName){
			 eventName.preventDefault();
			 var element = eventName.target.parentElement;
			 var msgId =$(element).closest('li').attr('id');
			  
			 /* make a call to check whether the logged user is already rock this message*/ 
			 $.ajax({
	             type: 'POST',
	             url:BS.isARockerOfMessage,
	             data:{
	            	 messageId:msgId
	             },
	             dataType:"json",
	             success:function(data){
	            	 if(data == "true")
	            	 {
	            		// popup says "UnRock Message 
		               	var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">UnRock Message</div>';
		    
		           		$('#hover-lists-'+msgId+'').fadeIn("fast").delay(1000).fadeOut('fast'); 
		           		$('#hover-lists-'+msgId+'').html(ul);
	            	 }
	            	 
	             }
	          });
			 
			 
		 },
		 
		 /**
		  * show UnRock Comment  Only if a user has already Rocked comment
		  */
		 showUnrockComment:function(eventName){
			 eventName.preventDefault();
			 var element = eventName.target.parentElement;
			 var commentId =$(element).closest('li').attr('id');
			 var messageId =$(element).closest('li').parent('ul').parent('article').parent('li').attr('id');
			  
			 /* make a call to check whether the logged user is already rock this comment*/ 
			 $.ajax({
	             type: 'POST',
	             url: BS.isARockerOfComment,
	             data:{
	            	 commentId:commentId,
	             },
	             dataType:"json",
	             success:function(data){
	            	 
	            	 if(data== 'true')
	            	 {
	            		// popup says "UnRock Comment 
	               	  	var ul = '<div style="font:italic bold 12px Georgia, serif; margin:0 0 10px;">UnRock Comment</div>';
		           		$('#cmthover-lists-'+commentId+'').fadeIn("fast").delay(1000).fadeOut('fast'); 
		           		$('#cmthover-lists-'+commentId+'').html(ul);
	            	 }
	            	 
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
		 
		 /*
		  * delete a message
		  */
		 deleteMessage :function(eventName){
			 eventName.preventDefault();
			 var messageId = eventName.target.id;
			 var ownerId = $('ul.timeline_items li#'+messageId).attr('name');
			 // check whether the  message owner is the logged user or not
			 if(localStorage["loggedUserInfo"] == ownerId)
			 {
				 var alert = '<div id="msg-dialog-'+messageId+'" name="'+messageId+'" title="Delete !">Are you sure you want to delete this message?</br></div>';
				 $('#alert-popup').html(alert);
				 $('#msg-dialog-'+messageId).dialog({
	
						autoOpen: false ,
						modal: true,
						draggable: false,
					    resizable: false,
					    buttons: { 
					    	 
					    	 "Delete": function() { 
					    		 
					    		 // delete particular message
					    		 $.ajax({
					                 type: 'POST',
					                 url: BS.deleteMessage,
					                 data:{
					                	  messageId :messageId
					                 },
					                 dataType:"json",
					                 success:function(data){
					                	 if(data.status == "Success")
					                	 {
					                		 $('ul.timeline_items li#'+messageId).remove();
								    		 $('#msg-dialog-'+messageId).dialog("close");
					                	 }
					                	 else
					                	 {
					                		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
					                 		$('.error-msg').html(data.message);
					                	 }
					                	 
					                 }
					              });
					    		
			                  
			                 },
			                 "Cancel": function() { 
			                	 $('#msg-dialog-'+messageId).dialog('close');
				              },
				        }
			         
					 });
				 	$('#msg-dialog-'+messageId).dialog('open');
				 	$('#msg-dialog-'+messageId).dialog({ height: 100 });
				
			 }
			 else
			 {
				 $('#display_message').css('padding-top','100px');
				 $('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
	      		 $('.error-msg').html("You're Not Authorised To Delete This Message");
			 }
					 
			 
		 },
		 
		 /**
		  * delete comment
		  */
		 deleteComment :function(eventName){
			 eventName.preventDefault();
			 
			 var element = eventName.target.parentElement;
			 var commentId =$(element).closest('li').attr('id');
			 var messageId =$(element).closest('li').parent('ul').parent('article').parent('li').attr('id');
			 var ownerId = $('#'+commentId).attr('name'); 
			 
			// check whether the  comment owner is the logged user or not
			 if(localStorage["loggedUserInfo"] == ownerId)
			 {
				 var alert = '<div id="comment-dialog-'+commentId+'" title="Delete !">Are you sure you want to delete this comment?</br></div>';
				 $('#alert-popup').html(alert);
				 $('#comment-dialog-'+commentId).dialog({
		
						autoOpen: false ,
						modal: true,
						draggable: false,
					    resizable: false,
					    buttons: { 
					    	 
					    	 "Delete": function() { 
					    		 
					    		 // delete particular message
					    		 $.ajax({
					                 type: 'POST',
					                 url: BS.deleteTheComment,
					                 data:{
					                	  messageId :messageId,
					                	  commentId :commentId
					                 },
					                 dataType:"json",
					                 success:function(data){
					                	 if(data.status == "Success")
					                	 {
					                		 var commentCount = $('#'+messageId+'-cmtCount').text();
								    		 if(commentCount == 1)
								    		 {
								    			 $('#'+messageId+'-header').html("");
								    		 }
								    		 else
								    		 {
								    			 $('#'+messageId+'-cmtCount').text(commentCount-1);
								    		 }
								    		 $('#'+messageId+'-commentlists li#'+commentId).remove();
								    		 $('#comment-dialog-'+commentId).dialog('close');
					                	 }
					                	 else
					                	 {
					                		$('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
					                 		$('.error-msg').html(data.message);
					                	 }
					                	
					                 }
					              });
				
			                  
			                 },
			                 "Cancel": function() { 
			                	 $('#comment-dialog-'+commentId).dialog('close');
				              },
				        }
			         
					 });
				 	$('#comment-dialog-'+commentId).dialog('open');
				 	$('#comment-dialog-'+commentId).dialog({ height: 100 });
			 }
			 else
			 {
				 $('#display_message').css('padding-top','100px');
				 $('#display_message').fadeIn("medium").delay(2000).fadeOut('slow');
	      		 $('.error-msg').html("You're Not Authorised To Delete This Comment");
			 }
		 },
	 
		 /**
		  * navigate to profile page to edit profile pic
		  */
		 showProfilePage : function(eventName){
			  
			 eventName.preventDefault();
			 localStorage["editProfile"] = "true";
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
		  *  sort stream messages
		  */
		 sortMessagess:function(eventName){
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
		  * render public profile view
		  */
		 
		 renderPublicProfile :function (eventName){
			 console.log(eventName.target.id);
		 },
		 
	
	
	    /**
	     *For showing stream google docs in popup
	     */
	      showStrmDocPopup: function(eventName){
	             eventName.preventDefault(); 
	             var element = eventName.target.id;
	             var docUrl = $('input#'+element+'-url').val();
	//             var data = '<iframe src="'+docUrl+'" scrolling="NO"  width="963" height="500" style="border: none"> '
	//                 +'<p>Your browser does not support iframes.</p>'
	//                    '</iframe> ';
	            
	             BS.streamdocview = new BS.StreamDocView();
	             BS.streamdocview.render(docUrl);           
	             $('#streamdocview').html(BS.streamdocview.el);   
	         },
	         
	    
	     StrmMediaPopup: function(eventName){
	             eventName.preventDefault(); 
	             var element = eventName.target.id;
	             var docUrl = $('input#'+element+'-url').val();
	           
	               var docfrmcomputer='http://docs.google.com/gview?url='+docUrl+'&embedded=true '             
	             BS.streamdocview = new BS.StreamDocView();
	             BS.streamdocview.render(docfrmcomputer);           
	             $('#streamdocview').html(BS.streamdocview.el);   
	         },
	     
	      /**
	
		  * show the title when hover over the gogoledoc image
		  */
		 showDocTitle:function(eventName){
			 eventName.preventDefault();
			
			 var element = eventName.target.parentElement;
			 var msgId =$(element).closest('li').attr('id');
			 var position = $('li#'+msgId+'').find('i').position();
	                 
	                 var content = 'Click Here To Start Collaboration';
			 $('#hover-lists-'+msgId+'').fadeIn("fast").delay(1000).fadeOut('fast'); 
	                 $('#hover-lists-'+msgId+'').html(content);
	 
		 },
		 
		
		 
		 
		 
	 
	   /**
	    * NEW THEME - PUBNUB real time push
	    */
		 setupPushConnection: function() {
			 var self = this;
			 self.pagePushUid = Math.floor(Math.random()*16777215).toString(16);
			 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			 var trueurl='';
			 /* for message posting */
			 PUBNUB.subscribe({
				 channel : "stream",
				 restore : false,
				 callback : function(message) {
	
					 var streamId = $('.sortable li.active').attr('id');
					 if (message.pagePushUid != self.pagePushUid)
					 { 
						 if(message.streamId==streamId)
			       		 	{
							 	if(!document.getElementById(message.data.id.id))
							 	{	
							 		
							 		 var msgBody = message.data.messageBody;
		                             var msgUrl=  msgBody.replace(BS.urlRegex1, function(msgUrlw) {
		                            	 trueurl= msgUrlw;                                                                  
		                            	 return msgUrlw;
		                             });
		                             
		                             //to get the extension of the uploaded file
		                             var extension = (trueurl).match(pattern);  
		                             
		                             //to check whether the url is a google doc url or not
		                             if(message.data.messageType.name == "Text")                          
		                             {	
		                            	 if(msgBody.match(/^(https:\/\/docs.google.com\/)/)) 
		                                 {   
		                            		 messageType = "googleDocs";

		                                 }
		                            	 else
		                            	 {    
		                            		 messageType = "messageOnly";
		                            		 var linkTag =  msgBody.replace(BS.urlRegex1, function(url) {
		                            			 return '<a target="_blank" href="' + url + '">' + url + '</a>';
		                            		 });
		 	                                             
		                            	 }
		                             }                                                      
		                             else
		                             {         
		                                 // url has extension then set first letter of extension in capital letter  
		   	   		                	 extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
		   	   		                		 return letter.toUpperCase();
		   	   		                	 });

		                    		 }
		   							  
		                             var datas = {
		                            		 "datas" : message.data,
		                             }	
		                              
		                             // set a format style to date
		                             BS.filesMediaView = new BS.FilesMediaView(); 
		                             var datVal =  BS.filesMediaView.formatDateVal(message.data.timeCreated);
		    			                    
//		                             // if message conatains googledoc url
//		                             if(messageType == "googleDocs")
//		 							 {
//		                            	 
//		                            	 var datas = {
//		                            			 "datas" : data,
//		                            			 "datVal" :datVal,
//		                            			 "previewImage" : "images/google_docs_image.png",
//		                            			 "type" : "googleDoc"
//			 							 }	
//		 								 var source = $("#tpl-messages_with_docs").html();
//		 	         		  						
//		     						 }
//		                             // if message conatains messages only without any uploaded files
//		 							 else if(messageType == "messageOnly")
//		 							 {
		 								 var source = $("#tpl-discussion-messages").html();
//		     						 }
//		                             // if message conatains  uploaded files
//		 							 else
//		 							 {
//		 								 if(data.messageType.name == "Image")
//		 								 {
//		 									 var source = $("#tpl-messages_with_images").html();
//		 								 }
//		 								 else if(data.messageType.name == "Video")
//		 								 {
//		 									 var source = $("#tpl-messages_with_images").html();
//		 								 }
//		 								 else
//		 								 {
//		 									 var previewImage = '';
//		 									 var commenImage ="";
//		 									 var type = "";
//		     								 
//		 									 /* check its extensions and set corresponding preview icon images */
//		 									 if(extension == 'Ppt')
//		 									 {
//		 										 previewImage= "images/presentations_image.png";
//		 										 type = "ppt";
//		 									 }
//		 									 else if(extension == 'Doc')
//		 									 {
//		 										 previewImage= "images/docs_image.png";
//		 										 type = "doc";
//		 									 }
//		 									 else if(extension == 'Pdf')
//		 									 {
//		 										 previewImage= data.anyPreviewImageUrl;
//		 										 type = "pdf";
//		 									 }
//		 									 else
//		 									 {
//		 										 previewImage= "images/textimage.png";
//		 										 commenImage = "true";
//		 										 type = "doc";
//										 	 }
//		     									
//		 									 var datas = {
//		 											 "datas" : data,
//		 											 "datVal" :datVal,
//		 											 "previewImage" :previewImage,
//		 											 "extension" : extension,
//		 											 "commenImage" : commenImage,
//		 											 "type" : type
//								        	 }	
//		     								
//		 								     var source = $("#tpl-messages_with_docs").html();
//		     		  						 
//										 }
		 	         								
//		     						 }
		            			                    
		                             var template = Handlebars.compile(source);
		                             $('#all-messages').prepend(template(datas));

		                             //get profile image of logged user
		                             $('img#'+message.data.id.id+'-img').attr("src", BS.profileImageUrl);
		                            
		  							 if(linkTag)
		  								 $('p#'+message.data.id.id+'-id').html(linkTag);
		  						
		  							 var url=message.data.messageBody;				
		  							 if(message.data.messageType.name == "Text")
		  							 {  
		  								 //to check the extension of the url                                            
		                                 if(!url.match(/^(https:\/\/docs.google.com\/)/)) 
		                                 {	
		                                	 // embedly
		                                	 $('p#'+message.data.id.id+'-id').embedly({
		                                		 maxWidth: 200,
		 	                                	 wmode: 'transparent',
		                                		 method: 'after',
		                                		 key:'4d205b6a796b11e1871a4040d3dc5c07'
				  	  					 	 });
		                                 }
		                                 else
		                                 {            
		                                	//insert google doc image for doc url
		                                 }        
		                         	 }                                          
		                             else      //insert value to hidden field
		                             {
		                            	 $('input#'+message.data.id.id+'-url').val(msgUrl);  
		                             }                                           
						 	   }
	       		 		   }
				 	   }
			 
			 	   }
		 	   })
	    
	    
		 	   /* auto push functionality for comments */
	    
		 	   PUBNUB.subscribe({
	
		 		   channel : "comment",
		 		   restore : false,
	
		 		   callback : function(message) { 
	    	  
		 			   if(message.pagePushUid != self.pagePushUid)
		 			   {
	    		   
		 				   if(!document.getElementById(message.data.id.id))
		 				   {
		 					   var parent = message.parent;
		 					   var data = message.data;
		 					   var totalComments = message.cmtCount;
		 					   var prifileImage = message.prifileImage;
				    	      
		 					   
		 					   
		 					   var comments = $("#tpl-discussion-messages-comment").html();
		 					   var commentsTemplate = Handlebars.compile(comments);
	   							 
		 					   $('#'+parent+'-allComments').prepend(commentsTemplate(data));
		 					   $('#'+data.id.id+'-image').attr("src" ,BS.profileImageUrl );
   							 
		 					   if(!$('#'+parent+'-allComments').is(':visible'))
		 					   {  
		 						   var newComments = $("#tpl-discussion-messages-newComment").html();
		 						   var newCmtTemplate = Handlebars.compile(newComments);
		 						   $('#'+parent+'-newCommentList').prepend(newCmtTemplate(data));
		 						   $('#'+data.id.id+'-newCmtImage').attr("src" ,BS.profileImageUrl );
   								
		 					   }
		 					   $('#'+parent+'-show-hide').text("Hide All");
		 					   $('#'+parent+'-totalComment').text(totalComments);

	 				   	   }
 			   		   }
 		   		   }
	
 	   		   })
	    
		       /* for message Rocks */
 	   		   PUBNUB.subscribe({
		
 	   			   channel : "msgRock",
 	   			   restore : false,
 	   			   callback : function(message) {
 	   				   if(message.pagePushUid != self.pagePushUid)
 	   				   {   	  
 	   					   $('#'+message.msgId+'-msgRockCount').find('span').html(message.data);
 	   				   }
		   		   }
	   		   })
	    
	   		   /* for Comment Rocks */
	   		   PUBNUB.subscribe({
	
	   			   channel : "commentRock",
	   			   restore : false,
	   			   callback : function(message) {
	   				   if(message.pagePushUid != self.pagePushUid)
	   				   {   	  
	   					   $('#'+message.commentId+'-rockCount').html(message.data);
//	   					   $('li#'+message.commentId+'').find('i').find('i').html(message.data);
	   				   }
	   			   }
	   		   })
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
	            $(".done").toggle(function () {         
	                  $('a.done').text('DONE');
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
	                 $('span.close-btn').hide(); 
	                 $('div.drag-icon').hide();
	                 $('#sortable1').remove(); 
	                 $('#sortable4, #sortable5').sortable('destroy');
	                 $('li').removeAttr('draggable');
	                 
	                 /* remove if any red actvated stream li */
	                 $("#sortable4 li").each(function(n) {
	                	 var streamId = $(this).attr('id');
	 	     	    	 var StreamName = $(this).attr('name');
	 	     	    	 if($(this).hasClass('red-active'))
	 	     	    	 {
	 	     	    		var removeOption = '<a  id ="'+streamId+'" name ="'+StreamName+'"  href="#" class="icon1">'+StreamName+'</a>';
	 	     	    		$(this).removeClass("icon1 red-active");
	 	     	    		$(this).html(removeOption);
	 		     	    	$('.drag-rectangle').tooltip()	

	 	     	    		 
	 	     	    	 }
	                 });
	                 
	                 
	            });		
	//	$(window).load(function(){		
	            $('.drag-rectangle').tooltip()		
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
	   }
	   
	});
