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
			//this.get('currentQuestionStream').on('statusChange', this.updateEditStatus, this);
			//this.on('change:currentFilter', this.updateCurrentStream());
			this.setLoggedInUser();
			console.log(this);
			// this.on('change:pagePushUid', this.getQuestionsFromPubNub);
			this.set('intervalId', setInterval(this.createQuestionList.bind(this), 10000));
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

		updateEditStatus: function(event){
			console.log(this);
			this.set('editStatus', event.editStatus);
			console.log('edit status from main stream');
		},

		// this is getting the id for the pubnub stream
		// setPagePushUid: function(pagePushUid){
		// 	this.set('pagePushUid', pagePushUid);
		// },

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
					return model.get('question').userId.id === that.get('onlineUser').id.id;
				}
			});
			this.get('currentQuestionStream').reset(updatedStream);
			//this.get('currentQuestionStream').set(updatedStream);
			console.log('this is the current stream', this.get('currentQuestionStream'));
		},

		createQuestionList: function(){
			var requestURL = 'http://localhost:9000/getAllQuestionsForAStream/' + this.get('streamId') + '/date/50/1';
			var that = this;
			this.get('questionStreams')
					.fetch({url: requestURL,
									success: function(){ 
										that.updateCurrentStream();
										console.log('coll fetch', that.get('questionStreams')); 
									}
								});
		}, 

		restartInterval: function(){
			this.set('intervalId', setInterval(this.createQuestionList.bind(this), 10000));
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
