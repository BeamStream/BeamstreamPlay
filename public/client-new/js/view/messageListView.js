/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : View for Message List on discussion page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView',
        'view/messageItemView',
        ],function(FormView ,MessageItemView){
	
	var MessageListView;
	MessageListView = FormView.extend({
		objName: 'MessageListView',
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
				var messageItemView  = new MessageItemView({model : model});
				$('#messageListView div.content').append(messageItemView.render().el);
				
        	});
		},
		
		
        displayNoResult : function(callback) {
			this.animate.effect = "fade";
			this.$(".content").html("");
		},
		
		
       
	})
	return MessageListView;
});