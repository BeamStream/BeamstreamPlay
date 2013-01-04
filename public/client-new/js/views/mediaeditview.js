/***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 20/September/2012
	 * Description           : Backbone view to edit Files/Media title and description 
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */

	BS.MediaEditView = Backbone.View.extend({
   
		events: {
			
			"click #sveeditdoc" : "savedocs",   
			"click #edit-close" : "close"
		
		},
		
        initialize:function () {
        	
            this.source = $("#document-edit-tpl").html();
            this.template = Handlebars.compile(this.source);
        },
        
        /**
        * render gdocs edit screen
        */
        render:function (datas) {
        	
            $(this.el).html(this.template(datas));
            this.docdatas=datas;
            return this;        
        },
        
        /**
        * NEW THEME - function to save the edited tile and description 
        */
        savedocs:function(eventName){
        	
            eventName.preventDefault(); 
            var self = this;
            
            if($("#media-title").val().match(/^[\s]*$/) || $("#media-description").val().match(/^[\s]*$/))
            {
            	alert("Please fill all fields");
            	return;
            }
            	
            /* for all other documents */
            if (this.docdatas.type=='Docs') {
            	$.ajax({
	                type : 'POST',
	                url : BS.savedocedit,
	                data : {
	                	
	                	docName : $("#media-title").val(),
	                	documentId : this.docdatas.id,
	                	docDescription : $("#media-description").val()
	                },
	                dataType : "json",
	                success : function(data) {
	                    var content = '';
	                    if(data.status == 'Failure')
	                    {
	                        alert("Failed.Please try again");
	                    }
	                    else
	                    {

	                            alert("Doc Edit Successfully"); 
                                      $('#description-'+data[0].id.id+'').text(data[0].documentDescription);
                                      $('#name-'+data[0].id.id+'').text(data[0].documentName);
                                      $('#edit-bootstrap_popup').modal('hide');   


	                     }
	                 }           
	             });                        
            }
            /* for Usermedia (Images /Videos */
            else if(this.docdatas.type=='UserMedia')
            {
            	$.ajax({
            		type : 'POST',
	                url : BS.changeTitleDescriptionUserMedia,
	                data : {
	                	
	                	mediaName : $("#media-title").val(),
	                	userMediaId : this.docdatas.id,
	                	mediaDescription : $("#media-description").val()
                   	},
	                dataType : "json",
	                success : function(data) {
	                    var content = '';
	                    if(data.status == 'Failure')
	                    {
	                        alert("Failed.Please try again");
	                    }
	                    else

	                        {
	                            alert("Edit Successfully");
	                            
                                    	$('#description-'+data[0].id.id+'').text(data[0].description);
                                    	$('#name-'+data[0].id.id+'').text(data[0].name); 

//                                    $('#bootstrap_popup').modal('hide');
                                    $('#edit-bootstrap_popup').modal('hide');   
	                        }
	                    }           
	                });  
                }
        },           
        
        /**
        * NEW THEME - function to close the gdocs edit screen
        */
        close:function(eventName){
        	
//      	var docId = eventName.currentTarget.id;
//            var mediatype = $("#edittype").val(); 
//            eventName.preventDefault(); 
//          $('#gdocedit').children().detach();    
          //$('#bootstrap_popup').modal({show:false});
//            $('#bootstrap_popup').modal('hide')  

        }
        
});
