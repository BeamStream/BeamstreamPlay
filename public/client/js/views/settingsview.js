BS.SettingsView = Backbone.View.extend({

	events: {
                 
       "click .delete-streams" : "deleteStreams"
	      
	 },
	
    initialize:function () {       
     	 	
        console.log('Initializing Settings  View');
        
        this.source = $("#tpl-settings").html();
        this.template = Handlebars.compile(this.source);
        
    },

    render:function (eventName) {
    	this.getStreams();
        $(this.el).html(this.template);
        return this;
    },
    /**
     * get all streams
     */
    getStreams :function(){
    	$('#streamslist').html('');
    	 var self =this;
        /* get all streams  */
		 $.ajax({
				type : 'GET',
				url : BS.allStreamsForAUser,
				dataType : "json",
				success : function(datas) {
					
					 var streams ='';
					 var classStreams ='';
					 _.each(datas, function(data) {
						 
							 
	 						streams+='<tr><td>'+data.streamName+'</td><td><a class="stream-edit" href="#" id ="'+data.id.id+'">Edit</a></td><td><a class="delete-streams" href="#" id="'+data.id.id+'" name="'+data.streamName+'">Delete</a></td></tr>';
	 						
					 });
					 
					 $('#streamslist').html(streams);

             
				}
		 });
    },
    /**
     * delete streams
     */
    deleteStreams :function (eventName){
    	eventName.preventDefault();
    
    	var streamId = eventName.target.id;
    	var streamName = eventName.target.name;
    	BS.streamActionView = new BS.StreamActionView();
		BS.streamActionView.render(streamId,streamName);
 		$('#action-popup').html(BS.streamActionView.el);
 		
 		
    	 
    }
    
        
});

