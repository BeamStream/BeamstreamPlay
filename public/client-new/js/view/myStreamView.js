define(['pageView',
        'view/streamSliderView', 
        'view/overView', 
        'view/discussionsView', 
        'view/questionsView', 
        'view/deadlinesView', 
        'view/calendarView',
        'view/messageListView',
        'text!templates/privateToList.tpl',
        ], 
	function(PageView, StreamSliderView, OverView, DiscussionsView, QuestionsView, DeadlinesView, CalendarView ,MessageListView , PrivateToListTpl){
	var MyStreamView;
	MyStreamView = PageView.extend({
		objName: 'MyStreamView',
		events:{
			'click #streamTab a': 'tabHandler',
			'click #show-info' :'showDetails'
		},
		messagesPerPage: 10,
		pageNo: 1,
		init: function(){
			
			this.addView(new StreamSliderView({el: '#sidebar'}));
			this.addView(new OverView({el: $('#overView')}));
			this.addView(new DiscussionsView({el: $('#discussionsView')}));
			this.addView(new QuestionsView({el: $('#questionsView')}));
			this.addView(new DeadlinesView({el: $('#deadlinesView')}));
			this.addView(new CalendarView({el: $('#calendarView')}));
			
			this.addView(new MessageListView({el: $('#messageListView')}));
			
		},
		
		/**
	     * show stream details on top 
	     */
	    showDetails: function(eventName){
	    	eventName.preventDefault();
	    	$('.show-info').toggle(100);
	    	
	    },
	    tabHandler: function(e){
	    	var tabId=$(e.target).attr('href').replace('#',''), view;
	    	
	    	
	    	if(tabId=='discussionsView' || tabId=="questionsView"){ 
    		
	    		/* fetch all messages of a stream for messageListView */
	    		view = this.getViewById('messageListView');
	    		if(view){
	    			view.myStreams = this.getViewById('sidebar').myStreams;
	    			
	    			view.data.url="/allMessagesForAStream/"+this.getViewById('sidebar').streamId+"/date/"+view.messagesPerPage+"/"+view.pageNo;
	    			view.fetch();
	    			
//	    			view.data.url="/allMessagesForAStream";
//	    			view.fetch({'streamId': this.getViewById('sidebar').streamId, 'sortBy': 'date', 'messagesPerPage': view.messagesPerPage, 'pageNo': view.pageNo});

	    		}
	    	}
	    }
		
		
	})
	return MyStreamView;
});

