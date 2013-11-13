define(['pageView',
        'view/streamSliderView', 
        'view/overView', 
        'view/discussionsView', 
        'view/questionsView', 
        'view/deadlinesView', 
        'view/calendarView',
        'view/messageListView',
        'view/questionListView',
        'view/questionStreamView'
        ], 
	function(PageView, StreamSliderView, OverView, DiscussionsView, QuestionsView, DeadlinesView, CalendarView ,MessageListView ,QuestionListView ,QuestionStreamView ){
	var MyStreamView;
	MyStreamView = PageView.extend({
		objName: 'MyStreamView',
		events:{
			'click #streamTab a': 'tabHandler',
			'click #show-info' :'showDetails',
			'click #question' : 'addPollOptionsArea',
			'click .ques' : 'hide'
		},
		messagesPerPage: 10,
		pageNo: 1,
		init: function(){
			
			var currentStreamView = new StreamSliderView({el: '#sidebar'})
			this.addView(currentStreamView);

			this.addView(new DiscussionsView({el: $('#discussionsView')}));

			var currentMainQuestionStream = new QuestionsView({el: $('#questionsView')});
			this.addView(currentMainQuestionStream);

			this.addView(new DeadlinesView({el: $('#deadlinesView')}));
			this.addView(new CalendarView({el: $('#calendarView')}));
			
			this.addView(new MessageListView({el: $('#messageListView')}));
			this.addView(new QuestionListView({el: $('#questionListView')}));

			var currentQuestionStream = new QuestionStreamView({el: $('#questionStreamView')});
      this.addView(currentQuestionStream);
      
      // on streamId change, notify the questionStream
			currentStreamView.on('change:streamId', function(evt){
				currentQuestionStream.model.setQuestionStreamId(evt.streamId);
			});

			// // on pagePushUid change, notify the questionStream
			// currentMainQuestionStream.on('change:pagePushUid', function(evt){
			// 	currentQuestionStream.model.setPagePushUid(evt.pagePushUid);
			// 	console.log('pagePushUid changed', evt.pagePushUid);
			// })
			
		},
		
		/**
	     * show stream details on top 
	     */
	    showDetails: function(eventName){
	    	eventName.preventDefault();
	    	$('.show-info').toggle(100);
	    	
	    },
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    addPollOptionsArea: function(eventName){
	    	/*eventName.preventDefault();			
			this.options = 2;
			$('#pollArea').show(); */
			
			$('.question-button').text("ADD");
			$('.add-poll').hide();
			
			
			$('textarea#Q-area').addClass('showpolloption');
			$('textarea#Q-area').attr('placeholder','Click here to add a poll ....');
			
		},
		
		
		
		hide:function(eventName){
			/*eventName.preventDefault();			
			this.options = 2;*/
			$('#pollArea').hide(); 			
			$('.question-button').text("ASK");
			$('.add-poll').hide();
			
			$('textarea#Q-area').removeClass('showpolloption');
			$('textarea#Q-area').attr('placeholder','Ask your own question here.....');
		},
		
postQuestion: function(eventName){
			
			
			// upload file 
	        var self = this;
	        var streamId =  $('.sortable li.active').attr('id');
	        var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
	        var question = $('#Q-area').val();
	        
	      
	        //get message access private ? / public ?
	        var questionAccess,googleDoc = false;
	        var queAccess =  $('#Q-private-to').attr('checked');
	        var privateTo = $('#Q-privateTo-select').text();
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
		            data.append('docDescription',question);
		            data.append('docAccess' ,questionAccess);
		            data.append('docData', self.file);  
		            data.append('streamId', streamId); 
		            data.append('uploadedFrom', "question"); 
 			            
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
	                            
	                        $('#Q-area').val("");
	                        $('#uploded-file').hide();
	                       
		              	    self.file = "";
		              	    
		              	    $('#file-upload-loader').css("display","none");
		              	    
		              	    var datVal = formatDateVal(data.question.timeCreated);
		  	                
		              	    var datas = {
	  	                		"data" : data,
	  	                		"datVal" :datVal
		              	    }	
		              	    
		  	                $('.progress-container').hide();
		  	                $('#Q-file-area').hide();
		  	                
		  	                
		  	                // set the response data to model
		  	                self.data.models[0].set({question : data.question,
		  	                	                     docName : data.docName, 
		  	                	                     docDescription: data.docDescription,
		  	                	                     profilePic: data.profilePic })

		  	               
		  	                // /* Pubnub auto push */
		  	                // PUBNUB.publish({
		  	                // 	channel : "stream",
		  	                // 	message : { pagePushUid: self.pagePushUid ,streamId:streamId,data:self.data.models[0]}
		  	                // }) 
							
							var questionItemView  = new QuestionItemView({model : self.data.models[0]});
							$('#questionListView div.content').prepend(questionItemView.render().el);
			  	               
							self.file = "";
	 						
	 						self.selected_medias = [];
		                    $('#share-discussions li.active').removeClass('active');
	 						
		                    }
	                }); 
	                    
		        	self.file = "";
		        	
		        }
		        else{


		        	if(question.match(/^[\s]*$/))
 			        		 return;
		        	 	
		        	 	//find link part from the message
		        	 	question = $.trim(question);
		  		        var link =  question.match(self.urlReg); 

		  		        if(!link)
		  		        	link =  question.match(self.website); 

		  		        if(link){
		  		        	if(!self.urlRegex2.test(link[0])) {
		  		        		urlLink = "http://" + link[0];
		  		  	  	    }
		  		    	    else
		  		    	    {
		  		    	    	urlLink =link[0];
		  		    	    }
		  	                 
		  	                var questionBody = question ,link =  questionBody.match(self.urlReg); 

		  	                if(!link)                            
		  	                	link =  questionBody.match(self.website);

		  	                var questionUrl=  questionBody.replace(self.urlRegex1, function(questionUrlw) {
		  	                    trueurl= questionUrl;                                                                  
		  	                    return questionUrl;
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
	                                         question = question.replace(link[0],data.data.url);
	                                         self.postQuestionToServer(question,streamId,questionAccess,googleDoc);

		  	                            }
	  	                             });
	  	                         }
	  	                         else
	  	                         {  
	  	                         	self.postQuestionToServer(question,streamId,questionAccess,googleDoc);
	  	                         }
	                 		 }  //doc
		  	                 else    //case: for doc upload
		  	                 {     
		  	                 	googleDoc = true;
		  	                 	self.postQuestionToServer(question,streamId,questionAccess,googleDoc);
	  	                	 	
		  	                 }
	                     }
		                 //case: link is not present in message
		                 else
		                 {    
		                 	self.postQuestionToServer(question,streamId,questionAccess,googleDoc);         
		                 }



		        	// self.postQuestionToServer(question,streamId,questionAccess);
		        }
		    }

		    

	         
		},
		
	    
	    
	    tabHandler: function(e){
	    	var tabId=$(e.target).attr('href').replace('#',''), view;	    	

	    	if(tabId=='discussionsView'){ 
    		
	    		/* fetch all messages of a stream for messageListView */
	    		view = this.getViewById('messageListView');
	    		if(view){
	    			view.myStreams = this.getViewById('sidebar').myStreams;
	    			
	    			view.data.url="/allMessagesForAStream/"+this.getViewById('sidebar').streamId+"/date/"+view.messagesPerPage+"/"+view.pageNo+"/week";
	    			view.fetch();
	    		
	    		}
	    	}
	    	if(tabId=="questionsView"){ 
    		
	    		/* fetch all messages of a stream for messageListView */
	    		view = this.getViewById('questionListView');
	    		if(view){
	    			view.myStreams = this.getViewById('sidebar').myStreams;
	    			
	    			view.data.url="/getAllQuestionsForAStream/"+this.getViewById('sidebar').streamId+"/date/"+view.messagesPerPage+"/"+view.pageNo;
	    			view.fetch();
	    		
	    		}
	    	}


	    }
		
		
	})
	return MyStreamView;
});
