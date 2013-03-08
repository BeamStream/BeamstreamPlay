/***
* BeamStream
*
* Author                : Aswathy .P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 07/March/2013
* Description           : Backbone view for main stream page
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/baseView'], function(BaseView){
	var MyStreamView;
	MyStreamView = BaseView.extend({
		objName: 'MyStreamView',
		
		onAfterInit: function(){
			this.data.reset({'firstName':'John', 'lastName': 'Doe'})
		},
		
		events:{
//			'click #myTab li': 'tabHandler'
		},
		
		tabHandler: function(e){
//			e.preventDefault();
//			$('#questions_tab').addClass('active');
//			console.log(33);
//			$('#questions_tab').tab('show');
			
//			$('a[data-toggle="tab"]').on('shown', function (e) {
//				if($(e.target.href)[0].children==0)
//					//initalize view
//			});
		}
		
		
		
	})
	return MyStreamView;
});

