/***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 27/November/2012
	 * Description           : Backbone view for stream Questions page
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.QuestionView = Backbone.View.extend({
	
		events : {
			 "click #post-question" : "postQuestion",
			 "click #sortBy-list" : "sortQuestions",
			 "click #date-sort-list" : "sortQuestionsWithinAPeriod",
			 "click .add-poll " : "addPollOptionsArea",
			 "click .add-option" : "addMorePollOptions",
			 "click #private-to" : "checkPrivateAccess",
			 "click #private-to-list li" :"selectPrivateToList",
			 "click #share-discussions li a" : "actvateShareIcon",
			 "click #question-file-upload li " : "uploadFiles",
			 "change #upload-files-area" : "getUploadedData",
		},
	
		initialize : function() {
			
			console.log('Initializing QuestionView');
			this.source = $("#tpl-questions-middle-contents").html();
			this.template = Handlebars.compile(this.source);
			 
		},
		
		/**
		 * render class Info screen
		 */
		render : function(eventName) {
		    
			$(this.el).html(this.template);
			return this;
		},
		
		/**
		 * function for post questions 
		 */
		postQuestion: function(eventName){
			
			eventName.preventDefault();
			var question = $('#Q-area').val();
			 
			var streamId =  $('.sortable li.active').attr('id');
			 
			var questionAccess;
	        var queAccess =  $('#private-to').attr('checked');
	        var privateTo = $('#select-privateTo').text();
	        
		    if(queAccess == "checked")
		    {
		    	if(privateTo == "My School")
		    	{
		    		questionAccess = "PrivateToSchool";
		    	}
		    	else
		    	{
		    		questionAccess = "PrivateToClass";
		    	}
		    	
		    }
		    else
		    {
		    	questionAccess = "Public";
		    }
		    
		    var pollOptions ='';
		 
		    for (var i=1; i<= BS.options ; i++)
		    {
//		    	pollOptions.push($('#option'+i).val());
		    	pollOptions+= '"'+$('#option'+i).val()+'",' ;
		    	 
		    }
//		    pollOptions = JSON.stringify(myObject);
		    
       	 
//       	 var source = $("#tpl-questions_with_polls").html();
//       	 var template = Handlebars.compile(source);
//       	 $('#all-questions').prepend(template);
		    
//		    var questionModel = new BS.Question();
//		    questionModel.set({
//				
//				id : 1 ,     
//				questionBody : question,
//				streamId : streamId,
//				questionAccess : questionAccess,
//				pollsOptions: pollOptions
//			});
//		    
//		    var data = JSON.stringify(questionModel);
//		    console.log(data);
			/* post profile page details */
	         $.ajax({
	             type: 'POST',
	             data: {
	            	 questionBody : question,
	            	 streamId : streamId,
					 questionAccess :questionAccess,
					 pollsOptions: pollOptions
	             },
	             url: BS.newQuestion,
	             cache: false,
	             dataType : "json",
	             success: function(data){
	            	 
//	            	 $('#Q-area').val("");
//	            	 $('#pollArea').slideToggle(700); 
//	            	 $('#uploded-file').hide();
//	            	 
//	            	 
//	            	 var source = $("#tpl-questions_with_polls").html();
//	            	 var template = Handlebars.compile(source);
//	            	 $('#all-questions').prepend(template(datas));
	            	 
	             }
	         }); 
	         
		},
		
		/**
         * NEW THEME -  get uploaded files 
         */
        getUploadedData: function(e){
        	
        	var self = this;;
    	    file = e.target.files[0];
    	    var reader = new FileReader();
    	    
    	   
    	      
        	/* capture the file informations */
            reader.onload = (function(f){
            	self.file = file;
            	
            	$('#uploded-file').html(f.name);
            	$('#uploded-file').show();
            	
            })(file);
            
            
             
            // read the  file as data URL
            reader.readAsDataURL(file);
          
        },
        
        
		
		/**
         * NEW THEME - select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').text();
        	
        	if($('#private-to').attr('checked')!= 'checked')
        	{
        		$('#select-privateTo').text("Public");
            	
        	}
        	else
        	{
        		$('#select-privateTo').text(streamName);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        /**
         * NEW THEME - select private to class options
         */
        selectPrivateToList: function(eventName){
        	
        	eventName.preventDefault();
        	$('#select-privateTo').text($(eventName.target).text());
        	
        	//uncheck private check box when select Public
        	if($(eventName.target).text() == "Public")
        	{
        		$('#private-to').attr('checked',false);
        	}
        	else
        	{
        		$('#private-to').attr('checked',true);
        		$('#share-discussions li.active').removeClass('active');
        	}
        		
        },
        
        /**
         * NEW THEME - actvate share icon on selection
         */
        actvateShareIcon: function(eventName){
        	
        	eventName.preventDefault();
        	$('#private-to').attr('checked',false);
        	$('#select-privateTo').text("Public");
        	if($(eventName.target).parents('li').hasClass('active'))
        	{
        		$(eventName.target).parents('li').removeClass('active');
        	}
        	else
        	{
        		$(eventName.target).parents('li').addClass('active');
        	}
        	
        },

        /**
         * NEW THEME -show  Upload files option when we select category
         */
   		 uploadFiles: function(eventName){
   			 eventName.preventDefault();
   			 $('#upload-files-area').click();
   		 },
   	 
		/**
		 * click to view areas for adding poll options
		 */
		addPollOptionsArea: function(eventName){
			eventName.preventDefault();
			BS.options = 2;
			$('#pollArea').slideToggle(700); 
		},
		
		/**
		 * function  to add more poll options
		 */
		addMorePollOptions : function(eventName){
			
			eventName.preventDefault();
			BS.options++;
			if(BS.options == 3)
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add 3rd Poll Option" name="Add Option"> </li>';
			else
				var options ='<li><input type="text"   id="option'+BS.options+'" placeholder="Add '+BS.options+'th Poll Option" name="Add Option"> </li>';

			var parent = $('#add_more_options').parents('li');
			$('.answer li').last().after(options);
		 },
			
		/**
         *  NEW THEME - Sort questions
         */
		sortQuestions: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	$('#sortBy-select').text($(eventName.target).text());

        },
        
        /**
         * NEW THEME - sort questions within a period 
         */
        sortQuestionsWithinAPeriod: function(eventName){
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
	 
	  
	});
