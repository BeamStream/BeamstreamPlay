 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/August/2012
	 * Description           : Backbone view to manage streams Delete/edit..
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */

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
	    
	    /**
	     * confirm the stream action ( delete /edit  .. )
	     */
	    confirm :function(eventName){
	    	
	    	eventName.preventDefault();
	    	var deleteStream =false,removeAccess =false;
	    	var value = $('input[name=sAction]:checked').val();
	    	if(value)
	    	{
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
							if(data.status == "Success")
							{
								alert(data.message);
								$('#action-popup').children().detach();
								var settingsView = new BS.SettingsView();
								settingsView.getStreams();
							}
							
						}
					});
		    	}
		    	else
		    	{
		    		alert(data.message);
		    	}
	    	}
	    	else
	    	{
	    		alert("please select  one option");
	    	}
	     
	    }
	  
	});
