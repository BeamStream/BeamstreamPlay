define([
	'collection/baseCollection', 
	'../model/question'], function(BaseCollection, Question) {
	var QuestionStreams = BaseCollection.extend({ 
		model: Question,
		objName: 'questionStreams',

		initialize: function(){
			this.on('change:editStatus', function(question){
				this.trigger('statusChange', {editStatus: question.get('editStatus')});
			}, this);
		},

		comparator: function(question){
			return - question.get('question').rockers.length;
		}, 

		updateCollection: function(models){
			var that = this;
			var counter = 0;
			_.each(models, function(newQuestion){
				that.each(function(currentQuestion){
					if (currentQuestion.get('question').id.id === newQuestion.get('question').id.id &&
							currentQuestion.get('comments').length === newQuestion.get('comments').length &&
							currentQuestion.get('question').answers.length === newQuestion.get('question').answers.length &&
							currentQuestion.get('question').rockers.length === newQuestion.get('question').rockers.length){
						counter++;
					} else if (counter === that.length - 1) {
						that.add(newQuestion);
						counter = 0;
					}
				})
			})
		}

	});

	return QuestionStreams;
});