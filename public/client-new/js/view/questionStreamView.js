define([
	'baseView', 
	'text!templates/questionStream.tpl', 
	'../model/questionStream', 
	'view/questionStreamListView'
], 
function(BaseView, questionStreamTPL, QuestionStream, QuestionStreamListView){

	var QuestionStreamView = BaseView.extend({
		//var QuestionStreamView = Backbone.View.extend({
		objName: 'questionStreamView',

		events:{
			// 'click #streamTab a': 'tabHandler',
			// 'click #show-info' :'showDetails'
		},

		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);

			// Create a new model
			this.model = new QuestionStream({
				streamId: undefined, 
				currentFilter: 'unanswered'
			});

			// Re-render when model changes
			// Probably don't have to do this???
			this.model.on('change', function(){
				// this.render(); // Maybe? If necessary?
			});

			this.render();
		},

		addChildViews: function() {
			// Create sub view, but don't yet tell it where to render itself
			this.streamListView = new QuestionStreamListView({
				collection: this.model.get('questionStreams'),
				el: this.$el.find('.streamList')
			});
		},

		setup: function() {
			if (!this.isSetup) {
				// Compile the template our template
				this.compiledTemplate = Handlebars.compile(questionStreamTPL);

				// Add child views
				this.addChildViews();

				this.isSetup = true;
			}
		},

		render: function(){
			this.setup();

			// Render the template
			this.$el.html(this.compiledTemplate);
			
			// Tell child views to setElement and render itself
			this.streamListView.setElement(this.$el.find('.streamList'));
			this.streamListView.render();

			return this;
		}
		
	});

	return QuestionStreamView;
});
