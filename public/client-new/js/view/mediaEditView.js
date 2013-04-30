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


define(['view/formView'
        ], function(FormView ){
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

            if($('#docType').val() == 'Document')
                this.data.url="/document";
            else
                this.data.url="/changeTitleAndDescriptionUserMedia";
        	
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

                $('#description-'+data[0].id.id).text(data[0].documentDescription);
                $('#name-'+data[0].id.id+'').text(data[0].documentName);

              	$('#editMedia').modal("hide");


             }

		},
	})
	return MediaEditView;
});
