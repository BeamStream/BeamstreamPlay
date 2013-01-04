/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for stream Questions page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.QuestionView = Backbone.View.extend({
	
		events : {
			 "click #post-question" : "postQuestion",
			 "keypress #Q-area" : "postQuestionOnEnterKey",
			 "click #sortBy-list" : "sortQuestions",
			 "click #date-sort-list" : "sortQuestionsWithinAPeriod",
			 "click .add-poll " : "addPollOptionsArea",
			 "click .add-option" : "addMorePollOptions",
			 "click #private-to" : "checkPrivateAccess",
			 "click #private-to-list li" :"selectPrivateToList",
			 "click #share-discussions li a" : "actvateShareIcon",
			 "click #question-file-upload li " : "uploadFiles",
			 "change #upload-files-area" : "getUploadedData",
			 "click .add-comment" : "showCommentTextArea",
			 "click .rock-comments" : "rockComment",
			 "click .rocks-small a" : "rockComment",
			 "click .follow-question" : "followQuestion",
			 "click .rocks-question" : "rockQuestion",
			 "click .follow-user" : "followUser",
			 "click .who-rocked-it" : "showRockersList",
			 "keypress .add-question-comment" : "addQuestionComments",
			 "focusout .add-question-comment" : "removeCommentTextArea",
			 "click .show-all-comments" : "showAllCommentList",
			 "click .show-all" : "showAllList",
			 "click .regular-radio": "polling",
			 "click .delete_post" : "deleteQuestion",
			 
		},
	
		initialize : function() {
			
			console.log('Initializing QuestionView');
			this.source = $("#tpl-questions-middle-contents").html();
			this.template = Handlebars.compile(this.source);
			
			this.setupPushConnection();
			BS.questionSortedType = '';
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
			 	   var t = $('#all-questions').find('div.follow-container');
				   if(t.length != 0)
				   {
						$('.page-loader').show();
						var streamId = $('.sortable li.active').attr('id');
					
						if(BS.questionSortedType == "")
						{    
							BS.pagenum++;
							self.getAllQuestions(streamId,BS.pagenum,BS.pageLimit);
						}
						else if(BS.questionSortedType == "vote")
						{    
							BS.pageForVotes++
							self.sortByHighestRated(streamId,BS.pageForVotes,BS.pageLimit)
						}
						else if(BS.questionSortedType == "keyword")
						{
							BS.pageForKeyword++;
							var keyword = $('#sort_by_key').val();
							self.sortBykeyword(streamId,keyword,BS.pageForKeyword,BS.pageLimit);
						}
						else if(BS.questionSortedType == "date")
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
		 * render class Info screen
		 */
		render : function(eventName) {
		    
			$(this.el).html(this.template);
			return this;
		},
		
		/**
		 * NEW THEME - polling
		 */
		polling:function(eventName){
//			eventName.preventDefault();
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			/* updating pie charts */ 
			var pollscount = [2,0,0];
			 
			var values = [10,10,10,10];
            $("#"+questionId+"-piechart").find('svg').remove();
            donut[questionId] = new Donut(new Raphael(""+questionId+"-piechart", 200,200));
            donut[questionId].create(100, 100, 30, 55,100, values);
        	 
			
		},
		
		 /**
	     * NEW THEME - post questions on enter key
	     */
	    postQuestionOnEnterKey: function(eventName){
	    	
	    	var self = this;
			 
			if(eventName.which == 13) {
				self.postQuestion(); 
			}
			if(eventName.which == 32){
				 
				var text = $('#Q-area').val();
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
				    				 var qst = $('#Q-area').val();
				    				 question = qst.replace(links[0],data.data.url);
				    				 $('#Q-area').val(question);
						    				
				    			}
				    		});

							$('#Q-area').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});
						          
				        }
		            }
			    }
		 	}
    	},
		
		/**
		 * function for post questions 
		 */
		postQuestion: function(eventName){
			
			
			// upload file 
	        var self = this;
	        var streamId =  $('.sortable li.active').attr('id');
	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
	        var question = $('#Q-area').val();
	        
	      
	        //get message access private ? / public ?
	        var questionAccess;
	        var queAccess =  $('#private-to').attr('checked');
	        var privateTo = $('#select-privateTo').text();
		    if(queAccess == "checked")
		    {
		    	if(privateTo == "My School")
		    	{
		    		questionAccess = "PrivateToSchool";
		    	}
		    	else
		    	{
		    		questionAccess = "PrivateToClass";
		    	}
		    	 
		    }
		    else
		    {
		    	questionAccess = "Public";
		    }
		    
		    var trueurl='';
	        if(this.file )
	        {
//	        	 @ TODO
//	        	$('#file-upload-loader').css("display","block");
//
//	        	var data;
//	            data = new FormData();
//	            data.append('docDescription',message);
//	            data.append('docAccess' ,messageAccess);
//	            data.append('docData', self.file);  
//	            data.append('streamId', streamId);  
//	           
//	            /* post profile page details */
//	            $.ajax({
//	            	type: 'POST',
//	                data: data,
//	                url: BS.uploaddocFrmComputer,
//	                cache: false,
//	                contentType: false,
//	                processData: false,
//	                dataType : "json",
//	                success: function(data){
//	                	var owner = "";
//	    				if(data.userId.id == BS.loggedUserId)
//	    				{
//	    					owner = "true";
//	    				}
//	    				else
//	    				{
//	    					owner = "";
//	    				}
//	                	
//	                	$('#msg-area').val("");
//	                	$('#uploded-file').hide();
//	              	    self.file = "";
//	              	    $('#file-upload-loader').css("display","none");
//	              	    $('.embed-info').css("display","none");
//	              	    
//	              	    var datVal = formatDateVal(data.timeCreated);
//	                  	 
//	  	                var datas = {
//	  	                		"datas" : data,
//	  	                		"datVal" :datVal,
//	  	                		"owner": owner
//	  		            }						  
//
//	  	                /* Pubnub auto push */
//	  	                PUBNUB.publish({
//	  	                	channel : "stream",
//	  	                		message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,prifileImage : BS.profileImageUrl}
//	  	                }) 
//                      
////                        $('input#'+data.id.id+'-url').val(msgUrl);  
//                        $('img#'+data.id.id+'-img').attr("src", BS.profileImageUrl);
//	                           
//	                           
//                        /*show image preview icons  */
//	                    
//                        //var links =  msgBody.match(BS.urlRegex); 
//                        var msgUrl=  data.messageBody.replace(BS.urlRegex1, function(msgUrlw) {
//                        	trueurl= msgUrlw;    
//                            return msgUrlw;
//                        });
//                        var extension = (trueurl).match(pattern);  //to get the extension of the uploaded file    
//	                           
//
//	                           
//	                    // set first letter of extension in capital letter  
//	  	                extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
//	  	                	return letter.toUpperCase();
//	  	                });
//	  	               
//	  	                
//	    		                  
//	                    if(data.messageType.name == "Image")
//	  					{
//	                    	var source = $("#tpl-messages_with_images").html();
//	  	  						
//	  					}
//	  					else if(data.messageType.name == "Video")
//	  					{
//	  						var source = $("#tpl-messages_with_images").html();
//	  	  						
//	  					}
//	  					else
//	  					{
//	  						var previewImage = '';
//	  						var commenImage ="";
//	  						var type = "";
//	  							 
//	  						if(extension == 'Ppt')
//	  						{
//	  							previewImage= "images/presentations_image.png";
//	  	                        type = "ppt";
//	  						}
//	  						else if(extension == 'Doc')
//	  						{
//  								previewImage= "images/docs_image.png";
//  								type = "doc";
//	  						}
//	  						else if(extension == 'Pdf')
//	  						{
//  								previewImage= data.anyPreviewImageUrl;
//  								type = "pdf";
//	  						}
//  							else
//  							{
//  								previewImage= "images/textimage.png";
//  								commenImage = "true";
//  								type = "doc";
//	  								
//  							}
//	  							
//  							var datas = {
//							    "datas" : data,
//                                "datVal" :datVal,
//                                "previewImage" :previewImage,
//                                "extension" : extension,
//                                "commenImage" : commenImage,
//                                "type" : type,
//                                "owner": owner
//  					        }	
//	  						
//  						    var source = $("#tpl-messages_with_docs").html();
//	    						
//  						}
//	                           
//                        var template = Handlebars.compile(source);
//                        $('#all-messages').prepend(template(datas));
//                        $('img#'+data.id.id+'-img').attr("src", BS.profileImageUrl);
////                        $('input#'+data.id.id+'-url').val(msgUrl); 
//	                      	 
//                      	/* for video popups */
//	                    $("area[rel^='prettyPhoto']").prettyPhoto();
//    					$(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
//    					$(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
//	        			
//                    },
//                    error:function(error){
//                    	alert("You need to add a stream first.");
//                    	self.file = "";
//	              	    $('#file-upload-loader').css("display","none");
//                    	$('#msg-area').val("");
//                    	$('.embed-info').css("display","none");
//                    }
//                });       
        	}
	        else
	        {
	        	 
	  	        /* get message details from form */
	  	        BS.updatedQuestion =  question;
	  	        if(!question.match(/^[\s]*$/))
	  	        {   
	  	        	
	  	        	
	  	        	
	  	        	//find link part from the message
	  		        var link =  question.match(BS.urlRegex); 
	  		       
	  		        if(link)
	  		        {  
	  		        	if(!BS.urlRegex2.test(link[0])) {
	  		        		urlLink = "http://" + link[0];
	  		  	  	    }
	  		    	    else
	  		    	    {
	  		    	    	urlLink =link[0];
	  		    	    }
	  	                 
	  	                var questionBody = question;
	  	                var link =  questionBody.match(BS.urlRegex);                             
	  	                var qstUrl=  questionBody.replace(BS.urlRegex1, function(qstUrlw) {
	  	                    trueurl= qstUrlw;                                                                  
	  	                    return qstUrlw;
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
                                         question = question.replace(link[0],data.data.url);
                                         self.postQuestionToServer(question,streamId,questionAccess);
	  	                            }
  	                             });
  	                         }
  	                         else
  	                         {  
  	                        	 self.postQuestionToServer(question,streamId,questionAccess);
  	                         }
                 		 }  //doc
	  	                 else    //for docupload
	  	                 {     
	  	                	 self.postQuestionToServer(question,streamId,questionAccess);
	  	                 }
                     }
	                 //if link not present
	                 else
	                 {                
	                	 self.postQuestionToServer(question,streamId,questionAccess);
	                 }
              	 }
             }
			
			
			
			
			
			
			
