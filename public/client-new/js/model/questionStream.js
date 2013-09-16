define(['baseModel', 
				'../collection/questionStreams', 
				'model/onlineuser'
				], function(BaseModel, QuestionStreams, OnlineUser) {
	var QuestionStream = BaseModel.extend({ 
		objName: 'questionStream',

		init: function() {
			this.on('change:streamId', this.createQuestionList);
			this.set('questionStreams', new QuestionStreams());
			this.set('currentQuestionStream', new QuestionStreams());
			//this.on('change:currentFilter', this.updateCurrentStream());
			this.setLoggedInUser();
			console.log(this);
		},

		setLoggedInUser: function(){
			this.set('onlineUser', new OnlineUser());
			var that = this;
			var requestURL = 'http://localhost:9000/loggedInUserJson';
			this.get('onlineUser')
				.fetch({url: requestURL});
		},

		setQuestionStreamId: function(streamId){
			this.set('streamId', streamId);
		},

		setCurrentFilter: function(newFilter){
			this.set('currentFilter', newFilter);
		},

		updateCurrentStream: function(){
			var that = this;

			var updatedStream = that.get('questionStreams').filter(function(model){
				if(that.get('currentFilter') === 'unanswered'){
					return model.get('question').answered === false;
				}
				if(that.get('currentFilter') === 'answered'){
					return model.get('question').answered === true;
				}
				if(that.get('currentFilter') === 'myQuestions'){
					// TODO: figure out logged in user
					return false;
				}
			});
			this.get('currentQuestionStream').reset(updatedStream);
			console.log('this is the current stream', this.get('currentQuestionStream'));
		},

		createQuestionList: function(){
			var requestURL = 'http://localhost:9000/getAllQuestionsForAStream/' + this.get('streamId') + '/rock/20/1';
			var that = this;
			this.get('questionStreams')
					.fetch({url: requestURL, 
									success: function(){ 
										that.updateCurrentStream();
										console.log('coll fetch', that.get('questionStreams')); 
									}
								});
		}

	});
			 
	return QuestionStream;
});
