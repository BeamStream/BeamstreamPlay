/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 23/February/2013
* Description           : View for adding a new school to beamstream
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView'], function(FormView){
	var newSchoolView;
	newSchoolView = FormView.extend({
		objName: 'newSchoolView',
		
		events:{
	         'click #addSchool' : 'addNewSchool'
		},

		onAfterInit: function(){	
			this.data.reset();
	        
        },
        /**
         * add new school to beamstream
         */
        addNewSchool: function(e){
        	e.preventDefault();
        	this.saveForm();
        }
        
 
	})
	return newSchoolView;
});