define([
	'baseView', 
	'text!templates/questionStreamItem.tpl'
], 
function(BaseView, questionStreamItemTPL){
	var QuestionStreamItem = BaseView.extend({
		objName: 'questionStreamItem', 

		events: {
			'click .rock-icon': 'rockQuestion', 
			'click .qs-comment-link': 'toggleCommentText',
			'click .qs-answer-link': 'toggleQuestionText', 
			'keypress .qs-answer': 'submitAnswer', 
			'keypress .qs-comment': 'submitComment',
			'click .follow-question': 'followQuestion'
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
			this.$el.find('.qs-comment').toggleClass('question-stream-hide', 'question-stream-show');
			this.model.updateEditStatus();
		}, 

		toggleQuestionText: function(){
			this.$el.find('.qs-answer').toggleClass('question-stream-hide', 'question-stream-show');
			this.model.updateEditStatus();
		}, 

		submitAnswer: function(e){
			if (e.keyCode === 13) {
				var answerSubmission = this.$el.find('.qs-answer').val();
				this.model.postAnswer(answerSubmission);
				this.$el.find('.qs-answer').val('');
			}
		}, 

		submitComment: function(e){
			if (e.keyCode === 13) {
				var commentSubmission = this.$el.find('.qs-comment').val();
				this.model.postComment(commentSubmission);
				this.$el.find('.qs-comment').val('');
			}
		},

		followQuestion: function(){
			this.model.followQuestion();
		}

	});

	return QuestionStreamItem;
});