define([
	'collection/baseCollection', 
	'../model/question'], function(BaseCollection, Question) {
	var QuestionStreams = BaseCollection.extend({ 
		model: Question,
		objName: 'questionStreams',

		initialize: function(){
			this.on('statusChangeModel', this.updateEditStatus, this);
			this.on('questionAnsweredModel', this.questionAnswered, this);
			this.on('questionModelDelete', this.questionDeleted, this);
			this.on('change:questionRock', this.sort, this);
			this.counter = 0;
		},

		// sort models as they're added by how many upvotes they have
		comparator: function(question){
			return - question.get('question').rockers.length;
		}, 

		// adds the current onlineUser id and whether a question was asked
		// by that user and whether it was rocked by that user
		// this is used in the template to know what to render
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
				question.set({'onlineUser': onlineUserId}, {silent: true});
				var onlineUserAsked = question.get('question').userId.id === onlineUserId ? true : false;
				question.set({'onlineUserAsked': onlineUserAsked}, {silent: true});
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
		},

		questionDeleted: function(){
			this.trigger('questionDeletedCol');
		}

	});

	return QuestionStreams;
});