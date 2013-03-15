/***
* BeamStream
*
* Author                : Aswathy .P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/March/2013
* Description           : Backbone view for questions tab
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView'], function(FormView){
	var Questions;
	Questions = FormView.extend({
		objName: 'Questions',
		
		events:{
			'click #sortQuestionBy-list' : 'sortQuestions',
			'click #sortQueByDate-list' : 'sortQuestionsWithinAPeriod',
			'click #Q-privatelist li' :'selectPrivateToList',
		},

		onAfterInit: function(){	
            this.data.reset();
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
        		$('#private-to').attr('checked',false);
        	}
        	else
        	{
        		$('#private-to').attr('checked',true);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
	})
	return Questions;
});
