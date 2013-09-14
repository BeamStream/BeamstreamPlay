define([
	'baseView', 
	'text!templates/questionStreamList.tpl'
], 
function(BaseView, questionStreamListTPL){
	var QuestionStreamListView = BaseView.extend({
		objName: 'questionStreamListView',

		events: {

		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);
			
			this.collection.on('reset', function(){
				console.log('currentQuestionStream collection was changed')
			});

		},

		render: function(){
			var compiledTemplate = Handlebars.compile(questionStreamListTPL);
			this.$el.html(compiledTemplate);
			console.log('question stream list collection', this.collection);
			return this;
		}
		
	});

	return QuestionStreamListView;
});