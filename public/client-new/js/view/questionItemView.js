/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 29/April/2013
* Description           : View for Question item on discussion page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
		'model/question',
		'model/comment',
		'model/answer',
		'model/user',
		'text!templates/questionMessage.tpl',
		 'text!templates/questionComment.tpl',
		 'text!templates/questionAnswer.tpl',
	        'text!templates/allmessages.tpl',
	        'text!templates/allAnswers.tpl',
		 'text!templates/messageRocker.tpl',
        ],function(FormView,QuestionModel, CommentModel,AnswerModel,UserModel, QuestionMessage, QuestionComment,QuestionAnswer,Allmessages,AllAnswers,MessageRocker ){
	
	var QuestionItemView;
	QuestionItemView = FormView.extend({
		objName: 'QuestionItemView',
		events:{
			'click .add-comment' : 'showCommentTextArea',
			'click .add-answer' : 'showAnswerTextArea',
			'click #question-comment-post-button' : 'addQuestionComments',
			'click #question-answer-post-button' : 'addQuestionAnswer',	
			'click .rocks-question': 'rockQuestion',
			'click .follow-question': 'followQuestion',
			'click .rock-comments': 'rockComment',
			'click .rocks-small a': 'rockComment',
	        'click .rock-answers': 'rockAnswer',
	        'click .rocks-small-answer a': 'rockAnswer',
		 	'click .follow-user' : 'followUser',
		 	'click .show-all-comments' : 'showAllCommentList',
         	'click .show-all-Answers' : 'showAllAnswerList',
		 	'click .who-rocked-it' : 'showRockersList',
		 	'click .show-all' : 'showAllList',
		 	'click .delete_post': 'deleteQuestion',
		 	'click .delete_comment' : 'deleteComment',
		 	'click .delete_answer' : 'deleteAnswer',
		 	'click .regular-radio': 'polling',
			 
		},
		
		onAfterInit: function(){	
			this.data.reset();
			this.urlRegex2 =  /^((http|https|ftp):\/\/)/,
            this.urlRegex1 = /(https?:\/\/[^\s]+)/g,
            this.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i ;
			
        },
        
        /**
         * render the message item
         */
        render: function(){
        	
        	var self = this;
            var trueurl='';
            var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;

            // get the model attributes
        	var model = this.model.attributes;
        	
    		
			var contentType ='';
			var questionType ='';
			var questionBody = model.question.questionBody;
            
			/* get url from the message text */
            var qstUrl=  questionBody.replace(self.urlRegex1, function(qstUrlw) {
            	trueurl= qstUrlw;    
                return qstUrlw;
            });

            //to get the extension of the uploaded file 
            if(trueurl)
            	var extension = (trueurl).match(pattern); 


            /* case : normal message without uploaded files */
            if(model.question.questionType.name == "Text")
            {    
                	 
                 //to check whether the url is a google doc url or not
                 if(questionBody.match(/^(https:\/\/docs.google.com\/)/)) 
                 {

                	 contentType = "googleDoc";
                 }
                 else
                 {
                	 contentType = "questionOnly";
                     var linkTag =  questionBody.replace(self.urlRegex1, function(url) {
                           return '<a target="_blank" href="' + url + '">' + url + '</a>';
                     });
                 }
            }
            else
            {         

        		if(questionBody.match(/^(https:\/\/docs.google.com\/)/)) 
                 {
                	 contentType = "docs";

                 } 	
                 // set first letter of extension in capital letter  
            	  if(extension)
            	  {
            		  extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
            			  return letter.toUpperCase();
                	  }); 
            	  }
            }
            // customize the date format
            var datVal =  formatDateVal(model.question.creationDate);
            
			var datas = {
			 	 "data" : model,
			 	 "datVal":datVal,
			 	 "contentType" : contentType,
			 	 "loggedUserId" :localStorage["loggedUserId"],
			 	 
		    }

		    /* generate data depends on its type */
			if(contentType == "docs")
			{
				var datas = {
				    "data" : model,
                    "datVal" :datVal,
                    "previewImage" : "/beamstream-new/images/google_docs_image.png",
                    "commenImage" : "true",
                    "type" : "googleDoc",
                    "contentType" : contentType,
                    "loggedUserId" :localStorage["loggedUserId"],
                	
				}	
			}
			else if(contentType == "questionOnly")
			{
				var datas = {
					 	 "data" : model,
					 	 "datVal":datVal,
					 	 "type" : contentType,
					 	 "contentType" : contentType,
					 	 "loggedUserId" :localStorage["loggedUserId"],
			    }
			}
			else
			{
				/* for images/videos  */
				if(model.question.questionType.name == "Image" || model.question.questionType.name == "Video" )
				{
					var datas = {
					 	 "data" : model,
					 	 "datVal":datVal,
					 	 "contentType" : "media",
					 	 "loggedUserId" :localStorage["loggedUserId"],
				    }  						
				}
				else /* for other types of docs , pdf , ppt etc.. */ 
				{
					var previewImage = '';
					var commenImage ="";
					var type = "";
					 
					if(extension == 'Ppt')
					{
                        previewImage= "/beamstream-new/images/presentations_image.png";
                        type = "ppt";
                        
					}
					else if(extension == 'Doc')
					{
						previewImage= "/beamstream-new/images/docs_image.png";
						type = "doc";
						
					}
					else if(extension == 'Pdf')
					{
						previewImage= model.question.anyPreviewImageUrl;
						type = "pdf";
					}
					else
					{
						previewImage= "/beamstream-new/images/textimage.png";
						commenImage = "true";
						type = "doc";
						
					}
					
					var datas = {
						    "data" : model,
                            "datVal" :datVal,
                            "previewImage" :previewImage,
                            "extension" : extension,
                            "commenImage" : commenImage,
                            "type" : type,
                            "contentType" : "docs",
                            "loggedUserId" :localStorage["loggedUserId"],
                            
			        }	
			  	}
					
			}

			// render the template
    		compiledTemplate = Handlebars.compile(QuestionMessage);
    		$(this.el).html(compiledTemplate(datas));

    		/* set the link style for the lisks in message */
        	if(linkTag)
            	$('p#'+model.question.id.id+'-id').html(linkTag);
        		


            // embedly
    		$('p#'+model.question.id.id+'-id').embedly({
    		 	maxWidth: 200,
    		 	wmode: 'transparent',
    		 	method: 'after',
    		 	key:'4d205b6a796b11e1871a4040d3dc5c07'
		 	 });

    		$('.drag-rectangle').tooltip();
    		
    		/* pretty photo functionality for video /image popups */
            $("area[rel^='prettyPhoto']").prettyPhoto();
			$(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({
				animation_speed:'normal',
				theme:'light_square',
				slideshow:3000, 
				autoplay_slideshow: true
			});
			$(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({
				animation_speed:'fast',
				slideshow:10000,
				hideflash: true
			});
			$('.commentList').hide();

			
    		return this;






//          	var model = this.model.attributes;
// 			var questionType ='';
// 			var questionBody = model.question.questionBody;
                                            
// 			//var links =  msgBody.match(BS.urlRegex); 
//             var qstUrl=  questionBody.replace(this.urlRegex1, function(qstUrlw) {
//             	trueurl= qstUrlw;    
//                 return qstUrl;
//             });


                
//                 //to get the extension of the uploaded file
// //                var extension = (trueurl).match(pattern);  
// //                
// //               
// //                if(data.questionType.name == "Text")
// //                {    
// //                    	 
// //                     //to check whether the url is a google doc url or not
// //                     if(questionBody.match(/^(https:\/\/docs.google.com\/)/)) 
// //                     {
// //                    	 questionType = "googleDocs";
// //                     }
// //                     else
// //                     {
// //                    	 questionType = "messageOnly";
//                          var linkTag =  questionBody.replace(this.urlRegex1, function(url) {
//                                return '<a target="_blank" href="' + url + '">' + url + '</a>';
//                          });
// //                     }
// //                }
// //                else
// //                {          
// //                     // set first letter of extension in capital letter  
// //                	  if(extension)
// //                	  {
// //                		  extension = extension[1].toLowerCase().replace(/\b[a-z]/g, function(letter) {
// //                			  return letter.toUpperCase();
// //  	                	  }); 
// //                	  }
// //                }
// //                
//                 var datVal =  formatDateVal(model.question.creationDate);
                
// 				var datas = {
// 					 	 "data" : model,
// 					 	 "datVal":datVal,
// 					 	 "rocks" : model.question.rockers.length,

// 				    }
               
				
// 				// render the template
//         		compiledTemplate = Handlebars.compile(QuestionMessage);
//         		$(this.el).html(compiledTemplate(datas));

//         		$('.drag-rectangle').tooltip();

//         		$('.commentList').hide();
			
//     		return this;
        },
        


        /**
         * Show comment text area on click
         */
        showCommentTextArea: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			
			// show / hide commet text area 
			if($('#'+questionId+'-addComments').is(":visible"))
			{
				$('#'+questionId+'-msgComment').val('');
				$('#'+questionId+'-addComments').slideToggle(300);
				$('#'+questionId+'-addComments > textarea').focus();
			}
			else
			{
				$('#'+questionId+'-msgComment').val('');
				
				$('#'+questionId+'-addComments').slideToggle(200); 
				$('#'+questionId+'-addComments > textarea').focus();
			}
			
        },

               
        	
         /**
         *   post new comments on enter key press
         */
        addQuestionComments: function(eventName){
        	
        	var element = eventName.target.parentElement;
        	var parent =$(element).parents('div.follow-container').attr('id');
        	var totalComments =  $('#'+parent+'-totalComment').text();
        	var commentText = $('#'+parent+'-questionComment').val();
        	var self =this;
        
        	/* post comments on enter key press */
        		
	    		eventName.preventDefault(); 
	   			 	
   			 	if(!commentText.match(/^[\s]*$/))
   			 	{
//   			 		this.data.url = "/newComment";
   			 		
   			 		    /* set the Comment model values and posted to server */
   			 			var comment = new CommentModel();
   			 		    var streamId =  $('.sortable li.active').attr('id');
   			 			comment.urlRoot = "/newComment";
   			 			comment.save({comment : commentText, questionId :parent, stream_id: streamId},{
	   			    	success : function(model, response) {
   			 				
	   			    		$('#'+parent+'-questionComment').val('');
	   							
   			    			// shows the posted comment
   			    		    self.showPostedComment(response,parent,totalComments);
   			    		 /* pubnum auto push */
   							PUBNUB.publish({
   			                	channel : "questioncommentMainStream",
		                        message : { pagePushUid: self.pagePushUid ,data:response,parent:parent,cmtCount:totalComments ,profileImage : localStorage["loggedUserProfileUrl"]}
   			                })
   			                PUBNUB.publish({
   			                	channel : "questioncommentSideStream",
		                        message : { pagePushUid: self.pagePushUid ,data:response,parent:parent,cmtCount:totalComments ,profileImage : localStorage["loggedUserProfileUrl"]}
   			                })
	   			    	},
	   			    	error : function(model, response) {
	   			    		
	   			    	}
	
	   			    });

   			 	}
   			 	
        },
        
	/**
         * show posted comment
         */
        showPostedComment: function(response,parent,totalComments){
	  		$('#'+parent+'-addComments').slideUp(200);
	  		
	  			
		    /* display the posted comment  */
    		var compiledTemplate = Handlebars.compile(QuestionComment);
    		$('#'+parent+'-allComments').prepend(compiledTemplate({data:response,profileImage:localStorage["loggedUserProfileUrl"]}));
    		
    		
    		if($('#'+parent+'-allAnswers').is(':visible'))
				{
					$('#'+parent+'-allAnswers').hide();
				}
    			if($('#'+parent+'-newAnswerList').is(':visible'))
				{
					$('#'+parent+'-newAnswerList').hide();
				}
    			
    		if(!$('#'+parent+'-allComments').is(':visible'))
			{  
    			
				
				$('#'+parent+'-msgRockers').slideUp(1);
				$('#'+parent+'-newCommentList').slideDown(1);
				$('#'+parent+'-newCommentList').prepend(compiledTemplate({data:response,profileImage:localStorage["loggedUserProfileUrl"]}));
				
			}
    		totalComments++; 
    		$('#'+parent+'-show-hide').text("Hide All");
			$('#'+parent+'-totalComment').text(totalComments);
        },
        
    /**
         * Show / hide all comments of a question
         */
        showAllCommentList: function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parent('ul');
			var questionId =$(element).parents('div.follow-container').attr('id');
			$(parentUl).find('a.active').removeClass('active');
					/* Get all the comments of an answer */
					 $.ajax({
						 type : 'POST',
						 url : "/getAllComments",
						 data : JSON.stringify({ "questionId" : questionId}),
						 contentType: 'application/json; charset=utf-8',
						 	success : function(data) {
	   							if($('#'+questionId+'-allComments').is(":visible"))
	   								{
	   									$(eventName.target).removeClass('active');
	   									$('#'+questionId+'-msgRockers').slideUp(1);
										$('#'+questionId+'-newCommentList').html('');
										$('#'+questionId+'-allComments').empty(); 
										$('#'+questionId+'-allComments').slideUp(600); 
										$('#'+questionId+'-show-hide').text("Show All");
	   								}
	   							else
	   								{
	   									if($('#'+questionId+'-allAnswers').is(':visible'))
	   										{
	   											$('#'+questionId+'-allAnswers').hide();
	   										}
	   									if($('#'+questionId+'-newAnswerList').is(':visible'))
	   									{
	   									$('#'+questionId+'-newAnswerList').hide();
	   									}
	   												$(eventName.target).addClass('active');
	   												$('#'+questionId+'-msgRockers').slideUp(1);
	   												$('#'+questionId+'-newCommentList').html('');
	   												$('#'+questionId+'-allComments').empty(); 
	   												$.each(data,function(index,value){
	   													compiledTemplate = Handlebars.compile(Allmessages);
	   													$('#'+questionId+'-allComments').prepend(compiledTemplate({value:value,profileImage:localStorage["loggedUserProfileUrl"]}));
	   													$('#'+questionId+'-allComments').slideDown(600); 
	   													$('#'+questionId+'-show-hide').text("Hide All");
	   												})
	   								}			 		
	   							}
					 	})
        	},
	 	
	   /**
         * Show answer text area on click
         */
        showAnswerTextArea:function(eventName){
        	eventName.preventDefault();
        	var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
					
			// show / hide answer text area 
			if($('#'+questionId+'-addAnswer').is(":visible"))
			{
				$('#'+questionId+'-msgComment').val('');
				$('#'+questionId+'-addAnswer').slideToggle(300);
				$('#'+questionId+'-addAnswer > textarea').focus();
			}
			else
			{
				$('#'+questionId+'-msgComment').val('');				
				$('#'+questionId+'-addAnswer').slideToggle(200); 
				$('#'+questionId+'-addAnswer > textarea').focus();
			}
			
        },
        
	  /**
		 * post new answers on enter key press
		 */
	        	addQuestionAnswer: function(eventName){
	        	
	        	var element = eventName.target.parentElement;
	        	var parent =$(element).parents('div.follow-container').attr('id');
	        	var totalAnswers =  $('#'+parent+'-totalAnswer').text();
	        	var answerText = $('#'+parent+'-questionsAnswer').val();
	        	var self =this;
	        
	        	/* post answers on enter key press */
	        		
		    		eventName.preventDefault(); 
		   			 	
	   			 	if(!answerText.match(/^[\s]*$/))
	   			 	{
  			 	
	   			 		   // set the Comment model values and posted to server
	   			 			var answer = new AnswerModel();
	   			 		    var streamId =  $('.sortable li.active').attr('id');
	   			 			answer.urlRoot = "/answer";
	   			 			answer.save({answerText : answerText, questionId :parent, streamId : streamId},{
		   			    	success : function(model, response) {
	   			 				
			   			    		
		   			    		$('#'+parent+'-questionsAnswer').val('');
		   							
	   			    			// shows the posted answer
	   			    		    self.showPostedAnswer(response,parent,totalAnswers);
	   			    		
	   			    		    /* pubnum auto push */
   							PUBNUB.publish({
   			                	channel : "questionanswerMainStream",
		                        message : { pagePushUid: self.pagePushUid ,data:response,parent:parent,cmtCount:totalAnswers ,profileImage : localStorage["loggedUserProfileUrl"]}
   			                })
   			                
   			                PUBNUB.publish({
   			                	channel : "questionanswerSideStream",
		                        message : { pagePushUid: self.pagePushUid ,data:response,parent:parent,cmtCount:totalAnswers ,profileImage : localStorage["loggedUserProfileUrl"]}
   			                })
   			                
	   			    		    
		   			    	},
		   			    	error : function(model, response) {
		   			    		
		   			    	}
		
		   			    });

	   			 	}
	   			 	
	        },
      
      	
        
        	
	 /**
         * show posted answer
         */
        showPostedAnswer: function(response,parent,totalAnswers){
	  		$('#'+parent+'-addAnswer').slideUp(200);
		    /* display the posted comment  */
    		var compiledTemplate = Handlebars.compile(QuestionAnswer);
    		$('#'+parent+'-allAnswers').prepend(compiledTemplate({data:response,profileImage:localStorage["loggedUserProfileUrl"]}));
    		if($('#'+parent+'-allComments').is(":visible"))
				{
    			$('#'+parent+'-allComments').hide();
				}
    		if($('#'+parent+'-newCommentList').is(":visible"))
				{
    			$('#'+parent+'-newCommentList').hide();
				}
    		if(!$('#'+parent+'-allAnswers').is(':visible'))
			{  
				$('#'+parent+'-msgRockers').slideUp(1);
				$('#'+parent+'-newAnswerList').slideDown(1);
				$('#'+parent+'-newAnswerList').prepend(compiledTemplate({data:response,profileImage:localStorage["loggedUserProfileUrl"]}));
			}
    		totalAnswers++; 
    		$('#'+parent+'-show-hide').text("Hide All");
			$('#'+parent+'-totalAnswer').text(totalAnswers);
        },
        
        
/*Show all answer list*/        
        
showAllAnswerList: function(eventName){
	eventName.preventDefault();
	var element = eventName.target.parentElement;
	var parentUl = $(eventName.target).parent('ul');
	var questionId =$(element).parents('div.follow-container').attr('id');
	$(parentUl).find('a.active').removeClass('active');
					/* Get all the comments of an answer */
					 $.ajax({
						 type : 'GET',
						 url : "/answers/"+questionId,
	   					success : function(data) {
	   							if($('#'+questionId+'-allAnswers').is(":visible"))
	   							{
	   									$(eventName.target).removeClass('active');
	   									$('#'+questionId+'-msgRockers').slideUp(1);
	   									$('#'+questionId+'-newAnswerList').html('');
	   									$('#'+questionId+'-allAnswers').empty(); 
	   									$('#'+questionId+'-allAnswers').slideUp(600); 
	   									$('#'+questionId+'-show-hide').text("Show All");
	   							}
	   							else
	   							{
	   								if($('#'+questionId+'-allComments').is(':visible'))
	   								{
	   									$('#'+questionId+'-allComments').hide();
	   								}
	   								if($('#'+questionId+'-newCommentList').is(':visible'))
	   								{
	   									$('#'+questionId+'-newCommentList').hide();
	   								}
	   								$(eventName.target).addClass('active');
	   								$('#'+questionId+'-msgRockers').slideUp(1);
	   								$('#'+questionId+'-newAnswerList').html('');
	   								$('#'+questionId+'-allAnswers').empty(); 
	   								$.each(data,function(index,value){
	   									compiledTemplate = Handlebars.compile(AllAnswers);
	   									$('#'+questionId+'-allAnswers').prepend(compiledTemplate({value:value,profileImage:localStorage["loggedUserProfileUrl"]}));
	   									$('#'+questionId+'-allAnswers').slideDown(600); 
	   									$('#'+questionId+'-show-hide').text("Hide All");
	   								})
	   							}			 		
					 }
					 })
        },

        /**
	     *  Rocking question
	     */
	    rockQuestion: function(eventName){
	    	
	    	eventName.preventDefault();
	    	var self =this;
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			var streamId =  $('.sortable li.active').attr('id');
			var ownerId = localStorage["loggedUserId"];
			// set values to model for rocking the message
			var Question = new QuestionModel();
			Question.urlRoot = "/rock/question";
			Question.save({id : questionId},{
		    	success : function(model, response) {
		    		
					
					/* show/hide the rock and unrock symbols */
		    		if($('#'+questionId+'-qstRockCount').hasClass('downrocks-message'))
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('downrocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('uprocks-message');
	            		$('a#'+ questionId+ '-Nice').html("+ Nice!");
	            	}
	            	else
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('uprocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('downrocks-message');
	            		$('a#'+ questionId+ '-Nice').html("- Nice!");
	            	}
	            	
	            	
	            	// display the count in icon
	                $('#'+questionId+'-qstRockCount').find('span').html(response);
	                
	                /* ajax auto push for question rock */
	                PUBNUB.publish({
						channel : "questionRockMainStream",
	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response,quesId:questionId}
	                })
	                 PUBNUB.publish({
						channel : "questionRockSideStream",
	                    message : { pagePushUid: self.pagePushUid ,ownerId:ownerId,streamId:streamId,data:response,quesId:questionId}
	                })

	                if($('#rockedIt-'+questionId).hasClass('active')){
		    			self.getRockers(eventName,questionId);
		    		}
	                
		    	},
		    	error : function(model, response) {
		    	}

		    });
        },

         /**
		  * Follow a Question
		  */
		followQuestion: function(eventName){

			eventName.preventDefault();
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');			
			var datavalue = $('#'+eventName.target.id).attr('data-value');			
			
			// set values to model
			var question = new QuestionModel();
			question.urlRoot = "/follow/question";
			question.save({id : questionId},{
		    	success : function(model, response) {
		    		//set display
		        	if(datavalue == "follow")
		    		{
		        		$('#'+eventName.target.id).text("Unfollow");
		        		$('#'+eventName.target.id).attr('data-value','unfollow');
		        		 
		    		}
		        	else
		        	{
		        		$('#'+eventName.target.id).text("Follow");
		        		$('#'+eventName.target.id).attr('data-value','follow');
		        	}
		        	 
		    		
		    	},
		    	error : function(model, response) {
		    	}

		    });

	    },

	     /**
         *  Rock comments
         */
        rockComment: function(eventName){
        	
        	eventName.preventDefault();
        	var commentId = $(eventName.target).parents('div.answer-description').attr('id');
        	var questionId = $(eventName.target).parents('div.follow-container').attr('id');
        	var streamId =  $('.sortable li.active').attr('id');
        	var self = this;
        	
        	var comment = new CommentModel();
        	comment.urlRoot = "/rockingTheComment";
			// set values to model
        	comment.save({id : commentId },{
		    	success : function(model, response) {
		    		
		    		// display the count in icon
                	$('div#'+questionId+'-newCommentList').find('a#'+commentId+'-mrockCount').html(response);
                	$('div#'+questionId+'-allComments').find('a#'+commentId+'-mrockCount').html(response);
                	
                	/* pubnub auto push for rock comment */
                	PUBNUB.publish({
                        channel : "ques_commentRock",
                        message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response,questionId:questionId,commentId:commentId  }
                	})
		    	},
		    	error : function(model, response) {
		    	}

		    });
        },
        
        	
		     /**
         *  Rock answers
         */
        rockAnswer: function(eventName){
        	
        	eventName.preventDefault();
        	var commentId = $(eventName.target).parents('div.answer-description').attr('id');
        	var questionId = $(eventName.target).parents('div.follow-container').attr('id');
        	var streamId =  $('.sortable li.active').attr('id');
        	var self = this;
        	
        	var comment = new CommentModel();
        	comment.urlRoot = "/rockingTheComment";
			// set values to model
        	comment.save({id : commentId },{
		    	success : function(model, response) {
		    		
		    		// display the count in icon
                	$('div#'+questionId+'-newAnswerList').find('a#'+commentId+'-mrockCount').html(response);
                	$('div#'+questionId+'-allAnswers').find('a#'+commentId+'-mrockCount').html(response);
                	
                	/* pubnub auto push for rock comment */
                	PUBNUB.publish({
                        channel : "ques_answerRock",
                        message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response,questionId:questionId,commentId:commentId  }
                	})
		    	},
		    	error : function(model, response) {
		    	}

		    });
        },

        /**
        *  Follow User 
        */
        followUser : function(e){
        	e.preventDefault();
        	var userId = e.currentTarget.id;
        	var datavalue = $('#'+e.currentTarget.id).attr('data-value');	
        	
        	// set values to model, to follow a user
			var user = new UserModel();
			user.urlRoot = "/followUser/";
			user.save({id : userId},{
		    	success : function(model, response) {
		    		//set display
 		        	if(datavalue == "follow")
 		    		{
 		    			$('a.follow-user').each(function() {
		        			 
 		        			if($(this).attr('id') == userId)
 		        			{
 		        				$(this).text("Unfollow");
 		        				$(this).attr('data-value','unfollow'); 
 		        			}
 		        			
 		        		});
		        		
 		    		}
 		        	else
 		        	{

 		        		$('a.follow-user').each(function() {
 		        			 
 		        			if($(this).attr('id') == userId)
 		        			{
 		        				$(this).text("follow");
 		        				$(this).attr('data-value','follow');
 		        			}
 		        			
 		        		});
 		        
 		        	}
		    	},
		    	error : function(model, response) {
		    	}
			});
        },



        /**
	  	*  show Message rockers list 
	  	*/
		showRockersList: function(eventName){
			 
			eventName.preventDefault();
	        	
	        var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parent('ul');
        	
			var questionId =$(element).parents('div.follow-container').attr('id');
			$(parentUl).find('a.active').removeClass('active');

			this.getRockers(eventName,questionId);

				
		},

		getRockers:function(eventName,questionId){
			
			if($('#'+questionId+'-questionRockers').is(":visible"))
			{
				
				$(eventName.target).removeClass('active');
				$('#'+questionId+'-questionRockers').slideUp(600);
				
			}
			else
			{
			 	var question = new QuestionModel();
				question.urlRoot = "/rockersOf/question/"+questionId;
				
				question.fetch({
					success : function(data, models) {
						$('#'+questionId+'-questionRockers').html('');
						
							_.each(data.attributes, function(value) {
								if(jQuery.type( value ) === "string"){
									compiledTemplate = Handlebars.compile(MessageRocker);
	        						$('#'+questionId+'-questionRockers').append(compiledTemplate({rocker:value}));
								}
								
							});
						
	        				$(eventName.target).addClass('active');
							$('#'+questionId+'-allComments').slideUp(1); 
							$('#'+questionId+'-newCommentList').html('');
							$('#'+questionId+'-questionRockers').slideDown(600);
							$('#'+questionId+'-show-hide').text("Show All");
					
					}
				});

				
				
			}

        
		},
		
        /**
         * show / hide all comments ..
         */
        showAllList: function(eventName){
        	eventName.preventDefault();
        	
        	var element = eventName.target.parentElement;
        	var parentUl = $(eventName.target).parents('ul');
        	$(parentUl).find('a.active').removeClass('active');
			var questionId =$(element).parents('div.follow-container').attr('id');
			if($('#'+questionId+'-show-hide').text() == "Hide All")
            {
				$('#'+questionId+'-msgRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideUp(600); 
				$('#'+questionId+'-newAnswerList').html('');
				$('#'+questionId+'-allAnswers').slideUp(600); 
				$(eventName.target).removeClass('active');
				$(eventName.target).text("Show All");
            }
			else
			{
				$('#'+questionId+'-msgRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideDown(600);
				$('#'+questionId+'-newAnswerList').html('');
				$('#'+questionId+'-allAnswers').slideDown(600);
				$(eventName.target).addClass('active');
				$(eventName.target).text("Hide All");
			}
			
        },

        /**
        * delete Question
        */
        deleteQuestion: function(e){
        	e.preventDefault();
		 	var questionId = e.target.id;
		 	var ownerId = $('div#'+questionId).attr('name');
		 	  var streamId =  $('.sortable li.active').attr('id');
		 	var self = this;			 

		 	if(localStorage["loggedUserId"] == ownerId)
		 	{
	 			bootbox.dialog("Are you sure you want to delete this message?", [{
	
	 				"label" : "DELETE",
	 				"class" : "btn-primary",
	 				"callback": function() {
	 					

	 					var question = new QuestionModel();
	 					question.urlRoot = '/remove/question';

						question.save({id: questionId},{
	    					success : function(model, response) {
		    		
	    						
					 			if(response.status == "Success")
		                	 	{
			                		 
	                		 		$('div#'+questionId).remove();
	                		 		
	                		 		/* pubnum auto push -- delete question*/
   									PUBNUB.publish({
   			                			channel : "deleteQuestionMainStream",
		                       			 message : { pagePushUid: self.pagePushUid,streamId:streamId ,questionId : questionId}
   			               			 })
   			               		   PUBNUB.publish({
   			                			channel : "deleteQuestionSideStream",
		                       			 message : { pagePushUid: self.pagePushUid,streamId:streamId ,questionId : questionId}
   			               			 })

		                	 	}
		                	 	else
		                	 	{
		                		 	bootbox.alert("You're Not Authorised To Delete This Message");
		                	 	}
		    		
		    				},
		    				error : function(model, response) {
		    				}

		    			});
                      
	 				}
	
	 			 }, 
	 			 {
				 	"label" : "CANCEL",
				 	"class" : "btn-primary",
	 				"callback": function() {
	 				}
	 			 }]);
 			 }
 			 else
 			 {
 				bootbox.alert("You're Not Authorised To Delete This Message");
 			 }
        },


        /**
        *  Delete comment
        */
        deleteComment: function(e){

   			e.preventDefault();
   			var self = this;
 			var commentId = e.target.id;
 			var ownerId = $(e.target).attr('data-username');
 			var questionId = $(e.target).parents('div.ask-outer').attr('id');
 			$
			.ajax({
				type : 'GET',
				url : '/can/remove/comment/' + commentId + '/' + questionId,
				success : function(data) {								
					if (data == "true") { 
				    bootbox.dialog("Are you sure you want to delete this comment?", [{
	
	 				"label" : "DELETE",
	 				"class" : "btn-primary",
	 				"callback": function() {

	 					var comment = new CommentModel();
	 					comment.urlRoot = '/remove/comment/'+questionId;

	 					/* delete the comment from the model */
	 					comment.save({id: commentId},{
	    					success : function(model, response) {
					 			if(response.status == "Success")
		                	 	{
			                		 

									var commentCount = $('#'+questionId+'-totalComment').text();
									
	                		 		// $('#'+messageId+'-totalComment').text(commentCount-1);

			                		//$('div#question-'+commentId).remove();

	                		 		/* pubnum auto push -- delete comment*/
   									PUBNUB.publish({
   			                			channel : "delete_ques_Comment",
		                       			 message : { pagePushUid: self.pagePushUid ,questionId : questionId ,commentId : commentId}
   			               			 })
   			               			 	PUBNUB.publish({
   			                			channel : "delete_ques_CommentSideBar",
		                       			 message : { pagePushUid: self.pagePushUid ,questionId : questionId ,commentId : commentId}
   			               			 })
   			               			 
			                		
		                	 	}
		                	 	else
		                	 	{
		                		 	bootbox.alert("You're Not Authorised To Delete This Comment");
		                	 	}
		    		
		    				},
		    				error : function(model, response) {
		    				}

		    			});
	 					
	 				}
	
	 			 }, 
	 			 {
				 	"label" : "CANCEL",
				 	"class" : "btn-primary",
	 				"callback": function() {
	 				}
	 			 }]);
 			 } else {
 				bootbox.alert("You're Not Authorised To Delete This Comment");
 			  }
		     }
			});
        },
       
			
	/**
        *  Delete comment
        */
        deleteAnswer: function(e){

   			e.preventDefault();
   			var self = this;
 			var answerId = e.target.id;
 			var ownerId = $(e.target).attr('data-username');
 			var questionId = $(e.target).parents('div.ask-outer').attr('id');
 			$
			.ajax({
				type : 'GET',
				url : '/can/remove/answer/' + answerId + '/' + questionId,
				success : function(data) {								
					if (data == "true") {
	 			    bootbox.dialog("Are you sure you want to delete this answer?", [{
	
	 				"label" : "DELETE",
	 				"class" : "btn-primary",
	 				"callback": function() {

	 					var answer = new AnswerModel();
	 					answer.urlRoot = '/remove/answer/'+questionId;

	 					/* delete the comment from the model */
	 					answer.save({id: answerId},{
	    					success : function(model, response) {
					 			if(response.status == "Success")
		                	 	{
	                		 		/* pubnum auto push -- delete comment*/
   									PUBNUB.publish({
   			                			channel : "delete_ques_Answer",
		                       			 message : { pagePushUid: self.pagePushUid ,questionId : questionId ,answerId : answerId}
   			               			 })
   			               			 
   			               			 PUBNUB.publish({
   			                			channel : "delete_ques_AnswerSide",
		                       			 message : { pagePushUid: self.pagePushUid ,questionId : questionId ,answerId : answerId}
   			               			 })
		                	 	}
		                	 	else
		                	 	{
		                		 	bootbox.alert("You're Not Authorised To Delete This Answer");
		                	 	}
		    				},
		    				error : function(model, response) {
		    				}

		    			});
	 					
	 				}
	
	 			 }, 
	 			 {
				 	"label" : "CANCEL",
				 	"class" : "btn-primary",
	 				"callback": function() {
	 				}
	 			 }]);
 			 }
 			 else
 			 {
 				bootbox.alert("You're Not Authorised To Delete This Comment");
 			 }
		}
			});
        },


       

	
 		/**
	 	* polling 
	 	*/
		polling:function(eventName){
			
	        var element = eventName.target.parentElement;
	        var questionId =$(element).parents('div.follow-container').attr('id');
	        
            var optionId = $('input[name='+questionId+']:checked').val();
            var values = [];
            
            var question = new QuestionModel();
			question.urlRoot = '/voteAnOptionOf/question';


			question.save({id: optionId},{
				success : function(model, response) {
					
					var voteCount = response.voters.length;
                     $('input#'+response.id.id+'-voteCount').val(voteCount);
                     
                     //get all poll options vote count
                     $('input.'+questionId+'-polls').each(function() {
                     	values.push(parseInt($(this).val()));
                 	 });
                    
                     /* updating pie charts */ 
                     $("#"+questionId+"-piechart").find('svg').remove();
                     donut[questionId] = new Donut(new Raphael(""+questionId+"-piechart", 200,200));
                     donut[questionId].create(100, 100, 30, 55,100, values);
                     
                     var streamId =  $('.sortable li.active').attr('id');
                     //Auto push 
                      PUBNUB.publish({
                    	  channel : "voting",
	                          message : { pagePushUid:self.pagePushUid ,streamId:streamId,data:response,questionId:questionId,userId:localStorage["loggedUserId"]}
                      }) 
                     
                     $("input[name="+questionId+"]").attr('disabled',true);
		 			
				},
				error : function(model, response) {
				}

			});


		},
	})
	return QuestionItemView;
});

