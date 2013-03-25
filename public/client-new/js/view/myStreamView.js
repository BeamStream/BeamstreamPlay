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
			this.data.reset()
		},
		
		events:{
			'click #myTab a': 'tabHandler',
			'click #show-info' :'showDetails',
			'click .sortable li' : 'renderRightContenetsOfSelectedStream',
		},
		

		
		tabHandler: function(e){
			$('#myTab a.active').removeClass('active');
			$(e.target).addClass('active');
			
//			$('a[data-toggle="tab"]').on('shown', function (e) {
//				
////				if($(e.target.href)[0].children==0)
//					//initalize view
//			});
		},
		
		/**
	     * show stream details on top 
	     */
	    showDetails: function(eventName){
	    	eventName.preventDefault();
	    	$('.show-info').toggle(100);
	    	
	    },
	    renderRightContenetsOfSelectedStream: function(){
	    	alert(45);
	    }
		
		
	})
	return MyStreamView;
});

