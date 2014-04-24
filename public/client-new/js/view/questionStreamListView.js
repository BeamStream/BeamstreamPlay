define([
	'baseView', 
	'text!templates/questionStreamList.tpl', 
	'view/questionStreamItemView'
], 
function(BaseView, questionStreamListTPL, QuestionStreamItemView){
	var QuestionStreamListView = BaseView.extend({
		objName: 'questionStreamListView',
		

		events: {

		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);
			
			var that = this;
			this.collection.on('reset', function(){
				that.render();
			});

			this.compiledTemplate = Handlebars.compile(questionStreamListTPL);

		},
		
	

		addChildViews: function() {
			var that = this;
			this.collection.map(function(question){
				var itemView = new QuestionStreamItemView({model: question});
				itemView.render();
				that.$el.find('.questionStreamItems').append(itemView.el);
			});
		},

		render: function(){
			this.$el.html(this.compiledTemplate);

			this.addChildViews();

			// Set height to prevent scrolling
			// this might be necessary in older browsers
			//this.$el.css({ height: this.$el.height()+'px' });

			return this;
		}
		
	});

	return QuestionStreamListView;
});