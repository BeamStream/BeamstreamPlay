define(['view/formView',
		'view/questionItemView',
        'model/question',
        'text!templates/questionMessage.tpl',
        
        ], function(FormView ,QuestionItemView,QuestionModel, QuestionMessage ){
	var QuestionsView;
	QuestionsView = FormView.extend({
		objName: 'QuestionsView',

		
		events:{
			'click #sortQuestionBy-list' : 'sortQuestions',
			'click #sortQueByDate-list' : 'sortQuestionsWithinAPeriod',
			'click #share-discussions li a' : 'actvateShareIcon',
			'click #Q-privatelist li' :'selectPrivateToList',
			'click #post-question' : 'postQuestion',
			'click .add-poll' : 'addPollOptionsArea',
			'click .add-option' : 'addMorePollOptions',
			'click #Q-private-to' : 'checkPrivateAccess',
			'click #question-file-upload li' : 'uploadFiles',
			'change #Q-files-area' : 'getUploadedData',
			'keypress #Q-area' : 'postQuestionOnEnterKey',
			

			
		},

		messagesPerPage: 10,
	 	pageNo: 1,

		onAfterInit: function(){	
            this.data.reset();
            
         	$('#Q-main-photo').attr('src',localStorage["loggedUserProfileUrl"]);
            
        },

        /**
        * post question on enter key press
        */
        postQuestionOnEnterKey: function(eventName){
			var self = this;
	    	
			if(eventName.which == 13) {
				self.postQuestion(); 
			}
			// if(eventName.which == 32){
			// 	var text = $('#msg-area').val();
			// 	var links =  text.match(this.urlRegex); 
				
			// 	 /* create bitly for each url in text */
			// 	self.generateBitly(links);
			// }
        },
        
        /**
         *   Sort questions
         */
		sortQuestions: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	var sortKey = $(eventName.target).attr('value');
        	
        	/* render the message list */
        	view = this.getViewById('questionListView');
    		if(view){
    			
    			view.data.url="/getAllQuestionsForAStream/"+streamId+"/"+sortKey+"/"+view.messagesPerPage+"/"+view.pageNo;
    			view.fetch();

    		}

			$('#sortQuestionBy-select').text($(eventName.target).text());

        },
        
        /**
         *  sort questions within a period 
         */
        sortQuestionsWithinAPeriod: function(eventName){
        	eventName.preventDefault();
        	$('#sortQueByDate-select').text($(eventName.target).text());
        },
 
        /**
         *select private to class options
         */
        selectPrivateToList: function(eventName){
        	
        	eventName.preventDefault();
        	$('#Q-privateTo-select').text($(eventName.target).text());
        	
        	//uncheck private check box when select Public
        	if($(eventName.target).text() == "Public")
        	{
        		$('#Q-private-to').attr('checked',false);
        	}
        	else
        	{
        		$('#Q-private-to').attr('checked',true);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        /**
         * activate share icon on selection
         */
        actvateShareIcon: function(eventName){
        	
        	eventName.preventDefault();
        	
        	$('#Q-private-to').attr('checked',false);
        	$('#Q-privateTo-select').text("Public");
        	$('#Q-privateTo-select').attr('value', 'public');
        	
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
         *select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').attr('name');
        	
        	if($('#Q-private-to').attr('checked')!= 'checked')
        	{
        		$('#Q-privateTo-select').text("Public");
        		
        	}
        	else
        	{
        		$('#Q-privateTo-select').text(streamName);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },

        /**
   	  	* show  Upload files option when we select category
   	  	*/
   	 	uploadFiles: function(eventName){
   	 		
   	 		eventName.preventDefault();
   	 		$('#Q-files-area').click();
	   		  
   	 	},

   	 	/**
         * get files data to be upload
         */
        getUploadedData: function(e){
        	
        	var self = this;;
    	    file = e.target.files[0];
    	    var reader = new FileReader();
    	      
        	/* capture the file informations */
            reader.onload = (function(f){
            	self.file = file;
            	self.bar = $('.bar');        //progress bar
                self.bar.width('');
                self.bar.text("");
                clearInterval(self.progress);
            	$('#Q-file-name').html(f.name);
            	$('#Q-file-area').show();
            	
            })(file);
 
            // read the  file as data URL
            reader.readAsDataURL(file);

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
	        var queAccess =  $('#Q-private-to').attr('checked');
	        var privateTo = $('#Q-privateTo-select').text();
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
		    
		    /* if there is any files for uploading  */ 
	        if(this.file ){
	        	
	        	$('.progress-container').show();
	        	self.file = "";
	        }
	        else{
	        	self.postQuestionToServer(question,streamId,questionAccess);
	        }

	         
		},
		
		
		/**
		 * click to view areas for adding poll options
		 */
		addPollOptionsArea: function(eventName){
			eventName.preventDefault();
			
			this.options = 2;
			$('#pollArea').slideToggle(700); 
		},
		
		/**
		 * function  to add more poll options
		 */
		addMorePollOptions : function(eventName){
			
			eventName.preventDefault();

			this.options++;
			if(this.options == 3)
				var options ='<li class="moreOptions"><input type="text"   id="option'+this.options+'" placeholder="Add 3rd Poll Option" name="Add Option"> </li>';
			else
				var options ='<li class="moreOptions"><input type="text"   id="option'+this.options+'" placeholder="Add '+this.options+'th Poll Option" name="Add Option"> </li>';

			 $('#pollArea li').last().after(options);
		 },
		 
		 
		 /**
	   	  * POST question details to server 	
	   	  */
		 postQuestionToServer: function(question,streamId,questionAccess){

		 	var self = this;
		 	self.color= 0;
		 	var pollOptions ='';
		 	for (var i=1; i<= this.options ; i++)
		 	{
			 	pollOptions+= $('#option'+i).val()+',' ;
			 	$('#option'+i).val('');
		 	}
		 	pollOptions = pollOptions.substring(0, pollOptions.length - 1);

        	this.data.url = "/question";
        	if(pollOptions == ''){

        		this.data.models[0].save({streamId : streamId, questionBody :question, questionAccess:questionAccess},{
			    	success : function(model, response) {
			    		
			    		// show the posted message on feed
			    		var questionItemView  = new QuestionItemView({model : self.data.models[0]});
						$('#questionListView div.content').prepend(questionItemView.render().el);
						
			    		$('#Q-area').val("");
		    		 	$('#share-discussions li.active').removeClass('active');
			    		$('#pollArea').slideUp(700); 
			    		$('.drag-rectangle').tooltip();	
			    		self.options = 0;
			    		
			    	},
			    	error : function(model, response) {
			    		$('#Q-area').val("");
	                    console.log("error");
	                    $('#pollArea').slideUp(700); 
			    	}

		    	});
        	}else{

        		// set values to model
			    this.data.models[0].save({streamId : streamId, questionBody :question, questionAccess:questionAccess ,pollOptions:pollOptions},{
			    	success : function(model, response) {
			    		
			    		// show the posted message on feed
			    		var questionItemView  = new QuestionItemView({model : self.data.models[0]});
						$('#questionListView div.content').prepend(questionItemView.render().el);
						
			    		$('#Q-area').val("");
			    		$('#share-discussions li.active').removeClass('active');
			    		self.options = 0;
			    		$('.drag-rectangle').tooltip();	
			    		$('#pollArea').slideUp(700); 


			    		// var values = [],pollIndex = 0,totalVotes = 0;
            			
	        // 		 	_.each(response.polls, function(poll) {

	        // 		 		console.log(55);
		       //  			var radioColor = Raphael.hsb(self.color, 1, 1);
		       //  			pollIndex++;
		        			 
		       //  			values.push(poll.voters.length);
		       //  			totalVotes += poll.voters.length;
		        			 
		       //      	 	var pollTemplate = Handlebars.compile(QuestionPoll);
    					//  	$('#'+response.question.id.id+'-pollOptions').append(pollTemplate({poll:poll, pollIndex:pollIndex ,question:response.question.id.id, color:radioColor, voteCount :poll.voters.length}));

			      //       	self.color += .1;
	        // 		 	});

			    		

			    		
			    	},
			    	error : function(model, response) {
			    		$('#Q-area').val("");
	                    console.log("error");
	                    $('#pollArea').slideUp(700); 
			    	}

			    });
        	}

		    


	   		 
// 			 var self = this; 
// 			 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
// 			 var trueurl='';
	          
// 			 var pollOptions ='';
//    			 for (var i=1; i<= this.options ; i++)
//    			 {
//    				 pollOptions+= $('#option'+i).val()+',' ;
//    				 $('#option'+i).val('');
//    			 }
//    			 pollOptions = pollOptions.substring(0, pollOptions.length - 1);
		    
//             console.log(self.data.models[0]);
// 		     /* set to model */
//    			 this.question = new QuestionModel();
//    			 this.question.url = "/question";
//    			 this.question.save({streamId : streamId, questionBody :question, questionAccess:questionAccess ,pollOptions:pollOptions},{
//    				 success : function(model, response) {
		    		
//    					 $('#Q-area').val("");
//    					 $('#share-discussions li.active').removeClass('active');
//    					 $('.moreOptions').remove();
	            	 
//    					 $('#pollArea').slideUp(700); 
// 	            	 this.options = 0;
	            	 
// 	            	 self.showQuestion(streamId,response);
// //			    		  /* display the posted message on feed */
// //			    		 _.each(response, function(message) {
// //			    			 
// //				    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
// //				    		$('#all-messages').prepend( compiledTemplate({data:message}));
// //				    		
// //			    		 });
//    				 },
//    				 error : function(model, response) {
		    		
//    					 console.log("error");
//    				 }

//    			 });
			    
			   
		 },
			 
			 
		 /**
		 * common function for dispaying question after post  (for / auto push ) 
		 */
		 showQuestion : function(streamId,data){
			
			 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			 var trueurl='';
	
			 var compiledTemplate = Handlebars.compile(QuestionMessage);
			 $('#all-questions').prepend(compiledTemplate({data:data}));
			 
        	 var source = $("#tpl-questions_with_polls").html();
        	 var template = Handlebars.compile(source);
        	 $('#all-questions').prepend(template({data:data,rocks:data.question.rockers.length}));
        	 $('.drag-rectangle').tooltip();	
        	 var pollCount = data.polls.length;
        	 this.color = 0;
        	 //render each poll options and its polling percentage
        	 if(pollCount > 0)
        	 {
        		 $('#'+data.question.id.id+'-Answer').hide();
        		 $('#'+data.question.id.id+'-Answerbutton').hide();
        	 }
	        	 
  		},


  		
		
	})
	return QuestionsView;
});
