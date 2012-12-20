BS.CropImageView = Backbone.View.extend({

	events: {
		 'click .close-button1' : "closeScreen",
		 'click #crop':"cropImage",
	 },
	
    initialize:function () {
    	
        console.log('Initializing CropImageView');
		this.source = $("#image-crop-tpl").html();
		this.template = Handlebars.compile(this.source);
    },

     
    
    /**
     * render school Info screen
     */
    render:function (image) {
    	 
    	$(this.el).html(this.template({"image":image}));
        return this;
        
        
    },
    /**
     * close popup
     * */
    closeScreen :function(eventName){
    	 
	   	 eventName.preventDefault();
	   	 var parentPage = $('#new-school-popup').attr('name');
	   	 // close the popup and go to its parent page
	   	 $('#image-crop-popup').children().detach(); 
	   	 
    },
    
    /**
     * close popup
     * */
    cropImage :function(eventName){
    	 
	   	 eventName.preventDefault();
	   	 if (parseInt($('#w').val())){
	   		$('#image-crop-popup').children().detach(); 
		 }
	   	 else
	   	 {
	   		 alert('Please select a crop region and submit.');
		 
		 }
	   	 
	   	 
    },
    
  
    
});
