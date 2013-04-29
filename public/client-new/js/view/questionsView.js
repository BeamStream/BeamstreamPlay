define(['view/formView',
        'model/question',
        'text!templates/questionMessage.tpl',
        ], function(FormView ,QuestionModel, QuestionMessage ){
	var Questions;
	Questions = FormView.extend({
		objName: 'Questions',

		
		events:{
			'click #sortQuestionBy-list' : 'sortQuestions',
			'click #sortQueByDate-list' : 'sortQuestionsWithinAPeriod',
			 'click #share-discussions li a' : 'actvateShareIcon',
			'click #Q-privatelist li' :'selectPrivateToList',
			'click #post-question' : 'postQuestion',
			'click .add-poll' : 'addPollOptionsArea',
			'click .add-option' : 'addMorePollOptions',
			'click #Q-private-to' : 'checkPrivateAccess',

			
		},

		messagesPerPage: 10,
	 	pageNo: 1,

		onAfterInit: function(){	
            this.data.reset();
            this.pagenum = 1;
            this.pageLimit = 10;
         	$('#Q-main-photo').attr('src',localStorage["loggedUserProfileUrl"]);
            
        },
        
        /**
         *   Sort questions
         */
		sortQuestions: function(eventName){
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
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
		    
		    
		    self.postQuestionToServer(question,streamId,questionAccess);
		 
		    
		    
			
	         
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

			var parent = $('#add_more_options').parents('li');
			$('.answer li').last().after(options);
		 },
		 
		 
		 /**
	   	  * POST question details to server 	
	   	  */
		 postQuestionToServer: function(question,streamId,questionAccess){
	   		 
			 var self = this; 
			 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			 var trueurl='';
	           console.log(this.options) ;
			 var pollOptions ='';
   			 for (var i=1; i<= this.options ; i++)
   			 {
   				 pollOptions+= $('#option'+i).val()+',' ;
   				 $('#option'+i).val('');
   			 }
   			 pollOptions = pollOptions.substring(0, pollOptions.length - 1);
		    
            
		     /* set to model */
   			 // this.question = new QuestionModel();
   			 this.data.url = "/question";
   			 this.data.models[0].save({streamId : streamId, question :question, questionAccess:questionAccess ,pollOptions:pollOptions},{
   				 success : function(model, response) {
		    		
   					 $('#Q-area').val("");
   					 $('#share-discussions li.active').removeClass('active');
   					 $('.moreOptions').remove();
	            	 
   					 $('#pollArea').slideUp(700); 
	            	 this.options = 0;
	            	 
	            	 self.showQuestion(streamId,response);
//			    		  /* display the posted message on feed */
//			    		 _.each(response, function(message) {
//			    			 
//				    		var compiledTemplate = Handlebars.compile(DiscussionMessage);
//				    		$('#all-messages').prepend( compiledTemplate({data:message}));
//				    		
//			    		 });
   				 },
   				 error : function(model, response) {
		    		
   					 console.log("error");
   				 }

   			 });
			    
			   
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
        	 $('#all-questions').prepend(template({data:data,owner: owner ,rocks:data.question.rockers.length}));
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
	return Questions;
});
