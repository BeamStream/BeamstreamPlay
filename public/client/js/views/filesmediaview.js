BS.FilesMediaView = Backbone.View.extend({

	events: {
	       "click a#file-type" : "showFilesTypes",
	       "click ul.file-type li a" : "hideList",
	       "click '.nav a" : "addActive",
           "click #go_button" : "uploadFile",
//               "click #profile-images":"listProfileImages",
           "click .google_doc" : "showDocPopup",
           "click .filter-options li a" : "filterDocs"
	      
	 },
	
    initialize:function () {
     	var type = "files";
        var profileView = new BS.ProfileView();
     	profileView.getProfileImages(type);
        
        this.docsList();   
        
        console.log('Initializing Files and Media  View');
        
        this.source = $("#tpl-files-media").html();
        this.template = Handlebars.compile(this.source);
		
                
     //   this.template= _.template($("#tpl-files-media").html());

        
    },

    render:function (eventName) {
        $(this.el).html(this.template);
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
       
         var documentModel = new BS.Document();
         documentModel.set({
                docName : 'doc3',
                docURL : $("#upload-media").val(),
                docAccess: 'Public',
                docType: 'GoogleDocs'
          });
          var documentData = JSON.stringify(documentModel);
          
          
            $.ajax({
                    type : 'POST',
                    url : BS.docUpload,
                    data : {
                            data : documentData
                            },
                    dataType : "json",
                    success : function(data) {
                        if(data.status == 'Failure')
                                console.log("Failed.Please try again");
                            else
                                console.log("Doc Uploaded Successfully");
                    }
            });
  
     },
     
        docsList : function()
        {
            var i = 1;
            $('#content').children().detach();
            $('#school-popup').children().detach();
            var self = this;
            BS.user.fetch({ success:function(e) {

                /* get profile images for user */
              $.ajax({
                        type : 'POST',
                        url :  BS.getAllDocs,
                        data : {
                           'userId': e.attributes.id.id
                                },
                        dataType : "json",

                        success : function(docs) {
                            
                            
                              _.each(docs, function(doc) {
                                  
                                 var datVal =  self.formatDateVal(doc.creationDate);
                      var content = '<div class="image-wrapper hovereffect google_doc" id="'+doc.id.id+'"><input type="hidden" id="id-'+doc.id.id+'" value="'+doc.url+'"><div class="comment-wrapper comment-wrapper2"><a href="#" class="tag-icon" data-original-title="Search by Users"></a><a href="#" class="hand-icon"></a><a href="#" class="message-icon"></a><a href="#" class="share-icon"></a></div><h4>'+doc.name+'</h4><p>The Power of The Platform Behance Network Join The Leading Platform For </p><h5> Title & Description</h5><span>State</span><span class="date">'+datVal+'</span> </div><div class="comment-wrapper comment-wrapper1"> <a class="common-icon link" href="#"><span class="right-arrow"></span></a><ul class="comment-list"><li><a class="eye-icon" href="#">87</a></li><li><a class="hand-icon" href="#">5</a></li><li><a class="message-icon" href="#">10</a></li></ul></div>'; 
                      $('#file-docs-'+i).html(content);
                      
                      i++;
                              });
                        }
               });

            }});

           // $('#content').html(BS.listDocsView.el);
        },
        
        /*
         * Format date and returns 
         */
        formatDateVal: function(dateVal)
        {
            var m_names = new Array("January", "February", "March", 
            "April", "May", "June", "July", "August", "September", 
            "October", "November", "December");

                            var d = new Date(dateVal);
                            var curr_date = d.getDate();
                            var curr_month = d.getMonth() + 1; //Months are zero based
                            var curr_year = d.getFullYear();
                           return curr_date + " " + m_names[curr_month] + ", " + curr_year;
        },
        
        /**
         * Edited By Aswathy @TODO
         * For Doc popups
         */
        showDocPopup :function(eventName){
        	
        	var docId = eventName.currentTarget.id;
        	var docUrl = $('input#id-'+docId).val();
    		newwindow=window.open(docUrl,'','height=500,width=800,top=100,left=250');
        	 
        },
        /**
         * filter docs.. and prevent default action
         */
        filterDocs :function (eventName){
        	eventName.preventDefault();
        }
        
});

