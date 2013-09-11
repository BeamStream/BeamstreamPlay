define(['baseView', 
	      'text!templates/questionStream.tpl', 
	      '../model/questionStream'
        ], 
	function(BaseView, questionStreamTPL, QuestionStream){
	var QuestionStreamView;
	QuestionStreamView = BaseView.extend({
		objName: 'QuestionStreamView',
		events:{
			// 'click #streamTab a': 'tabHandler',
			// 'click #show-info' :'showDetails'
		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);
			this.model = new QuestionStream;
			console.log(this);
			
			this.render();
		},

		render: function(){
			// var compiledTemplate = Handlebars.compile(questionStreamTPL);
			// this.$el.html(compiledTemplate);
			this.$el.text('Question Stream');
		}
		
		
		
	})
	return QuestionStreamView;
});