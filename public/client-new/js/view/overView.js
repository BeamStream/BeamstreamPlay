/***
* BeamStream
*
* Author                : Aswathy .P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/March/2013
* Description           : Backbone view for overview
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView'], function(FormView){
	var OverView;
	OverView = FormView.extend({
		objName: 'OverView',
		
		events:{
//                'click #login': 'login'
		},

		onAfterInit: function(){	
            this.data.reset();
        },
 
	})
	return OverView;
});
