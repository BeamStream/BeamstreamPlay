/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 28/February/2013
* Description           : View for school drop down
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/

define(['view/formView','../../lib/bootstrap-select'], function(FormView , BootstrapSelect){
	var schoolDropView;
	schoolDropView = FormView.extend({
		objName: 'schoolDropView',
		
		events:{
	         'click #schoolId' : 'addNewSchool'
		},

		onAfterInit: function(){	
//			this.data.reset();
//			$('#schoolname').append('<option>'+this.data.models[0].get('schoolName')+'</option>');
//			$('.schoollist').selectpicker({
//	          style: 'register-select invite-selecter'
//			});
			
	        
        },
        
        onAfterRender: function(){
        	
        	$('.schoollist').selectpicker({
        		style: 'register-select invite-selecter'
        	});
			
        },
        
//        fetch:function(){
//        	
//        	this.data.fetch({
//				success: function(data){ 
//					console.log(data);
//				},
//				error: function(resp, status, xhr){
//					
//				}
//			});
//        	
//        	 
//        	for(i=1 ;i< 10 ;i++)
//        	{
//        		
//        		$('#schoolname').append('<option>sdsd</option>');
//        	}
//        	
//        }
        
        addNewSchool:function(){
        	alert(43);
//			console.log(this.data.models[0].get('schoolName'));
//			$('#schoolname').append('<option>'+this.data.models[0].get('schoolName')+'</option>');
//			$('.schoollist').selectpicker({
//	          style: 'register-select invite-selecter'
//			});

        }
        
        
 
	})
	return schoolDropView;
});