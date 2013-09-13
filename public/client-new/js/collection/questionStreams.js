define([
	'collection/baseCollection', 
	'../model/question'], function(BaseCollection, Question) {
	var QuestionStreams = BaseCollection.extend({ 
		model: Question,
		objName: 'questionStreams',

	});

	return QuestionStreams;
});