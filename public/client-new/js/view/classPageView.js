/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 26/March/2013
* Description           : View for class page contents
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['pageView', 'view/streamSliderView', 'view/classView'], 
	function(PageView, StreamSliderView, ClassView){
	var ClassPageView;
	ClassPageView = PageView.extend({
		objName: 'ClassPageView',
		events:{
		},
		init: function(){
			this.addView(new StreamSliderView({el: '#sidebar'}));
			this.addView(new ClassView({el: $('#classView')}));
		},
		
	
		
		
	})
	return ClassPageView;
});

