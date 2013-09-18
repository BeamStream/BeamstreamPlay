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
			'click .answer': 'toggleQuestionText'
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
			// if (e.keyCode === '13') {
			// 	debugger;
			// 	console.log(e);
			// }
			this.$el.find('.question-stream-comment').toggleClass('question-stream-hide', 'question-stream-show');
		}, 

		toggleQuestionText: function(){
			this.$el.find('.question-stream-answer').toggleClass('question-stream-hide', 'question-stream-show');
		}

	});

	return QuestionStreamItem;
});