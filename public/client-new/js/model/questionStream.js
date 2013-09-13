define(['baseModel', 
	      '../collection/questionStreams'
	      ], function(BaseModel, QuestionStreams) {
	var QuestionStream = BaseModel.extend({ 
		objName: 'questionStream',

		init: function() {
			this.on('change:streamId', this.createQuestionList);
			this.set('questionStreams', new QuestionStreams());
		},

		setQuestionStreamId: function(streamId){
			this.set('streamId', streamId);
		},

		createQuestionList: function(){
			var requestURL = 'http://localhost:9000/getAllQuestionsForAStream/' + this.get('streamId') + '/rock/20/1';
			var that = this;
      this.get('questionStreams')
          .fetch({url: requestURL, 
                  success: function(){ 
                  	console.log('coll fetch', that.get('questionStreams')); 
                  }
                });
		},

	});
       
	return QuestionStream;
});