////			eventName.preventDefault();
//			var question = $('#Q-area').val();
//			 
//			if(!question.match(/^[\s]*$/))
//			{
//				var streamId =  $('.sortable li.active').attr('id');
//				 
//				var questionAccess;
//		        var queAccess =  $('#private-to').attr('checked');
//		        var privateTo = $('#select-privateTo').text();
//		        
//			    if(queAccess == "checked")
//			    {
//			    	if(privateTo == "My School")
//			    	{
//			    		questionAccess = "PrivateToSchool";
//			    	}
//			    	else
//			    	{
//			    		questionAccess = "PrivateToClass";
//			    	}
//			    	
//			    }
//			    else
//			    {
//			    	questionAccess = "Public";
//			    }
//			    
//			    
//			    
//			    var pollOptions ='';
//			 
//			    for (var i=1; i<= BS.options ; i++)
//			    {
//			    	pollOptions+= $('#option'+i).val()+',' ;
//			    	$('#option'+i).val('');
//			    }
//			    pollOptions = pollOptions.substring(0, pollOptions.length - 1);
//			    
//			    //get poll options
//			    var info ;
//			    if(pollOptions == '')
//			    {
//			    	info = {
//			            	 questionBody : question,
//			            	 streamId : streamId,
//							 questionAccess :questionAccess,
//			             }
//			    }
//			    else
//			    {
//			    	info = {
//			            	 questionBody : question,
//			            	 streamId : streamId,
//							 questionAccess :questionAccess,
//							 pollsOptions: pollOptions
//			             }
//			    }
//	       	 
//
//				/* post profile page details */
//		         $.ajax({
//		             type: 'POST',
//		             data: info,
//		             url: BS.newQuestion,
//		             cache: false,
//		             dataType : "json",
//		             success: function(data){
//		            	 
//		            		 // remove question text and poll options after post
//			            	 $('#Q-area').val("");
//			            	 $('#pollArea').slideUp(700); 
//			            	 $('#uploded-file').hide();
//			            	 $('.embed-info').css("display","none");
//			            	 BS.options = 0;
//			            	 
//			            	 //check whether the question owner is logged user or not
//			            	 var owner = "";
//	     					 if(data.question.userId.id == BS.loggedUserId)
//	     					 {
//			     				owner = "true";
//	     					 }
//	     					 else
//	     					 {
//			     				owner = "";
//	     					 }
//			     			
//			            	 var source = $("#tpl-questions_with_polls").html();
//			            	 var template = Handlebars.compile(source);
//			            	 $('#all-questions').prepend(template({data:data,owner: owner ,rocks:data.question.rockers.length}));
//			            	 
//			            	 var pollCount = data.polls.length;
//			            	 
//			            	 //render each poll options and its polling percentage
//			            	 if(pollCount > 0)
//			            	 {
//			            		 var source = $("#tpl-question-poll-percentage").html();
//				            	 var template = Handlebars.compile(source);
//				            	 $('#'+data.question.id.id+'-poll-Option-area').html(template({data:data}));
//			            	 
//				            	 var pollIndex = 0;
//			            		 _.each(data.polls, function(poll) {
//			            			 pollIndex++;
//				            		 var pollSource = $("#tpl-question-poll").html();
//					            	 var pollTemplate = Handlebars.compile(pollSource);
//					            	 $('#'+data.question.id.id+'-pollOptions').prepend(pollTemplate({poll:poll, pollIndex:pollIndex ,question:data.question.id.id}));
//			            		 });
//			            		 
//			            		 /* creating pie charts */ 
////			            		 var values = [10,15,23];
////			            			
////			            		 donut[data.question.id.id] = new Donut(new Raphael(""+data.question.id.id+"-piechart", 200,200));
////			                	 donut[data.question.id.id].create(100, 100, 44, 55,100, values);
//			            		 
//			            	 }
//			            	 
//			            	
//			            	
//			            	 
//		             }
//		         });
//			}
	         
		},
		
		
		
		 /**
   	  * NEW THEME - POST question details to server 	
   	  */
		postQuestionToServer: function(question,streamId,questionAccess){
   		 
   		 	var self = this; 
            var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
            var trueurl='';
            
            
            
            var pollOptions ='';
		    for (var i=1; i<= BS.options ; i++)
		    {
		    	pollOptions+= $('#option'+i).val()+',' ;
		    	$('#option'+i).val('');
		    }
		    pollOptions = pollOptions.substring(0, pollOptions.length - 1);
		    
		    //get poll options
		    var info ;
		    if(pollOptions == '')
		    {
		    	info = {
		            	 questionBody : question,
		            	 streamId : streamId,
						 questionAccess :questionAccess,
		             }
		    }
		    else
		    {
		    	info = {
		            	 questionBody : question,
		            	 streamId : streamId,
						 questionAccess :questionAccess,
						 pollsOptions: pollOptions
		             }
		    }
            
		    
		    
            /* post question information to server */
	         $.ajax({
	             type: 'POST',
	             data: info,
	             url: BS.newQuestion,
	             cache: false,
	             dataType : "json",
	             success: function(data){
  				
           		 /* if status is failure (not join a class or school) then show a dialog box */      
  				     if(data.status == "Failure")
  				     {
  				    	 bootbox.alert("You need to add a stream first.");
  					
			         }
  				     else
  				     {
  				    	 
  				    	 // remove question text and poll options after post
		            	 $('#Q-area').val("");
		            	 $('#pollArea').slideUp(700); 
		            	 $('#uploded-file').hide();
		            	 $('.embed-info').css("display","none");
		            	 BS.options = 0;
		            	 
		            	 /* PUBNUB -- AUTO AJAX PUSH */ 
			    		 var streamId =  $('.sortable li.active').attr('id');
                         PUBNUB.publish({
                        	 channel : "question",
		                         message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,prifileImage : BS.profileImageUrl}
                         }) 
		            	 
                         //call a common function to display questions 
                         self.showQuestion(streamId,data,BS.profileImageUrl);

	                          
                         _.each(data, function(data) {
 			    	 		 showJanrainShareWidget(data.messageBody, 'View my Beamstream post', 'http://beamstream.com', data.messageBody);
	    	 	 		 });
                          
                          /* delete default embedly preview */
     			  		 $('div.selector').attr('display','none');
     			  		 $('div.selector').parents('form.ask-disccution').find('input[type="hidden"].preview_input').remove();
     			  		 $('div.selector').remove();
       				  	 $('#Q-area').val("");
	             }
   	 		 }
    		 });
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
            	
            	$('#uploded-file').html(f.name);
            	$('#uploded-file').show();
            	
            })(file);
            
            
             
            // read the  file as data URL
            reader.readAsDataURL(file);
          
        },
        
        
        /**
         * NEW THEME - Show comment text area on click
         */
        showCommentTextArea: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			// show / hide commet text area 
			if($('#'+questionId+'-addComments').is(":visible"))
			{
				
				$('#'+questionId+'-questionComment').val('');
				$('#'+questionId+'-addComments').slideToggle(300); 
				
				
			}
			else
			{
				$('#'+questionId+'-questionComment').val('');
				$('#'+questionId+'-addComments').slideToggle(200); 
				
			}
			
        },
        
        
        /**
		  * NEW THEME - Follow a question
		  */
        followQuestion: function(eventName){
			eventName.preventDefault();
			 
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			var text = $('#'+eventName.target.id).text();
		
			var self =this;
			$.ajax({
				type: 'POST',
		        url:BS.followQuestion,
		        data:{
		        	questionId:questionId
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
 
	            }
	        });
	    },
	    
	    
	    /**
	     * NEW THEME - Rocking questions
	     */
	    rockQuestion: function(eventName){
	    	
	    	eventName.preventDefault();
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			var self = this;
			
			$.ajax({
				type: 'POST',
	            url:BS.rockQuestion,
	            data:{
	            	questionId:questionId
	            },
	            dataType:"json",
	            success:function(data){
	            	 
	            	if($('#'+questionId+'-qstRockCount').hasClass('downrocks-message'))
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('downrocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('uprocks-message');
	            	}
	            	else
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('uprocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('downrocks-message');
	            	}
	            	
	            	// display the count in icon
	                $('#'+questionId+'-qstRockCount').find('span').html(data);
	                //auto push
	                var streamId =  $('.sortable li.active').attr('id');
					PUBNUB.publish({
						channel : "questionRock",
	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,questionId:questionId}
	                })
             	}
            });
        },
		
		/**
         * NEW THEME - select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').text();
        	
        	if($('#private-to').attr('checked')!= 'checked')
        	{
        		$('#select-privateTo').text("Public");
            	
        	}
        	else
        	{
        		$('#select-privateTo').text(streamName);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
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
	     * NEW THEME - get all questions of a stream
	     */
	    getAllQuestions :function(streamid,pageNo,limit){
	    	
	         var self = this;
	         
	         /* get all messages of a stream  */
			 $.ajax({
					type : 'POST',
					url : BS.getAllQuestionsOfAStream,
					data :{
						streamId :streamid,
						pageNo : pageNo,
						limit : limit
					},
					dataType : "json",
					success : function(data) {
						self.displayQuestions(data);
					}
			 });
	    	
	    },
	    
	    
	    /**
         * NEW THEME - Display messages 
         */
	    displayQuestions: function(data){
        	
//        	var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
//        	var trueurl='';
        	var self = this;
        	
			//hide page loader image
			if(!data.length)
				$('.page-loader').hide();
				   
			//display the messages
			_.each(data, function(data) {
				 
				var owner = "";
				if(data.question.userId.id == BS.loggedUserId)
				{
					owner = "true";
				}
				else
				{
					owner = "";
				}
				var questionType ='';
				var questionBody = data.question.questionBody;
                                                
				//var links =  msgBody.match(BS.urlRegex); 
                var qstUrl=  questionBody.replace(BS.urlRegex1, function(qstUrlw) {
                	trueurl= qstUrlw;    
                    return qstUrl;
                });
                
                //to get the extension of the uploaded file
//                var extension = (trueurl).match(pattern);  
//                
//               
//                if(data.questionType.name == "Text")
//                {    
//                    	 
//                     //to check whether the url is a google doc url or not
//                     if(questionBody.match(/^(https:\/\/docs.google.com\/)/)) 
//                     {
//                    	 questionType = "googleDocs";
//                     }
//                     else
//                     {
//                    	 questionType = "messageOnly";
                         var linkTag =  questionBody.replace(BS.urlRegex1, function(url) {
                               return '<a target="_blank" href="' + url + '">' + url + '</a>';
                         });
//                     }
//                }
//                else
//                {          
//                     // set first letter of extension in capital letter  
//                	  if(extension)
//                	  {
//                		  extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
//                			  return letter.toUpperCase();
//  	                	  }); 
//                	  }
//                }
//                
                var datVal =  formatDateVal(data.question.creationDate);
                
                
                
				var datas = {
					 	 "data" : data,
					 	 "datVal":datVal,
					 	 "owner" :owner,
					 	 "rocks" : data.question.rockers.length
				    }
               
                
					
//				if(questionType == "googleDocs")
//				{
//					var datas = {
//					    "datas" : data,
//	                    "datVal" :datVal,
//	                    "previewImage" : "images/google_docs_image.png",
//	                    "type" : "googleDoc",
//	                    "owner" :owner
//					}	
//					var source = $("#tpl-questions_with_polls").html();
//						
//				}
//				else if(questionType == "messageOnly")
//				{
					
					var source = $("#tpl-questions_with_polls").html();
						
//				}
//				else
//				{
//					if(data.questionType.name == "Image")
//					{
//						var source = $("#tpl-questions_with_polls").html();
//  						
//					}
//					else if(data.questionType.name == "Video")
//					{
//						var source = $("#tpl-questions_with_polls").html();
//  						
//					}
//					else
//					{
//						var previewImage = '';
//						var commenImage ="";
//						var type = "";
//						 
//						if(extension == 'Ppt')
//						{
//                            previewImage= "images/presentations_image.png";
//                            type = "ppt";
//                            
//						}
//						else if(extension == 'Doc')
//						{
//							previewImage= "images/docs_image.png";
//							type = "doc";
//							 	
//						}
//						else if(extension == 'Pdf')
//						{
//							 
//							previewImage= data.anyPreviewImageUrl;
//							type = "pdf";
//						}
//						else
//						{
//							previewImage= "images/textimage.png";
//							commenImage = "true";
//							type = "doc";
//							
//						}
//						
//						var datas = {
//							    "datas" : data,
//                                "datVal" :datVal,
//                                "previewImage" :previewImage,
//                                "extension" : extension,
//                                "commenImage" : commenImage,
//                                "type" : type,
//                                "owner" :owner
//				        }	
//					
//					    var source = $("#tpl-questions_with_polls").html();
//						
//				  }
//						
//				}
				
				var template = Handlebars.compile(source);
				$('#all-questions').append(template(datas));
				$('.drag-rectangle').tooltip();	
					
					
				 var pollCount = data.polls.length;
            	 
            	 //render each poll options and its polling percentage
            	 if(pollCount > 0)
            	 {
            		 $('#'+data.question.id.id+'-Answer').hide();
            		 var source = $("#tpl-question-poll-percentage").html();
	            	 var template = Handlebars.compile(source);
	            	 $('#'+data.question.id.id+'-poll-Option-area').html(template({data:data}));
            	 
	            	 var pollIndex = 0;
//	            	 var values = [];
            		 _.each(data.polls, function(poll) {
            			 pollIndex++;
//            			 values.push(pollIndex);
	            		 var pollSource = $("#tpl-question-poll").html();
		            	 var pollTemplate = Handlebars.compile(pollSource);
		            	 $('#'+data.question.id.id+'-pollOptions').append(pollTemplate({poll:poll, pollIndex:pollIndex,question:data.question.id.id}));
            		 });
            		 
            		 
            		 /* creating pie charts */ 
            		 var values = [20,15];
                	 donut[data.question.id.id] = new Donut(new Raphael(""+data.question.id.id+"-piechart", 200,200));
                	 donut[data.question.id.id].create(100, 100, 30, 55,100, values);
            	 }
            	 
            	
	            	 
					/* check whether the user is follwer of a message or not */
//			         $.ajax({
//			    			type : 'POST',
//			    			url : BS.isAFollower,
//			    			data : {
//			    				 questionId : data.question.id.id
//			    			},
//			    			dataType : "json",
//			    			success : function(status) {
//			    				 if(status == "true")
//			    					 $('#'+data.question.id.id+'-follow').text("Unfollow");
//			    			}
//			    	 });
			         
			         
			         /* make a call to check whether the logged user is already rock this message*/ 
//					 $.ajax({
//			             type: 'POST',
//			             url:BS.isARockerOfQuestion,
//			             data:{
//			            	 questionId:data.question.id.id
//			             },
//			             dataType:"json",
//			             success:function(result){
//			            	 if(result == "true")
//			            	 {
//			            		 $('#'+data.question.id.id+'-qstRockCount').removeClass('uprocks-message');
//			            		 $('#'+data.question.id.id+'-qstRockCount').addClass('downrocks-message');
//			            		            		 
//			            	 }
//			            	 else
//			            	 {
//			            		 $('#'+data.question.id.id+'-qstRockCount').removeClass('downrocks-message');
//			            		 $('#'+data.question.id.id+'-qstRockCount').addClass('uprocks-message');			 
//			            	 }
//			            	 
//			             }
//			          });
						 
					 /* get profile images for messages */
			         $.ajax({
			    			type : 'POST',
			    			url : BS.profileImage,
			    			data : {
			    				 userId :  data.question.userId.id
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
			    				$('img#'+data.question.id.id+'-img').attr("src", imgUrl);
			    			}
			    	 });
				           
					 if(linkTag)
						 $('p#'+data.question.id.id+'-id').html(linkTag);
						 
                 var url=data.question.questionBody;
//                 if(data.questionType.name == "Text"){   
                                     
                     if(!url.match(/^(https:\/\/docs.google.com\/)/)) {
                         // embedly
                         $('p#'+data.question.id.id+'-id').embedly({
                                 maxWidth: 200,
                                 msg : 'https://assets0.assembla.com/images/assembla-logo-home.png?1352833813',
	                             wmode: 'transparent',
	                             method: 'after',
	                             key:'4d205b6a796b11e1871a4040d3dc5c07'
                         });
                      }
//
//                 }
//                 else       
//                 {
//                    	 
//                    	 if(data.questionType.name == "Image")
//                    	 {
//                    		   
//
//
//                    	 }
//                    	 else if(data.questionType.name == "Video")
//                    	 {
//                    	 }
//                    	 else
//                    	 {
//                    	 }
//                    	 
//                    	 
//                    	 /* for video popups */
//                         $("area[rel^='prettyPhoto']").prettyPhoto();
//      					 $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
//      					 $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
//      			
//                   }
                   
						 
				   self.showAllComments(data.question.userId.id);
		      });
		
        },
        
        
        /**
		  * NEW THEME - show question rockers list 
		  */
		showRockersList: function(eventName){
			 
			eventName.preventDefault();
	        	
	       	var element = eventName.target.parentElement;
	       	var parentUl = $(eventName.target).parent('ul');
			$(parentUl).find('a.active').removeClass('active');
			
			var questionId =$(element).parents('div.follow-container').attr('id');
		    if($('#'+questionId+'-questionRockers').is(':visible'))
		    {
		    	 
		    	$('#'+questionId+'-questionRockers').slideUp(600); 
		    	$(eventName.target).removeClass('active');
		    }
		    else
		    {
		    	$.ajax({
		    		type: 'POST',
		    		url:BS.giveMeRockersOfQuestion,
		    		data:{
		    			questionId:questionId
		    		},
		    		dataType:"json",
		    		success:function(data){
		    			$('#'+questionId+'-questionRockers').html("");
		    			// prepair rockers list
		    			_.each(data, function(rocker) {
					 
		    				var questionRockers = $("#tpl-question-rockers").html();
		    				var questionRockersTemplate = Handlebars.compile(questionRockers);
		    				$('#'+questionId+'-questionRockers').append(questionRockersTemplate({rocker:rocker}));
		    			});
		    			
		    			$(eventName.target).addClass('active');
           	 
		            	$('#'+questionId+'-allComments').slideUp();
		            	$('#'+questionId+'-newCommentList').slideUp();
           	
		            	$('#'+questionId+'-questionRockers').slideDown(600); 

 
	             	}
	            });
		    }
				
		},
        
        /**
	     * NEW THEME - fetch and show all comments of a question
	     */
	    showAllComments: function(questionId){
	    	
	    	var count = 0;
			var parentQst = questionId;

			$.ajax({
				type: 'POST',
	            url: BS.allComments,
	            data:{
	            	questionId:parentQst
	            },
	            dataType:"json",
	            success:function(datas){
	            	 
	            	var cmtCount  = datas.length;
	            	 
	            	_.each(datas, function(data) {
	            		 
		  			    var comments = $("#tpl-question-comment").html();
					    var commentsTemplate = Handlebars.compile(comments);
					    $('#'+parentQst+'-allComments').prepend(commentsTemplate(data));
							 
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
	        	    	$('#'+parentQst+'-totalComment').html(cmtCount);
	        	    	$('#'+parentQst+'-allComments').hide();

	                }
	            }
			});
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
	     * NEW THEME - Functio for follow user
	     */
	    followUser: function(eventName){
	    	
	    	eventName.preventDefault();
	    	var userId = eventName.target.id;
	    	
	    	var text = $(eventName.target).text();
	    	
	    	
	    	$.ajax({
 				type: 'POST',
 		        url:BS.followUser,
 		        data:{
 		        	userId:userId
 		        },
 		        dataType:"json",
 		        success:function(data){
 		        	 
 		        	//set display
 		        	if(text == "Unfollow")
 		    		{
 		        		$('a.follow-user').each(function() {
 		        			 
 		        			if($(this).attr('id') == userId)
 		        			{
 		        				$(this).text("Follow");
 		        			}
 		        			
 		        		});
 		        		
 		    		}
 		        	else
 		        	{
 		        		$('a.follow-user').each(function() {
		        			 
 		        			if($(this).attr('id') == userId)
 		        			{
 		        				$(this).text("Unfollow");
 		        			}
 		        			
 		        		});
 		        	}
 		        	 
 
	            }
	        });
	    	
	    },

        /**
         * NEW THEME -show  Upload files option when we select category
         */
   		 uploadFiles: function(eventName){
   			 eventName.preventDefault();
   			 $('#upload-files-area').click();
   		 },
   	 
		/**
		 * click to view areas for adding poll options
		 */
		addPollOptionsArea: function(eventName){
			eventName.preventDefault();
			BS.options = 2;
			$('#pollArea').slideToggle(700); 
		},
		
		/**
		 * function  to add more poll options
		 */
		addMorePollOptions : function(eventName){
			
			eventName.preventDefault();
			BS.options++;
			if(BS.options == 3)
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add 3rd Poll Option" name="Add Option"> </li>';
			else
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add '+BS.options+'th Poll Option" name="Add Option"> </li>';

			var parent = $('#add_more_options').parents('li');
			$('.answer li').last().after(options);
		 },
			
		/**
         *  NEW THEME - Sort questions
         */
		sortQuestions: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	$('#sortBy-select').text($(eventName.target).text());

        },
        
        /**
         * NEW THEME - sort questions within a period 
         */
        sortQuestionsWithinAPeriod: function(eventName){
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
        
        /**
         *  NEW THEME - post new comments on enter key press
         */
        addQuestionComments: function(eventName){
        	
        	var element = eventName.target.parentElement;
        	var parent =$(element).parents('div.follow-container').attr('id');
        	var totalComments =  $('#'+parent+'-totalComment').text();
        	var commentText = $('#'+parent+'-questionComment').val();
        	
            
        	 
        	var self =this;
        
        	/* post comments on enter key press */
        	if(eventName.which == 13) {
        		
        		eventName.preventDefault(); 
   			 	
   		 	  if(!commentText.match(/^[\s]*$/))
   		 	  {
   			 	/* post comments information */
   		        $.ajax({
   		        	type : 'POST',
   		  			url : BS.newComment,
   		  			data : {
   		  				questionId : parent,
   		  				comment : commentText
   		  			},
   		  			dataType : "json",
   				  	success : function(datas) { 
   				  				 
   				  		$('#'+parent+'-questionComment').val('');
   				  	    $('#'+parent+'-addComments').slideUp(200); 
   				  		
   				  		_.each(datas, function(data) {
   				  			totalComments++; 
   				  			var comments = $("#tpl-question-comment").html();
   							var commentsTemplate = Handlebars.compile(comments);
   							 
   							$('#'+parent+'-allComments').prepend(commentsTemplate(data));
   							$('#'+data.id.id+'-image').attr("src" ,BS.profileImageUrl );
   							 
   							if(!$('#'+parent+'-allComments').is(':visible'))
   							{  
   								
   								$('#'+parent+'-questionRockers').slideUp(1);
   								$('#'+parent+'-newCommentList').slideDown(1);

   								var newComments = $("#tpl-question-newcomment").html();
   								var newCmtTemplate = Handlebars.compile(newComments);
   								$('#'+parent+'-newCommentList').prepend(newCmtTemplate(data));
   								$('#'+data.id.id+'-newCmtImage').attr("src" ,BS.profileImageUrl );
   								
   							}
   							$('#'+parent+'-show-hide').text("Hide All");
   							 
   							$('#'+parent+'-totalComment').text(totalComments);
   							/* auto push */
   		  					var streamId = $('.sortable li.active').attr('id');
   			                PUBNUB.publish({
   			                	channel : "questionComment",
		                        message : { pagePushUid: self.pagePushUid ,data:data,parent:parent,cmtCount:totalComments,prifileImage : BS.profileImageUrl}
   			                })
   							 
			  		    });

			  	    }
	  		    });
   		 	  }
	        }
        },
        
        
        /**
         * NEW THEME-  Show / hide all comments of a message
         */
        showAllCommentList: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parent('ul');
        	
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			$(parentUl).find('a.active').removeClass('active');
			
			if($('#'+questionId+'-allComments').is(":visible"))
			{
				$(eventName.target).removeClass('active');
				$('#'+questionId+'-questionRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideUp(600); 
				$('#'+questionId+'-show-hide').text("Show All");
			}
			else
			{
				$(eventName.target).addClass('active');
				$('#'+questionId+'-questionRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideDown(600); 
				$('#'+questionId+'-show-hide').text("Hide All");
			}
        },
	 
        /**
         * NEW THEME - show / hide all comments ..
         */
        showAllList: function(eventName){
        	eventName.preventDefault();
        	
        	var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parents('ul');
        	$(parentUl).find('a.active').removeClass('active');
			var questionId =$(element).parents('div.follow-container').attr('id');
			if($('#'+questionId+'-show-hide').text() == "Hide All")
            {
				$('#'+questionId+'-questionRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideUp(600); 
				$(eventName.target).removeClass('active');
				$(eventName.target).text("Show All");
            }
			else
			{
				$('#'+questionId+'-questionRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideDown(600);
				$(eventName.target).addClass('active');
				$(eventName.target).text("Hide All");
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
         * NEW THEME - Rock comments
         */
        rockComment: function(eventName){
        	
        	eventName.preventDefault();
        	
        	var commentId = $(eventName.target).parents('div.answer-description').attr('id');
        	var questionId = $(eventName.target).parents('div.follow-container').attr('id');
        	var self = this;
        	
        	/* Rock comment */
    		$.ajax({
    			type: 'POST',
                url:BS.rockingTheComment,
                data:{
                	commentId:commentId,
                	questionId : questionId
                },
                dataType:"json",
                success:function(data){
                	 
                	// display the count in icon
                	$('#'+commentId+'-rockCount').html(data);
                	$('#'+commentId+'-nrockCount').html(data);
                	
                	/*auto push */
    				var streamId = $('.sortable li.active').attr('id');
    				PUBNUB.publish({
                          channel : "questionCommentRock",
                          message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:data,commentId:commentId }
                    })
//     
                }
            });
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
 				 channel : "question",
 				 restore : false,
 				 callback : function(message) {
 	
 					 var streamId = $('.sortable li.active').attr('id');
 					 if (message.pagePushUid != self.pagePushUid)
 					 { 
 						 if(message.streamId==streamId)
	       		 		 {
 							 if(!document.getElementById(message.data.question.id.id))
 							 {
 								 self.showQuestion(message.streamId,message.data,message.prifileImage);
		                          
 							 }
	       		 		 }
 			 
 					 }
			 	}
	 	   })
 	    
 		 	   
 	    
	 	   /* auto push functionality for comments */
    
	 	   PUBNUB.subscribe({

	 		   channel : "questionComment",
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
			    	      
	 					   
	 					   
	 					   var comments = $("#tpl-question-comment").html();
	 					   var commentsTemplate = Handlebars.compile(comments);
 							 
 							$('#'+parent+'-allComments').prepend(commentsTemplate(data));
 							$('#'+data.id.id+'-image').attr("src" ,prifileImage );
 							 
 							if(!$('#'+parent+'-allComments').is(':visible'))
 							{  
 								
 								$('#'+parent+'-questionRockers').slideUp(1);
 								$('#'+parent+'-newCommentList').slideDown(1);

 								var newComments = $("#tpl-question-newcomment").html();
 								var newCmtTemplate = Handlebars.compile(newComments);
 								$('#'+parent+'-newCommentList').prepend(newCmtTemplate(data));
 								$('#'+data.id.id+'-newCmtImage').attr("src" ,prifileImage );
 								
 							}
 							$('#'+parent+'-show-hide').text("Hide All");
 							 
 							$('#'+parent+'-totalComment').text(totalComments);

 				   	   }
		   		   }
	   		   }

   		   })
 	    
 		       /* for message Rocks */
  	   		   PUBNUB.subscribe({
 		
  	   			   channel : "questionRock",
  	   			   restore : false,
  	   			   callback : function(message) {
  	   					   $('#'+message.questionId+'-qstRockCount').find('span').html(message.data);
 		   		   }
 	   		   })
 	    
 	   		   /* for Comment Rocks */
 	   		   PUBNUB.subscribe({
 	
 	   			   channel : "questionCommentRock",
 	   			   restore : false,
 	   			   callback : function(message) {
 	   				   if(message.pagePushUid != self.pagePushUid)
 	   				   {   	  
 	   					   $('#'+message.commentId+'-rockCount').html(message.data);
 	   					   $('#'+message.commentId+'-nrockCount').html(message.data);
 	   				   }
 	   			   }
 	   		   })
  		},
  		
  		
  		/**
  		 * common function for dispaying question after post  (for / auto push ) 
  		 */
  		showQuestion : function(streamId,data,prifileImage){
		
  			var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
  			var trueurl='';

  			//check whether the question owner is logged user or not
  			var owner = "";
  			if(data.question.userId.id == BS.loggedUserId)
  			{
  				owner = "true";
  			}
  			else
  			{
  				owner = "";
  			}
				 
  			 
  			var questionBody = data.question.questionBody;
			var qstUrl=  questionBody.replace(BS.urlRegex1, function(qstUrlw) {
           	 	trueurl= qstUrlw;                                                                  
           	 	return qstUrlw;
			});
        
			//to get the extension of the uploaded file
			var extension = (trueurl).match(pattern);  
            
            // @ TODO 
            //to check whether the url is a google doc url or not
//            if(data.questioType.name == "Text")                          
//            {	
//           	 if(questionBody.match(/^(https:\/\/docs.google.com\/)/)) 
//                {   
//           		questioType = "googleDocs";
//
//                }
//           	 else
//           	 {    
//           		 questioType = "messageOnly";
           		 var linkTag =  questionBody.replace(BS.urlRegex1, function(url) {
           			 return '<a target="_blank" href="' + url + '">' + url + '</a>';
           		 });
//                                 
//           	 }
//            }                                                      
//            else
//            {         
//                // url has extension then set first letter of extension in capital letter  
//	                	 extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
//	                		 return letter.toUpperCase();
//	                	 });
//
//   		 }
//				  
//            var datas = {
//           		 "datas" : data,
//            }	
//             
//            // set a format style to date
////            BS.filesMediaView = new BS.FilesMediaView(); 
//            var datVal = formatDateVal(data.timeCreated);
//                    
//            // if message conatains googledoc url
//            if(questionType == "googleDocs")
//			 {
//           	 
//           	 var datas = {
//           			 "datas" : data,
//           			 "datVal" :datVal,
//           			 "previewImage" : "images/google_docs_image.png",
//           			 "type" : "googleDoc"
//					 }	
//				 var source = $("#tpl-messages_with_docs").html();
//		  						
//			 }
//            // if message conatains messages only without any uploaded files
//			 else if(messageType == "messageOnly")
//			 {
//				 var source = $("#tpl-discussion-messages").html();
//			 }
//            // if message conatains  uploaded files
//			 else
//			 {
//				 if(data.messageType.name == "Image")
//				 {
//					 var source = $("#tpl-messages_with_images").html();
//				 }
//				 else if(data.messageType.name == "Video")
//				 {
//					 var source = $("#tpl-messages_with_images").html();
//				 }
//				 else
//				 {
//					 var previewImage = '';
//					 var commenImage ="";
//					 var type = "";
//					 
//					 /* check its extensions and set corresponding preview icon images */
//					 if(extension == 'Ppt')
//					 {
//						 previewImage= "images/presentations_image.png";
//						 type = "ppt";
//					 }
//					 else if(extension == 'Doc')
//					 {
//						 previewImage= "images/docs_image.png";
//						 type = "doc";
//					 }
//					 else if(extension == 'Pdf')
//					 {
//						 previewImage= data.anyPreviewImageUrl;
//						 type = "pdf";
//					 }
//					 else
//					 {
//						 previewImage= "images/textimage.png";
//						 commenImage = "true";
//						 type = "doc";
//				 	 }
//						
//					 var datas = {
//							 "datas" : data,
//							 "datVal" :datVal,
//							 "previewImage" :previewImage,
//							 "extension" : extension,
//							 "commenImage" : commenImage,
//							 "type" : type
//		        	 }	
//					
//				     var source = $("#tpl-messages_with_docs").html();
//						 
//				 }
//								
//			 }
				 
				 
        	 var source = $("#tpl-questions_with_polls").html();
        	 var template = Handlebars.compile(source);
        	 $('#all-questions').prepend(template({data:data,owner: owner ,rocks:data.question.rockers.length}));
        	 $('.drag-rectangle').tooltip();	
        	 var pollCount = data.polls.length;
        	 
        	 //render each poll options and its polling percentage
        	 if(pollCount > 0)
        	 {
        		 $('#'+data.question.id.id+'-Answer').hide();
        		 var source = $("#tpl-question-poll-percentage").html();
            	 var template = Handlebars.compile(source);
            	 $('#'+data.question.id.id+'-poll-Option-area').html(template({data:data}));
//            	 var values = [];
            	 var pollIndex = 0;
        		 _.each(data.polls, function(poll) {
        			 pollIndex++;
//        			 values.push(pollIndex);
            		 var pollSource = $("#tpl-question-poll").html();
	            	 var pollTemplate = Handlebars.compile(pollSource);
	            	 $('#'+data.question.id.id+'-pollOptions').append(pollTemplate({poll:poll, pollIndex:pollIndex ,question:data.question.id.id}));
        		 });
        		 
        		 /* creating pie charts */ 
        		 var values = [50,50];
        		 donut[data.question.id.id] = new Donut(new Raphael(""+data.question.id.id+"-piechart", 200,200));
            	 donut[data.question.id.id].create(100, 100, 30, 55,100, values);
        		 
        	 }
        	 
        	 //get profile image of logged user
        	 $('img#'+data.question.id.id+'-img').attr("src", prifileImage);
           
        	 if(linkTag)
				 $('p#'+data.question.id.id+'-id').html(linkTag);
		
			 var url=data.question.questionBody;				
//			 if(data.messageType.name == "Text")
//			 {  
//				 //to check the extension of the url                                            
                  if(!url.match(/^(https:\/\/docs.google.com\/)/)) 
                  {	
                 	 // embedly
                 	 $('p#'+data.question.id.id+'-id').embedly({
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
//          	 }                                          
//			 else      //insert value to hidden field
//			 {
//             	 $('input#'+data.id.id+'-url').val(msgUrl);  
//			 } 
                  
	   
  		},
  		
  		
  		/**
  	    * delete a question
 	    */
  		deleteQuestion :function(eventName){
  			 eventName.preventDefault();
  			 var questionId = eventName.target.id;
  			 var ownerId = $('div#'+questionId).attr('name');
  			 
  			 if(localStorage["loggedUserInfo"] == ownerId)
  			 {
 	 			 bootbox.dialog("Are you sure you want to delete this question?", [{
 	
 	 				"label" : "DELETE",
 	 				"class" : "btn-primary",
 	 				"callback": function() {
 	 					
 	 					 // delete particular message
 			    		 $.ajax({
 			                 type: 'POST',
 			                 url: BS.deleteQuestion,
 			                 data:{
 			                	questionId :questionId
 			                 },
 			                 dataType:"json",
 			                 success:function(data){
 			                	 if(data.status == "Success")
 			                	 {
 			                		 
 			                		 $('div#'+questionId).remove();
 						    		  
 			                	 }
 			                	 else
 			                	 {
 			                		 bootbox.alert("You're Not Authorised To Delete This Question");
 			                	 }
 			                	 
 			                 }
 			              });
 	 				}
 	
 	 			 }, 
 	 			 {
 				 	"label" : "CANCEL",
 				 	"class" : "btn-primary",
 	 				"callback": function() {
 	 					console.log("ok");
 	 				}
 	 			 }]);
  			 }
  			 else
  			 {
  				bootbox.alert("You're Not Authorised To Delete This Question");
  			 }
  			 
  		 },
	  
	});
