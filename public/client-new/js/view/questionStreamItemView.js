define([
	'baseView', 
	'text!templates/questionStreamItem.tpl'
], 
function(BaseView, questionStreamItemTPL){
	var QuestionStreamItem = BaseView.extend({
		objName: 'questionStreamItem', 

		events: {

		}, 

		initialize: function(){
			BaseView.prototype.initialize.apply(this, arguments);

		}, 

		render: function(){
			var compiledTemplate = Handlebars.compile(questionStreamItemTPL);
			this.$el.html(compiledTemplate(this.model.attributes));
			return this;
		}
	});

	return QuestionStreamItem;
});