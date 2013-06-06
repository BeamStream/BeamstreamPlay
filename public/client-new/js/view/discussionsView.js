define(['view/formView',
        'view/messageListView',
        'view/messageItemView',
        'model/discussion',
        // '../../lib/jquery.preview.full.min',
        '../../lib/extralib/jquery.embedly.min',
        'text!templates/discussionComment.tpl',
        '../../lib/bootstrap-modal'
        ], function(FormView, MessageListView, MessageItemView ,DiscussionModel, JqueryEmbedly ,DiscussionComment ,Bootstrap){
	var Discussions;
	Discussions = FormView.extend({
		objName: 'Discussion',
		
		events:{
			 'click #post-button' : 'postMessage',
			 'click #share-discussions li a' : 'actvateShareIcon',
			 'click #private-to' : 'checkPrivateAccess',
			 'click #sortBy-list' : 'sortMessages',
			 'click #date-sort-list' : 'sortMessagesWithinAPeriod',
	  		 'keypress #sort_by_key' : 'sortMessagesByKey',
			 'click #discussion-file-upload li' : 'uploadFiles',
			 'click #private-to-list li' :'selectPrivateToList',
			 'keypress #msg-area' : 'postMessageOnEnterKey',
			 'change #upload-files-area' : 'getUploadedData',
			 
			 
		 },

		 messagesPerPage: 10,
		 pageNo: 1,
		 	
		
		 
		 onAfterInit: function(){	
			var self=this;
            this.data.reset();
            this.selected_medias = [];
            $('#main-photo').attr('src',localStorage["loggedUserProfileUrl"]);

            this.urlRegex1 = /(https?:\/\/[^\s]+)/g;
	     	this.urlRegex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	     	this.urlRegex2 =  /^((http|https|ftp):\/\/)/;

            // this.urlRegex2 =  /^((http|https|ftp):\/\/)/,
            // this.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i;
            this.file = '';
            this.setupPushConnection();
            this.msgSortedType ='';

            /* pagination */
            $(window).bind('scroll', function (ev) {

            	var activeTab = $('.stream-tab li.active').attr('id');
            	if(activeTab=='discussion'){
				
					var scrollTop =$(window).scrollTop();
					var docheight = $(document).height();
					var widheight = $(window).height();
					if(scrollTop + 1 == docheight- widheight || scrollTop == docheight- widheight){
				 	   var t = $('#messageListView').find('div.content');
					   if(t.length != 0)
					   {
					   		
					   		// var msgSortedType = $('#sortBy-select').attr('value');
							$('#discussion-pagination').show();
							var streamId = $('.sortable li.active').attr('id');

							view = self.getViewById('messageListView');
						
							if(self.msgSortedType == "date")
							{    
								self.pageNo++;
					    		if(view){
					    			
					    			self.data.url="/allMessagesForAStream/"+streamId+"/date/"+view.messagesPerPage+"/"+self.pageNo;
					    			self.appendMessages();
					    		}
							}
							else if(self.msgSortedType == "rock")
							{    
								self.pageNo++;
					    		if(view){
					    			
					    			self.data.url="/allMessagesForAStream/"+streamId+"/rock/"+view.messagesPerPage+"/"+self.pageNo;
					    			self.appendMessages();
					    		}
							}
							else if(self.msgSortedType == "keyword")
							{    
								var keyword = $('#sort_by_key').val();
								self.pageNo++;
					    		if(view){
					    			
					    			self.data.url="/allMessagesForAStream/"+streamId+"/"+keyword+"/"+view.messagesPerPage+"/"+self.pageNo;
					    			self.appendMessages();
					    		}
							}

							
					   }
					 }
					else
					{
						  $('.page-loader').hide();
					}
				}
			 });  
		 },

	  	
		 
		 /**
		 * append messages to message list on pagination 
		 */
		 appendMessages : function(){
		 	var self =this;
		 	this.data.fetch({
				success : function(data, models) {

					
					if(models.status == "Failure"){

						$('.page-loader').hide();

					}else if(models.length != 0){ 

					  	/* render messages */
						$('.page-loader').hide();
						_.each(models, function(model) {

			        		$('#discussion-pagination').hide();
			        		var discussionModel = new DiscussionModel();
			        		discussionModel.set({message :model.message ,
		        								comments :model.comments,
		        								docDescription : model.docDescription,
		        								docName : model.docName,
		        								followed : model.followed,
		        								followerOfMessagePoster : model.followerOfMessagePoster,
		        								profilePic : model.profilePic,
		        								rocked : model.rocked
							
											 	})

							var messageItemView  = new MessageItemView({model : discussionModel});
							$('#messageListView div.content').append(messageItemView.render().el);

		        		});
					}
		        	
				}
			});
		 },

        /**
         * post messages 
         */
        postMessage: function(){
        	
        	var self = this;
 	        var streamId =  $('.sortable li.active').attr('id');
 	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
 	        var message = $('#msg-area').val();
// 	        if(message){
 	        	//get message access private ? / public ?
 		        var messageAccess ,googleDoc = false;
 		        var msgAccess =  $('#private-to').attr('checked');
 		        var privateTo = $('#select-privateTo').attr('value');
 			    if(msgAccess == "checked"){
 			    	
 			    	if(privateTo == "privateToSchool"){
 			    		messageAccess = "PrivateToSchool";
 			    	}
 			    	else{
 			    		messageAccess = "PrivateToClass";
 			    	}
 			    	 
 			    }
 			    else{
 			  	    messageAccess = "Public";
 			    }
 			    
 			    var trueUrl='';
 			    if(streamId){
 			    	
 			    	/* if there is any files for uploading  */ 
 			        if(this.file ){
 			        	
 			        	$('.progress-container').show();
 			        	
 			        	/* updating progress bar */ 
 			        	this.progress = setInterval(function() {
	                    	
 			        		this.bar = $('.bar'); 			        		
	                        if (this.bar.width()>= 194) {
	                            clearInterval(this.progress);
		    		        } 
	                        else 
	                        {
	                        	this.bar.width( this.bar.width()+8);
	                        }
	                        this.bar.text( this.bar.width()/2 + "%"); 
	                        
	                    }, 800);
 			        	
 			        	var data;
 			            data = new FormData();
 			            data.append('docDescription',message);
 			            data.append('docAccess' ,messageAccess);
 			            data.append('docData', self.file);  
 			            data.append('streamId', streamId); 
 			            data.append('uploadedFrom', "discussion"); 
 			            
 			           /* post profile page details */
 			            $.ajax({
 			            	type: 'POST',
 			                data: data,
 			                url: "/uploadDocumentFromDisk",
 			                cache: false,
 			                contentType: false,
 			                processData: false,
 			                dataType : "json",
 			                success: function(data){
 			                	
 			    				// set progress bar as 100 %
 			                	self.bar = $('.bar');  
 			                	
 			                	self.bar.width(200);
 			                	self.bar.text("100%");
 		                        clearInterval(self.progress);
 		                            
 		                        $('#msg-area').val("");
 		                        $('#uploded-file').hide();
 		                       
 			              	    self.file = "";
 			              	    
 			              	    $('#file-upload-loader').css("display","none");
 			              	    
 			              	    var datVal = formatDateVal(data.message.timeCreated);
 			  	                
 			              	    var datas = {
 		  	                		"data" : data,
 		  	                		"datVal" :datVal
 			              	    }	
 			              	    
 			  	                $('.progress-container').hide();
 			  	                $('#uploded-file-area').hide();
 			  	                
 			  	                
 			  	                // set the response data to model
 			  	                self.data.models[0].set({message : data.message,
 			  	                	                     docName : data.docName, 
 			  	                	                     docDescription: data.docDescription,
 			  	                	                     profilePic: data.profilePic })

 			  	               
 			  	                /* Pubnub auto push */
 			  	                PUBNUB.publish({
 			  	                	channel : "stream",
 			  	                	message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:self.data.models[0]}
 			  	                }) 
 			  	                
	                            // show the uploaded file on message llist
		 			    		var messageItemView  = new MessageItemView({model : self.data.models[0]});
		 						$('#messageListView div.content').prepend(messageItemView.render().el);
		 						
		 						self.selected_medias = [];
			                    $('#share-discussions li.active').removeClass('active');
		 						
 		                    }
 		                }); 
 			        	
 			        }
 			        else{
 			        	
		        	 	if(message.match(/^[\s]*$/))
 			        		 return;
		        	 	
		        	 	//find link part from the message
		        	 	message = $.trim(message);
		  		        var link =  message.match(self.urlRegex); 
		  		        if(link){
		  		        	if(!self.urlRegex2.test(link[0])) {
		  		        		urlLink = "http://" + link[0];
		  		  	  	    }
		  		    	    else
		  		    	    {
		  		    	    	urlLink =link[0];
		  		    	    }
		  	                 
		  	                var msgBody = message ,link =  msgBody.match(self.urlRegex);                             
		  	                var msgUrl=  msgBody.replace(self.urlRegex1, function(msgUrlw) {
		  	                    trueurl= msgUrlw;                                                                  
		  	                    return msgUrlw;
		  	                });
		  	                
		  	                //To check whether it is google docs or not
		  	                if(!urlLink.match(/^(https:\/\/docs.google.com\/)/))   
		  	                {
		  	                	// check the url is already in bitly state or not 
		  	                	if(!urlLink.match(/^(http:\/\/bstre.am\/)/))
		  	                    {                                     
		  	                		/* post url information */                           
	  	                            $.ajax({
	  	                            	type : 'POST',
		  	                            url : 'bitly',
		  	                            data : {
		  	                            	link : urlLink
		  	                            },
		  	                            dataType : "json",
		  	                            success : function(data) {                                      
	                                         message = message.replace(link[0],data.data.url);
	                                         self.postMessageToServer(message,streamId,messageAccess,googleDoc);
		  	                            }
	  	                             });
	  	                         }
	  	                         else
	  	                         {  
	  	                        	 self.postMessageToServer(message,streamId,messageAccess,googleDoc);
	  	                         }
	                 		 }  //doc
		  	                 else    //case: for doc upload
		  	                 {     
		  	                 	googleDoc = true;
	  	                	 	self.postMessageToServer(message,streamId,messageAccess,googleDoc);
		  	                 }
	                     }
		                 //case: link is not present in message
		                 else
		                 {             
		                	 self.postMessageToServer(message,streamId,messageAccess,googleDoc);
		                 }
 			        	
 			        }
	 			  
 			    }
// 	        }
		    
        },
        
        /**
         * set message data to model and posted to server 
         */
        postMessageToServer: function(message,streamId,messageAccess,googleDoc){
        	var self = this;
        	if(googleDoc == true){

        		this.data.models[0].removeAttr('message');
        		this.data.models[0].removeAttr('profilePic');
        		this.data.models[0].removeAttr('followed');
        		this.data.models[0].removeAttr('followerOfMessagePoster');
        		this.data.models[0].removeAttr('rocked');

        		this.data.models[0].removeAttr('messageAccess');
        		// this.data.models[0].removeAttr('rocked');

        		this.data.url = "/newDocument";

        		// set values to model
			    this.data.models[0].save({streamId : streamId, docName :message, docAccess:messageAccess ,docURL:message , docType: 'GoogleDocs', docDescription: ''},{
			    	success : function(model, response) {
			    					    		
			    		/* PUBNUB -- AUTO AJAX PUSH */ 
			    		PUBNUB.publish({
			    			channel : "stream",
			    			message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:self.data.models[0]}
			    		}) 
			    		

			    		// show the uploaded file on message llist
 			    		var messageItemView  = new MessageItemView({model : self.data.models[0]});
 						$('#messageListView div.content').prepend(messageItemView.render().el);
 						
 						/* share widget */ 						
  				    	 if(self.selected_medias.length != 0){
				    	 	 _.each(self.data.models[0], function(data) {
				    	 		 showJanrainShareWidget(self.data.models[0].attributes.message.messageBody, 'View my Beamstream post', 'http://beamstream.com', self.data.models[0].attributes.message.messageBody ,self.selected_medias);
				    	 	 });
  				    	 }
						
			    		/* delete default embedly preview */
			    		$('div.selector').attr('display','none');
			    		$('div.selector').parents('form.ask-disccution').find('input[type="hidden"].preview_input').remove();
			    		$('div.selector').remove();
			    		$('.preview_input').remove();
			    		$('#msg-area').val("");
			    		$('#share-discussions li.active').removeClass('active');
			    		self.selected_medias = [];						
			    		
			    	},
			    	error : function(model, response) {
			    		$('#msg-area').val("");
			    	}
			    	
			    });
			    

        	}else{
        		this.data.models[0].removeAttr('docAccess');
        		this.data.models[0].removeAttr('docDescription');
        		this.data.models[0].removeAttr('docName');
        		this.data.models[0].removeAttr('docType');
        		this.data.models[0].removeAttr('docURL');
        		this.data.models[0].removeAttr('followed');
        		this.data.models[0].removeAttr('followerOfMessagePoster');
        		this.data.models[0].removeAttr('rocked');
        		this.data.models[0].removeAttr('profilePic');


        		this.data.url = "/newMessage";
			    // set values to model
			    this.data.models[0].save({streamId : streamId, message :message, messageAccess:messageAccess},{
			    	success : function(model, response) {
			    		
			    		/* PUBNUB -- AUTO AJAX PUSH */ 
			    		PUBNUB.publish({
			    			channel : "stream",
			    			message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:self.data.models[0]}
			    		}) 
			    		
			    		// show the posted message on feed
			    		var messageItemView  = new MessageItemView({model : self.data.models[0]});
						$('#messageListView div.content').prepend(messageItemView.render().el);
						
						/* share widget */ 						
  				    	 if(self.selected_medias.length != 0){
				    	 	 _.each(self.data.models[0], function(data) {				    	 		 
				    	 		 showJanrainShareWidget(self.data.models[0].attributes.message.messageBody, 'View my Beamstream post', 'http://beamstream.com',self.data.models[0].attributes.message.messageBody ,self.selected_medias);
				    	 	 });
  				    	 }
						
			    		/* delete default embedly preview */
			    		$('div.selector').attr('display','none');
			    		$('div.selector').parents('form.ask-disccution').find('input[type="hidden"].preview_input').remove();
			    		$('div.selector').remove();
			    		$('.preview_input').remove();
			    		$('#msg-area').val("");
			    		$('#share-discussions li.active').removeClass('active');
			    		self.selected_medias = [];
			    		
			    	},
			    	error : function(model, response) {
			    		$('#msg-area').val("");
			    	}

			    });
			    
        	}

        	
        },
        
        
        /**
	     * post message on enter key
	     */
	    postMessageOnEnterKey: function(eventName){
	    	
	    	var self = this;
	    	
			if(eventName.which == 13) {
				self.postMessage(); 
			}
			if(eventName.which == 32){
				var text = $('#msg-area').val();
				var links =  text.match(this.urlRegex); 
				 /* create bitly for each url in text */
				self.generateBitly(links);
			}
    	},
        
        /**
         * activate share icon on selection
         */
        actvateShareIcon: function(eventName){
        	
        	eventName.preventDefault();
        	var self=this;
        	$('#private-to').attr('checked',false);
        	$('#select-privateTo').text("Public");
        	$('#select-privateTo').attr('value', 'public');
        	
        	if($(eventName.target).parents('li').hasClass('active'))
        	{
        		self.selected_medias.remove($(eventName.target).parents('li').attr('name'));
        		$(eventName.target).parents('li').removeClass('active');
        	}
        	else
        	{
        		self.selected_medias.push($(eventName.target).parents('li').attr('name'));
        		$(eventName.target).parents('li').addClass('active');
        	}
        	
        },
        
        /**
         *select Private / Public ( social share ) options 
         */
        checkPrivateAccess: function (eventName) {
        	var streamName = $('.sortable li.active').attr('name');
        	
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
         *  Sort Messages/Discussions
         */
        sortMessages: function(eventName){
        	
        	eventName.preventDefault();
        	var self = this;
        	var streamId = $('.sortable li.active').attr('id');
        	var sortKey = $(eventName.target).attr('value');
        	this.msgSortedType = sortKey;
        	this.pageNo = 1;
        	/* render the message list */
        	view = this.getViewById('messageListView');
    		if(view){
    			

    			view.data.url="/allMessagesForAStream/"+streamId+"/"+sortKey+"/"+view.messagesPerPage+"/"+view.pageNo;
    			view.fetch();
    			
//    			view.fetch({'streamId': streamId, 'sortBy': sortKey, 'messagesPerPage': this.messagesPerPage, 'pageNo': this.pageNo});

    		}

			$('#sortBy-select').text($(eventName.target).text());
			$('#sortBy-select').attr('value',sortKey);
        },


        /**
		 *  sort messages by keyword
		 */
	 	sortMessagesByKey :function(eventName){
			
			 var self = this;
			 this.pageNo = 1;
			 var streamId = $('.sortable li.active').attr('id');
			 var keyword = $('#sort_by_key').val();
	 		 if(eventName.which == 13) {
	 		 	self.msgSortedType = "keyword";
	 			eventName.preventDefault();
	 			if(keyword){
	 				/* render the message list */
		        	view = this.getViewById('messageListView');
		    		if(view){
		    			
		    			view.data.url="/allMessagesForAStream/"+streamId+"/"+keyword+"/"+view.messagesPerPage+"/"+view.pageNo;
		    			view.fetch();
		    			
		    		}
	 			}
 			 	
				
			 } 
		 },

        
        /**
         * sort messages within a period 
         */
        sortMessagesWithinAPeriod: function(eventName){
        	
        	eventName.preventDefault();
        	$('#date-sort-select').text($(eventName.target).text());
        },
        
        /**
   	  	* show  Upload files option when we select category
   	  	*/
   	 	uploadFiles: function(eventName){
   	 		
   	 		eventName.preventDefault();
   	 		$('#upload-files-area').click();
	   		  
   	 	},
   	 	
   	 	/**
         * select private to class options
         */
        selectPrivateToList: function(eventName){
        	
        	eventName.preventDefault();
        	$('#select-privateTo').text($(eventName.target).text());
        	$('#select-privateTo').attr('value', $(eventName.target).attr('value'));
        	//uncheck private check box when select Public
        	if($(eventName.target).attr('value') == "public")
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
    	 * generate bitly and preview for url
    	 */
    	generateBitly: function(links){
    		var self = this;
    		if(links)
			{
				if(!self.urlRegex2.test(links[0])) {
					urlLink = "http://" + links[0];
			  	}
		     	else
		     	{
		    		urlLink =links[0];
		     	}
					 
				//To check whether it is google docs or not
				if(!urlLink.match(/^(https:\/\/docs.google.com\/)/))  
	            { 
					/* don't create bitly for shortened  url */
					if(!urlLink.match(/^(http:\/\/bstre.am\/)/))
					{
						/* create bitly  */
						$.ajax({
			    			type : 'POST',
			    			url : "bitly",
			    			data : {
			    				 link : urlLink 
			    			},
			    			dataType : "json",
			    			success : function(data) {
			    				 var msg = $('#msg-area').val();
			    				 message = msg.replace(links[0],data.data.url);
			    				 $('#msg-area').val(message);
					    				
			    			}
			    		});
                                                
                        var preview = {
                            // Instead of posting to the server, send the object to display for
                            // rendering to the feed.
                            submit : function(e, data){
                              e.preventDefault();
                              
                            }
                        }

						// $('#msg-area').preview({key:'4d205b6a796b11e1871a4040d3dc5c07'});
					          
			        }
	            }
		    }
    	},
    	
        /**
         * get files data to be upload
         */
        getUploadedData: function(e){
        	
        	var self = this;;
    	    file = e.target.files[0];
    	    var reader = new FileReader();
    	      
        	/* capture the file informations */
            reader.onload = (function(f){
            	self.file = file;
            	self.bar = $('.bar');        //progress bar
                self.bar.width('');
                self.bar.text("");
                clearInterval(self.progress);
            	
            	$('#file-name').html(f.name);
            	$('#uploded-file-area').show();
            	
            })(file);
 
            // read the  file as data URL
            reader.readAsDataURL(file);

        },
        
        
        /**
	     * PUBNUB real time push
	     */
		 setupPushConnection: function() {
			 var self = this;
			 self.pagePushUid = Math.floor(Math.random()*16777215).toString(16);
			 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
			 var trueUrl='';
			
			 /* for message posting */
			 PUBNUB.subscribe({
				 channel : "stream",
				 restore : false,
				 callback : function(message) {
					 var streamId = $('.sortable li.active').attr('id');

					 if (message.pagePushUid != self.pagePushUid)
					 { 
					 	
						 if(message.streamId==streamId)
			       		 	{
							   /* set the values to Discussion model */
							   discussionModel = new DiscussionModel();
							   discussionModel.set({
								   docDescription :message.data.docDescription,
								   docName : message.data.docName,
								   message : message.data.message,
								   messageAccess : message.data.messageAccess,
								   profilePic : message.data.profilePic,
								   streamId : message.data.streamId,
								   followerOfMessagePoster : message.data.followerOfMessagePoster
							   })
							    // show the posted message on feed
							 	var messageItemView  = new MessageItemView({model :discussionModel});
		 						$('#messageListView div.content').prepend(messageItemView.render().el);
			       		 	}
				 	   }
			 
			 	   }
		 	   })
		 	   
		 	   
		 	  /* auto push functionality for comments */
		 	   PUBNUB.subscribe({
	
		 		   channel : "comment",
		 		   restore : false,
	
		 		   callback : function(message) { 
	    	  
		 			   if(message.pagePushUid != self.pagePushUid)
		 			   {
		 			   	
		 				   if(!document.getElementById(message.data.id.id))
		 				   {
		 					 
		 					$('#'+message.parent+'-addComments').slideUp(200);
		 			  		
		 				    /* display the posted comment  */
		 		    		var compiledTemplate = Handlebars.compile(DiscussionComment);
		 		    		$('#'+message.parent+'-allComments').prepend(compiledTemplate({data:message.data, profileImage:message.profileImage}));
		 		    		
		 		    		if(!$('#'+message.parent+'-allComments').is(':visible'))
		 					{  
		 						$('#'+message.parent+'-msgRockers').slideUp(1);
		 						$('#'+message.parent+'-newCommentList').slideDown(1);
		 						$('#'+message.parent+'-newCommentList').prepend(compiledTemplate({data:message.data, profileImage:message.profileImage}));
		 						
		 					}
		 		    		message.cmtCount++; 
		 		    		$('#'+message.parent+'-show-hide').text("Hide All");
		 					$('#'+message.parent+'-totalComment').text(message.cmtCount);

	 				   	   }
 			   		   }
 		   		   }
	
 	   		   })
 	   		   
 	   		   /* for Comment Rocks */
	   		   PUBNUB.subscribe({
	
	   			   channel : "commentRock",
	   			   restore : false,
	   			   callback : function(message) { 
	   				   if(message.pagePushUid != self.pagePushUid)
	   				   {   	  
	   					   $('div#'+message.messageId+'-newCommentList').find('a#'+message.commentId+'-mrockCount').html(message.data);
	   					   $('div#'+message.messageId+'-allComments').find('a#'+message.commentId+'-mrockCount').html(message.data);
	   				   }
	   			   }
	   		   })
	   		   
	   		    /* for message Rocks */
 	   		   PUBNUB.subscribe({
		
 	   			   channel : "msgRock",
 	   			   restore : false,
 	   			   callback : function(message) {
 	   				   if(message.pagePushUid != self.pagePushUid)
 	   				   {   	  
 	   					   $('#'+message.msgId+'-msgRockCount').find('span').html(message.data);
 	   				   }
		   		   }
	   		   })

	   		    /* for updating user count of stream */
 	   		   PUBNUB.subscribe({
		
 	   			   channel : "classMembers",
 	   			   restore : false,
 	   			   callback : function(message) {
 	   				   if(message.pagePushUid != self.pagePushUid)
 	   				   {   	  
 	   					   $('span#'+message.data.stream.id.id+'-users').html(message.data.stream.usersOfStream.length);
 	   				   }
		   		   }
	   		   })

	   		    /* for delete message  case*/
 	   		   PUBNUB.subscribe({
		
 	   			   channel : "deleteMessage",
 	   			   restore : false,
 	   			   callback : function(message) {
 	   				   if(message.pagePushUid != self.pagePushUid)
 	   				   {   	  
 	   				   	
 	   					   $('div#'+message.messageId).remove();
 	   				   }
		   		   }
	   		   })

	   		    /* for delete comment  case*/
 	   		   PUBNUB.subscribe({
		
 	   			   channel : "deleteComment",
 	   			   restore : false,
 	   			   callback : function(message) {

 	   				   if(message.pagePushUid != self.pagePushUid)
 	   				   {   	  
 	   				   	   
   					  		var commentCount = $('#'+message.messageId+'-totalComment').text()

   					  		$('div#'+message.messageId+'-newCommentList').find('div#'+message.commentId).remove();
   					  		$('div#'+message.messageId+'-allComments').find('div#'+message.commentId).remove();
	                		$('#'+message.messageId+'-totalComment').text(commentCount-1);
 	   				   }
		   		   }
	   		   })
	    		 
		 	   
 		},
        
	})
	return Discussions;
});