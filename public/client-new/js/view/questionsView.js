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
		},

		onAfterInit: function(){	
            this.data.reset();
        },
 
	})
	return Questions;
});
