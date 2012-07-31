BS.FilesMediaView = Backbone.View.extend({

	events: {
	       "click a#file-type" : "showFilesTypes",
	       "click ul.file-type li a" : "hideList",
	       "click '.nav a" : "addActive",
           "click #go_button" : "uploadFile",
//               "click #profile-images":"listProfileImages"
	      
	 },
	
    initialize:function () {

   	var type = "files";
   	    var profileView = new BS.ProfileView();
     	profileView.getProfileImages(type);
     	  
        console.log('Initializing Files and Media  View');
        this.template= _.template($("#tpl-files-media").html());
        
        
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    
    
    /**
     * show file types
     */
    showFilesTypes :function(eventName){
    	
    	eventName.preventDefault();
    	$('.file-type').slideDown();
    	
    },
    
    /**
     * hide file types
     */
    hideList : function(eventName){
    	
    	eventName.preventDefault();
    	$('.file-type').slideUp();
    	
    },
    //TODO
    addActive : function(eventName){
		 var id = eventName.target;
		 var $this = $(id);
		console.log( $this);
	     if (!$this.is('.dropdown-toggle')) {
	         $this
	             .closest('ul')
	                 .find('li').removeClass('active').end()
	             .end()
	             .closest('li').addClass('active');
	     }
	 },
         
       /*
        * Author:Cuckoo Anna on 09July2012
        * For Uploading docs
        * docType can be one of "GoogleDocs", "YoutubeVideo", "Other".
        * docAccess can be one of "Private", "Public", "Restricted", "Stream".
        */  
     uploadFile : function()
     {
         /* post the documents details */
         
         var fileModel = new BS.File();
         fileModel.set({
        	 		docID:111,
              		docName : 'doc1',
              		docURL : $("#upload-media").val(),
                    docAccess: 'Public',
                    docType: 'GoogleDocs'
          		});
              	var fileData = JSON.stringify(fileModel);
         
            $.ajax({
                    type : 'POST',
                    url : BS.docUpload,
                    data : {
                            data : fileData
                    },
                    dataType : "json",
                    success : function(data) {
                            alert("Doc Uploaded Successfully");
                    }
            });
     },
     
      
});
