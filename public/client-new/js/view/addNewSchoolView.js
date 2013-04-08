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
        
        /**
         * add new school to beamstream
         */
        addNewSchool: function(e){
        	
        	e.preventDefault();
        	// set data url 
        	this.data.models[0].set({'schoolName':$('#new-school').val()});
        	this.data.url="/school";
        	this.saveForm();
        },
        
        /**
         * add new school success
         */
        success: function(model, data){
			if(data != "School Already Exists"){
				/** @TODO  keep the school details */ 
				$('#schoolName').val(this.data.models[0].get('schoolName'));
				$('#associatedSchoolId').attr('value',this.data.models[0].get('id'));
				$('#newSchoolModal').modal("hide");
			}
			else{
				alert(data);
			}
			
			$('#new-school').val('');
        	$('#schoolWebsite').val('');


		},
        
 
	})
	return newSchoolView;
});