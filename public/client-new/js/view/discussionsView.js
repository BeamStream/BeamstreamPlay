/***
* BeamStream
*
* Author                : Aswathy .P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/March/2013
* Description           : Backbone view for discussion tab
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView'], function(FormView){
	var Discussions;
	Discussions = FormView.extend({
		objName: 'Discussion',
		
		events:{
//                'click #login': 'login'
		},

		onAfterInit: function(){	
            this.data.reset();
        },
 
	})
	return Discussions;
});
