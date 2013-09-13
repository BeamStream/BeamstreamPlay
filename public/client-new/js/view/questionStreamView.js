define([
	'baseView', 
	'text!templates/questionStream.tpl', 
	'../model/questionStream', 
	'view/questionStreamListView'
], 
function(BaseView, questionStreamTPL, QuestionStream, QuestionStreamListView){
	var QuestionStreamView = BaseView.extend({
		objName: 'questionStreamView',

		events:{
			// 'click #streamTab a': 'tabHandler',
			// 'click #show-info' :'showDetails'
		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);

			this.model = new QuestionStream({
				streamId: undefined, 
			});

			// view creation causing an error -- only when el is provided
			//this.addView(new QuestionStreamListView({collection: this.model.get('questionStreams'), el: $('#questionStreamListView')}));

			this.model.on('change', function(){
				console.log('questionStream was changed')
			});
			
			// this.model.get('questionStreams').on('change', function(){
			// 	console.log('questionStreams collection was changed')
			// });

			this.render();
		},

		render: function(){
			// var compiledTemplate = Handlebars.compile(questionStreamTPL);
			// this.$el.html(compiledTemplate);
			this.$el.text('Question Stream');
		}
		
		
		
	});

	return QuestionStreamView;
});
