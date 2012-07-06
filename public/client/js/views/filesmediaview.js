BS.FilesMediaView = Backbone.View.extend({

	events: {
	       "click a#file-type" : "showFilesTypes",
	       "click ul.file-type li a" : "hideList",
	       "click '.nav a" : "addActive"
	      
	 },
	
    initialize:function () {
    	 
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
	 }
});
