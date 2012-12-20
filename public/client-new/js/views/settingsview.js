 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/August/2012
	 * Description           : Backbone view for setting view
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */

	BS.SettingsView = Backbone.View.extend({
	
		events: {
	                 
	       "click .delete-streams" : "deleteStreams",
	//       "change #upload-files" :"selectSheets",
	//       "click #upload": "uploadSheets",
		      
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
	 		
	    },
	    
	    /**
	     * select school Sheets
	     */
	    selectSheets : function(e){
	   	  
			 var self = this;;
			 file = e.target.files[0];
			
			 var reader = new FileReader();
			    
			 /* capture the file informations */
			 reader.onload = (function(f){
			       	 
			   self.sheet = file;
			   return function(e){ 
			   };
			  })(file);
			        
			  // read the image file as data URL
			  reader.readAsDataURL(file);
	        
	    },
	    
	    /**
	     * upload school Sheets
	     */
	    uploadSheets :function(eventName){
	    	eventName.preventDefault();
	    	    
			var data;
	    	data = new FormData();
	 	    data.append('schoolSheet', this.sheet);
	 	     console.log(data);
	 		
	    	/* post profile page details */
	    	$.ajax({
	    	    type: 'POST',
	    	    data: data,
	    	    url: BS.saveProfile,
	    	    cache: false,
	    	    contentType: false,
	    	    processData: false,
	    	    success: function(data){
	    	    	
	    	     
	    	    }
	    	});
	    	 
	    }
	});

