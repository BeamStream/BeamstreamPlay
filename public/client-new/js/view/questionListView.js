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
				
        	});
		},
		
		
        displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
		
		
       
	})
	return QuestionListView;
});