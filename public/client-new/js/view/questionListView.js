/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/April/2013
* Description           : View for Question List on discussion page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        'view/questionItemView',
        ],function(FormView ,QuestionItemView){
	
	var QuestionListView;
	QuestionListView = FormView.extend({
		objName: 'QuestionListView',
		messagesPerPage: 10,
		pageNo: 1,

	 
		onAfterInit: function(){	
			this.data.reset();
        },
        
        onAfterRender: function(){
        	$('.commentList').hide();
        	
        },
		
        /**
         * display messages
         */
        displayPage: function(callback){
             
			/* render messages */
        	_.each(this.data.models, function(model) {
				var questionItemView  = new QuestionItemView({model : model});
				$('#questionListView div.content').append(questionItemView.render().el);
				
				setTimeout(function() {
                    
					if(model.attributes.polls.length > 0){
	    				var values = [],pollIndex = 0,totalVotes = 0,isAlreadyVoted = false ,myAnswer ='';
	            			
		    		 	_.each(model.attributes.polls, function(poll) {

		        			var radioColor = Raphael.hsb(self.color, 1, 1);
		        			 
		        			values.push(poll.voters.length);
		        			totalVotes += poll.voters.length;
			            	self.color += .1;


			            	 //check whether the user is already voted or not
	            			 _.each(poll.voters, function(voter) {
	            				  
	            				 if(voter.id == localStorage["loggedUserId"])
	            				 {
	            					 isAlreadyVoted = true;
	            					 myAnswer = poll.id.id;
	            				 }
	            				
	            			  });
		    		 	});
				 	 	if(totalVotes != 0)
		    		 	{
		    		 		
		    			 	/* creating pie charts */ 
		            	 	donut[model.attributes.question.id.id] = new Donut(new Raphael(""+model.attributes.question.id.id+"-piechart", 200,200));
		            	 	donut[model.attributes.question.id.id].create(100, 100, 30, 55,100, values);
		
					 	}

					 	//disable the polling option if already polled
	            		 if(isAlreadyVoted == true)
	            		 {
	            			 $("input[id="+myAnswer+"]").attr('checked',true);
	            			 $("input[name="+model.attributes.question.id.id+"]").attr('disabled',true);
	            		 }
	        		}           
                }, 500);




				
        	});
		},
		
		
        displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
		
		
       
	})
	return QuestionListView;
});