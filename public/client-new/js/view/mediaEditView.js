/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 10/April/2013
* Description           : View for editing title and description  of uploaded files
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView',
        'text!templates/editMedia.tpl',
        ], function(FormView, MediaEditTpl ){
	var MediaEditView;
	MediaEditView = FormView.extend({
		objName: 'MediaEditView',
		
		events:{
	        'click #editDoc' : 'editDocDetails'
		},

		onAfterInit: function(){
            this.data.reset();
        },

		/**
		 * edit title and description of files
		 */
		editDocDetails: function(e){
			e.preventDefault();
        	// set data url 
        	this.data.models[0].set({'id':$('#docId').val()});
        	this.data.models[0].set({'docName':$('#docName').val()});
        	this.data.models[0].set({'docDescription':$('#docDescription').val()});
        	
        	this.data.url="/document";
        	this.saveForm({});
		},

		 /**
         * edit and update document title and description
         */
        success: function(model, data){
        	var self =this;
			if(data.status == 'Failure')
            {
                alert("Failed.Please try again");
            }
            else
            {

                alert("Doc Edit Successfully"); 
                self.data.models[0].clear();
              	$('#editMedia').modal("hide");


             }

		},
	})
	return MediaEditView;
});
