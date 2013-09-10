define(['baseView', 
	      'text!templates/questionStream.tpl'
        ], 
	function(BaseView, questionStreamTPL){
	var QuestionStreamView;
	QuestionStreamView = BaseView.extend({
		objName: 'QuestionStreamView',
		events:{
			// 'click #streamTab a': 'tabHandler',
			// 'click #show-info' :'showDetails'
		},
		// messagesPerPage: 10,
		// pageNo: 1,
		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);
			
			console.log('questionStreamView: init called!');

			this.render();
		},

		render: function(){
			var compiledTemplate = Handlebars.compile(questionStreamTPL);
			this.$el.html(compiledTemplate);
		}
		
		/**
	     * show stream details on top 
	     */
	    // showDetails: function(eventName){
	    // 	eventName.preventDefault();
	    // 	$('.show-info').toggle(100);
	    	
	    // },
	    // tabHandler: function(e){
	    // 	var tabId=$(e.target).attr('href').replace('#',''), view;	    	

	    // 	if(tabId=='discussionsView'){ 
    		
	    // 		/* fetch all messages of a stream for messageListView */
	    // 		view = this.getViewById('messageListView');
	    // 		if(view){
	    // 			view.myStreams = this.getViewById('sidebar').myStreams;
	    			
	    // 			view.data.url="/allMessagesForAStream/"+this.getViewById('sidebar').streamId+"/date/"+view.messagesPerPage+"/"+view.pageNo+"/week";
	    // 			view.fetch();
	    		
	    // 		}
	    // 	}
	    // 	if(tabId=="questionsView"){ 
    		
	    // 		/* fetch all messages of a stream for messageListView */
	    // 		view = this.getViewById('questionListView');
	    // 		if(view){
	    // 			view.myStreams = this.getViewById('sidebar').myStreams;
	    			
	    // 			view.data.url="/getAllQuestionsForAStream/"+this.getViewById('sidebar').streamId+"/date/"+view.messagesPerPage+"/"+view.pageNo;
	    // 			view.fetch();
	    		
	    // 		}
	    // 	}


	    // }
		
		
	})
	return QuestionStreamView;
});