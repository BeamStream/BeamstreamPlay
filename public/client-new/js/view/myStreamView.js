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
			'click .addpoll' : 'addPollOptionsArea',
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
			eventName.preventDefault();
			
			this.options = 2;
			$('#pollArea').show(); 
		},
		
		
		
		hide:function(eventName){
			eventName.preventDefault();
			
			this.options = 2;
			$('#pollArea').hide(); 
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
