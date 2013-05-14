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
		'model/user',
		'text!templates/questionMessage.tpl',
		 'text!templates/questionComment.tpl'
        ],function(FormView,QuestionModel, CommentModel,UserModel, QuestionMessage, QuestionComment ){
	
	var QuestionItemView;
	QuestionItemView = FormView.extend({
		objName: 'QuestionItemView',
		events:{
			'click .add-comment' : 'showCommentTextArea',
			'keypress .add-question-comment' : 'addQuestionComments',
			'click .rocks-question': 'rockQuestion',
			'click .follow-question': 'followQuestion',
			'click .rock-comments': 'rockComment',
			'click .rocks-small a': 'rockComment',
		 	'click .follow-user' : 'followUser',
		 	'click .show-all-comments' : 'showAllCommentList',
		 	'click .show-all' : 'showAllList',
		 	'click .delete_post': 'deleteQuestion',
		 	'click .delete_comment' : 'deleteComment',
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
        	
         	var model = this.model.attributes;
			var questionType ='';
			var questionBody = model.question.questionBody;
                                            
			//var links =  msgBody.match(BS.urlRegex); 
            var qstUrl=  questionBody.replace(this.urlRegex1, function(qstUrlw) {
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
                         var linkTag =  questionBody.replace(this.urlRegex1, function(url) {
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
                var datVal =  formatDateVal(model.question.creationDate);
                
				var datas = {
					 	 "data" : model,
					 	 "datVal":datVal,
					 	 "rocks" : model.question.rockers.length,

				    }
               
				
				// render the template
        		compiledTemplate = Handlebars.compile(QuestionMessage);
        		$(this.el).html(compiledTemplate(datas));

        		$('.drag-rectangle').tooltip();

        		$('.commentList').hide();
			
    		return this;
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
			}
			else
			{
				$('#'+questionId+'-msgComment').val('');
				$('#'+questionId+'-addComments').slideToggle(200); 
				
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
        	if(eventName.which == 13) {
        		
	    		eventName.preventDefault(); 
	   			 	
   			 	if(!commentText.match(/^[\s]*$/))
   			 	{
//   			 		this.data.url = "/newComment";
   			 		
   			 		    /* set the Comment model values and posted to server */
   			 			var comment = new CommentModel();
   			 			comment.urlRoot = "/newComment";
   			 			comment.save({comment : commentText, questionId :parent},{
	   			    	success : function(model, response) {
		   			    		
	   			    		$('#'+parent+'-questionComment').val('');
	   							
   			    			// shows the posted comment
   			    		    self.showPostedComment(response,parent,totalComments);
   			    		 /* pubnum auto push */
   							PUBNUB.publish({
   			                	channel : "questioncomment",
		                        message : { pagePushUid: self.pagePushUid ,data:response,parent:parent,cmtCount:totalComments ,profileImage : localStorage["loggedUserProfileUrl"]}
   			                })
   			    		    
	   			    	},
	   			    	error : function(model, response) {
	   			    		
	   	                    console.log("error");
	   			    	}
	
	   			    });

   			 	}
   			 	
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
	     *  Rocking question
	     */
	    rockQuestion: function(eventName){
	    	
	    	eventName.preventDefault();
			var element = eventName.target.parentElement;
			var questionId =$(element).parents('div.follow-container').attr('id');
			var streamId =  $('.sortable li.active').attr('id');
			
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
	            	}
	            	else
	            	{
	            		$('#'+questionId+'-qstRockCount').removeClass('uprocks-message');
	            		$('#'+questionId+'-qstRockCount').addClass('downrocks-message');
	            	}
	            	
	            	// display the count in icon
	                $('#'+questionId+'-qstRockCount').find('span').html(response);
	                
	                /* ajax auto push for question rock */
	                PUBNUB.publish({
						channel : "questionRock",
	                    message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:response,quesId:questionId}
	                })
	                
		    	},
		    	error : function(model, response) {
                    console.log("error");
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
                  console.log("error");
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
                    console.log("error");
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
                    console.log("error");
		    	}
			});
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
			
			if($('#'+questionId+'-allComments').is(":visible"))
			{
				$(eventName.target).removeClass('active');
				$('#'+questionId+'-msgRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideUp(600); 
				$('#'+questionId+'-show-hide').text("Show All");
			}
			else
			{
				$(eventName.target).addClass('active');
				$('#'+questionId+'-msgRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideDown(600); 
				$('#'+questionId+'-show-hide').text("Hide All");
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
				$(eventName.target).removeClass('active');
				$(eventName.target).text("Show All");
            }
			else
			{
				$('#'+questionId+'-msgRockers').slideUp(1);
				$('#'+questionId+'-newCommentList').html('');
				$('#'+questionId+'-allComments').slideDown(600);
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
   			                			channel : "deleteQuestion",
		                       			 message : { pagePushUid: self.pagePushUid ,questionId : questionId}
   			               			 })

		                	 	}
		                	 	else
		                	 	{
		                		 	bootbox.alert("You're Not Authorised To Delete This Message");
		                	 	}
		    		
		    				},
		    				error : function(model, response) {
                  		  		console.log("error");
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
 			 
 			if(localStorage["loggedUserId"] == ownerId)
 			{
	 			bootbox.dialog("Are you sure you want to delete this comment?", [{
	
	 				"label" : "DELETE",
	 				"class" : "btn-primary",
	 				"callback": function() {

	 					var comment = new CommentModel();
//	 					var comment = new CommentModel();
	 					comment.urlRoot = '/remove/comment/'+questionId;

	 					/* delete the omment from the model */
	 					comment.save({id: commentId},{
	    					success : function(model, response) {
		    		
					 			if(response.status == "Success")
		                	 	{
			                		 

									var commentCount = $('#'+questionId+'-totalComment').text()
	                		 		// $('#'+messageId+'-totalComment').text(commentCount-1);

			                		$('div#question-'+commentId).remove();
									

	                		 		/* pubnum auto push -- delete comment*/
   									PUBNUB.publish({
   			                			channel : "delete_ques_Comment",
		                       			 message : { pagePushUid: self.pagePushUid ,questionId : questionId ,commentId : commentId}
   			               			 })
			                		
		                	 	}
		                	 	else
		                	 	{
		                		 	bootbox.alert("You're Not Authorised To Delete This Comment");
		                	 	}
		    		
		    				},
		    				error : function(model, response) {
                  		  		console.log("error");
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
 				bootbox.alert("You're Not Authorised To Delete This Comment");
 			 }
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
      		  		console.log("error");
				}

			});


		},
	})
	return QuestionItemView;
});