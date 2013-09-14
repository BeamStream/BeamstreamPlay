define(['baseModel', 
	      '../collection/questionStreams'
	      ], function(BaseModel, QuestionStreams) {
	var QuestionStream = BaseModel.extend({ 
		objName: 'questionStream',

		init: function() {
			this.on('change:streamId', this.createQuestionList);
			this.set('questionStreams', new QuestionStreams());
			this.set('currentQuestionStream', new QuestionStreams());
			//this.on('change:questionStreams', this.updateCurrentStream());
			console.log(this);
		},

		setQuestionStreamId: function(streamId){
			this.set('streamId', streamId);
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