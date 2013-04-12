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
        ], function(FormView, 
        		MediaEditTpl 
        		){
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
         * @TODO render the edit view popup
         */
        render: function(){
        	console.log(this.model);
        	compiledTemplate = Handlebars.compile(MediaEditTpl);
        	$(this.el).html(compiledTemplate(JSON.parse(JSON.stringify(this.data))));
        	
        },
		
//		displayPage: function(callback){
//			console.log("displayPage");
//		},
		
		/**
		 * edit title and description of files
		 */
		editDocDetails: function(e){
			e.preventDefault();
			this.saveForm();
		}
	})
	return MediaEditView;
});
