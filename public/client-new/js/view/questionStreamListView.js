define([
	'baseView', 
	'../collection/questionStreams'
], 
function(BaseView, QuestionStreams){
	var QuestionStreamListView = BaseView.extend({
		objName: 'questionStreamListView',

		events:{
			// 'click #streamTab a': 'tabHandler',
			// 'click #show-info' :'showDetails'
		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);

			// this.model.on('change', function(){
			// 	console.log('questionStream was changed')
			// });
			
			// this.collection.on('change', function(){
			// 	console.log('questionStreams collection was changed')
			// });

			this.render();
		},

		render: function(){
			//this.$el.attr('id', 'questionStreamListView');
			console.log(this.collection);
			console.log(this.el);
			this.$el.text('Question Stream list view');
			// var compiledTemplate = Handlebars.compile(questionStreamTPL);
			// this.$el.html(compiledTemplate);
			//this.$el.text('Question Stream');
		}
		
		
		
	});

	return QuestionStreamListView;
});