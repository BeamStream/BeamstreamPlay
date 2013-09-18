define([
	'baseView', 
	'text!templates/questionStreamItem.tpl'
], 
function(BaseView, questionStreamItemTPL){
	var QuestionStreamItem = BaseView.extend({
		objName: 'questionStreamItem', 

		events: {
			'click .rock-icon': 'rockQuestion', 
			'click .comment': 'toggleCommentText',
			'click .answer': 'toggleQuestionText', 
			'keypress .question-stream-answer': 'submitAnswer', 
			'keypress .question-stream-comment': 'submitComment'
		}, 

		initialize: function(){
			BaseView.prototype.initialize.apply(this, arguments);

		},

		render: function(){
			var compiledTemplate = Handlebars.compile(questionStreamItemTPL);
			this.$el.html(compiledTemplate(this.model.attributes));
			return this;
		}, 

		rockQuestion: function(){
			this.model.rockQuestion();
		}, 

		toggleCommentText: function(){
			this.$el.find('.question-stream-comment').toggleClass('question-stream-hide', 'question-stream-show');
		}, 

		toggleQuestionText: function(){
			this.$el.find('.question-stream-answer').toggleClass('question-stream-hide', 'question-stream-show');
		}, 

		submitAnswer: function(e){
			if (e.keyCode === 13) {
				var answerSubmission = this.$el.find('.question-stream-answer').val();
				console.log(answerSubmission);
				this.$el.find('.question-stream-answer').val('');
			}
		}, 

		submitComment: function(e){
			if (e.keyCode === 13) {
				var commentSubmission = this.$el.find('.question-stream-comment').val();
				console.log(commentSubmission);
				this.$el.find('.question-stream-comment').val('');
			}
		}

	});

	return QuestionStreamItem;
});