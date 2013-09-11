define(['baseModel', 
	      '../collection/unansweredQuestions', 
	      '../collection/answeredQuestions', 
	      '../collection/myQuestions', 
	      ], function(BaseModel, UnansweredQuestions, AnsweredQuestions, MyQuestions) {
	var QuestionStream = BaseModel.extend({ 
		objName: 'questionStream',
		init: function() {
			console.log(this);
			this.unansweredQuestions = new UnansweredQuestions;
			console.log(this.unansweredQuestions);
			// this.answeredQuestions = new AnsweredQuestions;
			// this.myQuestions = new MyQuestions;
			this.getQuestions();
		},

    // right now stream id is hard coded -- need to figure out most reliable way of getting this
		getQuestions: function(){
			$.get('http://localhost:9000/getAllQuestionsForAStream/522e81f20364200d65a1b0d6/rock/20/1', function(data){
        console.log(data);
			});
		}
		// unansweredQuestions: new UnansweredQuestions,
		// answeredQuestions: new AnsweredQuestions,
		// myQuestions: new MyQuestions

	});
       
	return QuestionStream;
});