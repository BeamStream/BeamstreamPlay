define(['baseModel', 
				'../collection/questionStreams', 
				'model/onlineuser'
				], function(BaseModel, QuestionStreams, OnlineUser) {
	var QuestionStream = BaseModel.extend({ 
		objName: 'questionStream',

		init: function() {
			var that = this;
			this.on('change:streamId', this.createQuestionList);
			this.set('questionStreams', new QuestionStreams());
			this.set('currentQuestionStream', new QuestionStreams());
			this.set('editStatus', false);
			this.set('searchStatus', false);
			this.get('currentQuestionStream').on('statusChange', this.updateEditStatus, this);
			this.get('currentQuestionStream').on('questionAnsweredCol', this.updateCurrentStream, this);
			this.get('currentQuestionStream').on('questionDeletedCol', this.updateCurrentStream, this);
			//the below is making things blinky
			//this.get('currentQuestionStream').on('save', this.createQuestionList, this);
			this.setLoggedInUser();
			console.log('set interval');
			this.set({'intervalId': setInterval(this.createQuestionList.bind(this), 10000)}, {silent: true});
			// this.on('change:pagePushUid', this.getQuestionsFromPubNub);
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
			if (this.get('searchStatus')){
				this.set({searchStatus: false}, {silent: true});
				this.restartInterval();
			}
		},

		updateEditStatus: function(event){
			if (event.editCounter > 0) {
				console.log('clear interval');
				clearInterval(this.get('intervalId'));
			} else {
				this.restartInterval();
			}
		},

		// this is getting the id for the pubnub stream
		// setPagePushUid: function(pagePushUid){
		// 	this.set('pagePushUid', pagePushUid);
		// },

		updateCurrentStream: function(searchQuery){
			var that = this;

			var updatedStream = that.get('questionStreams').filter(function(model){
				if(searchQuery){
					return model.get('question').questionBody.indexOf(searchQuery) !== -1;
				}
				else if(model.get('deleted')){
					return false;
				}
				else if(that.get('currentFilter') === 'unanswered'){
					return model.get('question').answered === false;
				}
				else if(that.get('currentFilter') === 'answered'){
					return model.get('question').answered === true;
				}
				else if(that.get('currentFilter') === 'myQuestions'){
					return model.get('question').userId.id === that.get('onlineUser').id.id;
				}
			});
			if (searchQuery){
				this.setSearchStatus();
			}
			this.get('currentQuestionStream').reset(updatedStream);
			this.get('currentQuestionStream').counter = 0;
			//this.get('currentQuestionStream').set(updatedStream);
			console.log('this is the current stream', this.get('currentQuestionStream'));
		},

		setSearchStatus: function(){
			console.log('clear interval');
			this.set({searchStatus: true}, {silent: true});
			clearInterval(this.get('intervalId'));
		},

		createQuestionList: function(){
			var requestURL = 'http://localhost:9000/getAllQuestionsForAStream/' + this.get('streamId') + '/date/50/1';
			var that = this;
			this.get('questionStreams')
					.fetch({url: requestURL,
									success: function(){ 
										that.get('questionStreams').addRockedByUser(that.get('onlineUser').get('id').id);
										that.updateCurrentStream();
									}
								});
		}, 

		restartInterval: function(){
			if (!this.get('searchStatus')){
				console.log('set interval');
				this.set({'intervalId': setInterval(this.createQuestionList.bind(this), 10000)}, {silent: true});
			}
		}

		// // this is not working -- it's unclear if pubnub is actually functioning for questions
		// getQuestionsFromPubNub: function(){
		// 	console.log('getQuestionsFromPubNub is being called');
		// 	PUBNUB.subscribe({
		// 		channel: 'questions', 
		// 		restore: true, 
		// 		callback: function(question){
		// 			console.log('getQuestionsFromPubNub', question);
		// 		},
		// 		error: function(data){
		// 			console.log('getQuestionsFromPubNub', data);
		// 		}
		// 	})
		// }

	});
			 
	return QuestionStream;
});
