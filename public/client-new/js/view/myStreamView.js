define(['pageView', 'view/streamSliderView', 'view/overView', 'view/discussionsView', 'view/questionsView', 'view/deadlinesView', 'view/calendarView'], 
	function(PageView, StreamSliderView, OverView, DiscussionsView, QuestionsView, DeadlinesView, CalendarView){
	var MyStreamView;
	MyStreamView = PageView.extend({
		objName: 'MyStreamView',
		events:{
			'click #streamTab a': 'tabHandler',
			'click #show-info' :'showDetails'
		},
		messagesPerPage: 10,
		pageNo: 0,
		init: function(){
			this.addView(new StreamSliderView({el: '#sidebar'}));
			this.addView(new OverView({el: $('#overView')}));
			this.addView(new DiscussionsView({el: $('#discussionsView')}));
			this.addView(new QuestionsView({el: $('#questionsView')}));
			this.addView(new DeadlinesView({el: $('#deadlinesView')}));
			this.addView(new CalendarView({el: $('#calendarView')}));
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
	    		view = this.getViewById(tabId);
	    		if(view){
	    			view.data.url="/allMessagesForAStream";
	    			view.fetch({'streamId': this.getViewById('sidebar').streamId, 'sortBy': 'date', 'messagesPerPage': this.messagesPerPage, 'pageNo': this.pageNo});
	    		}
	    	}
	    }
		
		
	})
	return MyStreamView;
});

