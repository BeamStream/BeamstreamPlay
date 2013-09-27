define([
	'collection/baseCollection', 
	'../model/question'], function(BaseCollection, Question) {
	var QuestionStreams = BaseCollection.extend({ 
		model: Question,
		objName: 'questionStreams',

		initialize: function(){
			this.on('statusChangeModel', this.updateEditStatus, this);
			this.on('questionAnsweredModel', this.questionAnswered, this);
			this.on('change:questionRock', this.sort, this);
			this.counter = 0;
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
		}, 

		addRockedByUser: function(onlineUserId){
			var checkForId = function(array, id){
				for (var i = 0; i < array.length; i++){
					if(array[i].id === id) {
						return true;
					}
				}
				return false;
			}
			this.each(function(question){
				console.log('onlineUserId', onlineUserId);
				question.set({'onlineUser': onlineUserId}, {silent: true});
				if (checkForId(question.get('question').rockers, onlineUserId)){
					question.set('onlineUserRocked', true);
				} else {
					question.set('onlineUserRocked', false);
				}
			});
		}, 

		updateEditStatus: function(event){
			if (event.editStatus === true) {
				this.counter++;
			}
			if (event.editStatus === false) {
				this.counter--;
			}
			this.trigger('statusChange', {editCounter: this.counter});
		}, 

		questionAnswered: function(){
			this.trigger('questionAnsweredCol');
		}

	});

	return QuestionStreams;
});