BS.StreamActionView = Backbone.View.extend({

	
	events: {
	      "click #cancel": "cancel",
	      "click #Ok" : "confirm"
	       
	 },
	
    initialize:function () {
  
        console.log('Initializing stream action View');
        this.source = $("#tpl-stream-action").html();
		this.template = Handlebars.compile(this.source);
        
        
    },

    render:function (streamId,streamName) {
    	console.log(streamName)
        $(this.el).html(this.template({"streamId" :streamId ,"streamName" :streamName}));
        return this;
    },
    /**
     * cancel action 
     */
    cancel :function(eventName){
    	eventName.preventDefault();
    	$('#action-popup').children().detach();
    },
    confirm :function(eventName){
    	eventName.preventDefault();
    	var deleteStream =false,removeAccess =false;
    	var value = $('input[name=sAction]:checked').val();
    	if(value == "all")
    	{
    		deleteStream =true;
    	}
    	if(value == "my")
    	{
    		removeAccess = true;
    	}
    	var streamId =$('#streamId').val();
    	 
    	var result=confirm("Are you sure ?");
    	if(result == true)
    	{
    		/* post data with school and class details */
			$.ajax({
				type : 'POST',
				url : BS.deleteStream,
				data : {
					StreamId : streamId,
					deleteStream : deleteStream,
					removeAccess : removeAccess
					
				},
				dataType : "json",
				success : function(data) {
					$('#action-popup').children().detach();
				}
			});
    	}
    	else
    	{
    		
    	}
     
    }
     
  
  
});
