define(['baseModel', 
	      '../collection/unansweredQuestions', 
	      '../collection/answeredQuestions', 
	      '../collection/myQuestions', 
	      ], function(BaseModel, UnansweredQuestions, AnsweredQuestions, MyQuestions) {
	var QuestionStream = BaseModel.extend({ 
		objName: 'questionStream',

		init: function() {
			this.on('change:streamId', this.getQuestions);
		},

		setQuestionStreamId: function(streamId){
			this.set('streamId', streamId);
		},

		getQuestions: function(){
			console.log('from get questions', this.get('streamId'));
			//var streamId = this.get('streamId');
			var that = this;

			var requestURL = 'http://localhost:9000/getAllQuestionsForAStream/' + this.get('streamId') + '/rock/20/1';

      // if statement prevents unecessary requests when streamId is undefined on page load
      if(this.get('streamId')){
				$.get(requestURL, function(data){
	        var results = [];
	        for(var i = 0; i < data.length; i++){
	        	console.log(data[i].question);
	        	results.push(data[i].question);
	        }
	        // that.set('sampleQuestion', results[0].questionBody);
	        // //console.log(that.get('sampleQuestion'));
	        // that.set('unansweredQuestions', new UnansweredQuestions());
	        // console.log(that.get('unansweredQuestions'));
	        // that.get('unansweredQuestions').add(results);
	        // console.log(that.get('unansweredQuestions'));
				});
			}
		}
		// unansweredQuestions: new UnansweredQuestions,
		// answeredQuestions: new AnsweredQuestions,
		// myQuestions: new MyQuestions

	});
       
	return QuestionStream;
});