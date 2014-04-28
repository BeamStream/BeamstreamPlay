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
			//this.get('currentQuestionStream').on('questionAnsweredCol', this.restartInterval, this);
			//this.get('currentQuestionStream').on('questionDeletedCol', this.restartInterval, this);
			this.setLoggedInUser();
			//this.set({'intervalId': setInterval(this.createQuestionList.bind(this), 100)}, {silent: true});
			// this is unused code from an attempt to use pubnub
			//this.on('change:pagePushUid', this.getQuestionsFromPubNub);
		},
		setLoggedInUser: function(){
			this.set('onlineUser', new OnlineUser());
			var that = this;
			var requestURL = '/loggedInUserJson';
			this.get('onlineUser')
				.fetch({url: requestURL});
		},

		setQuestionStreamId: function(streamId){
			this.set('streamId', streamId);
		},

		setCurrentFilter: function(newFilter){
			this.set('currentFilter', newFilter);
			this.createQuestionList();
			if (this.get('searchStatus')){
				this.set({searchStatus: false}, {silent: true});
			}
		},

		// controls pausing of server updates while text boxes are open
		updateEditStatus: function(event){
			if (event.editCounter > 0) {
				clearInterval(this.get('intervalId'));
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
		},
		

		// controls pausing of server updates while searching
		setSearchStatus: function(){
			this.set({searchStatus: true}, {silent: true});
			clearInterval(this.get('intervalId'));
		},

		// handles the server request for all question data
		createQuestionList: function(){
			if((this.get('streamId')) != null  || (this.get('streamId')) != undefined){
			var requestURL = '/getAllQuestionsForAStream/' + this.get('streamId') + '/date/10/1';
			var that = this;
			this.get('questionStreams')
					.fetch({url: requestURL,
									success: function(){ 
										that.get('questionStreams').addRockedByUser(that.get('onlineUser').get('id').id);
										that.updateCurrentStream();
									}
								});
			}
		}, 
		/*restartInterval: function(){
			if (!this.get('searchStatus')){
				this.set({'intervalId': setInterval(this.createQuestionList.bind(this), 10000)}, {silent: true});
			}
		}*/
	});
	return QuestionStream;
});
