define(['baseView', 
	      'text!templates/questionStream.tpl'
        ], 
	function(BaseView, questionStreamTPL){
	var QuestionStreamView;
	QuestionStreamView = BaseView.extend({
		objName: 'QuestionStreamView',
		events:{
			// 'click #streamTab a': 'tabHandler',
			// 'click #show-info' :'showDetails'
		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);
			
			this.render();
		},

		render: function(){
			var compiledTemplate = Handlebars.compile(questionStreamTPL);
			this.$el.html(compiledTemplate);
		}
		
		
		
	})
	return QuestionStreamView;
});