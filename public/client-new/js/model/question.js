/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 18/March/2013
* Description           : Backbone model for question
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['baseModel'], function(BaseModel) {
	var Question = BaseModel.extend({ 
		objName: 'Question',
		defaults:{
		},
		
		validation: {
			
		}, 

		rockQuestion: function(){
			this.urlRoot = 'rock/question';
			this.save({id: this.get('question').id.id});
		}

		// this was the attempted implementation with pubnub
		// rockQuestion: function(){
	 //    this.urlRoot = 'rock/question';
	 //    var that = this;
	 //    this.save({id: this.get('question').id.id}, {success: function(model, response){
	 //    	console.log('question save to db', model);
	 //    	// PUBNUB.publish({
	 //    	// 	channel: 'questionRock', 
	 //    	// 	message: {pagePushUid: that.pagePushUid, streamId: that.get('question').streamId.id, data: response, quesId: that.get('question').id.id}
	 //    	// })
	 //    }
	 //    })
		// }

	});
				
	
	return Question;
});
