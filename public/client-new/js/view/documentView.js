/***
* BeamStream
*
* Author                : Aswathy P.R (aswathy@toobler.com)
* Company               : Toobler
* Email:                : info@toobler.com
* Web site              : http://www.toobler.com
* Created               : 12/April/2013
* Description           : View for showing uploaded documents
* ==============================================================================================
* Change History:
* ----------------------------------------------------------------------------------------------
* Sl.No.  Date   Author   Description
* ----------------------------------------------------------------------------------------------
*
* 
*/


define(['view/formView',
        'text!templates/document.tpl',
        ], function(FormView, DocumentTpl){
	var DocumentView;
	DocumentView = FormView.extend({
		objName: 'DocumentView',
		

		onAfterInit: function(){
            this.data.reset();
        },
        
        /**
         * @TODO render the edit view popup
         */
        render: function(){
        	compiledTemplate = Handlebars.compile(DocumentTpl);
        	$(this.el).html(compiledTemplate(JSON.parse(JSON.stringify(this.data))));
//        	$(this.el).html(compiledTemplate({docName: "Hai" , docUrl : "https://s3.amazonaws.com/BeamStream/1fe37f93-db9e-4a70-bcf5-e92859be2203sample.pdf"}));
        },

	})
	return DocumentView;
});
