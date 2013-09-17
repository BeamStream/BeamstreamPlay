define([
	'collection/baseCollection', 
	'../model/question'], function(BaseCollection, Question) {
	var QuestionStreams = BaseCollection.extend({ 
		model: Question,
		objName: 'questionStreams',

		comparator: function(question){
			return - question.get('question').rockers.length;
		}

	});

	return QuestionStreams;
});