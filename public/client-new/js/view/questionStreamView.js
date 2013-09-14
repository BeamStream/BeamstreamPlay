define([
	'baseView', 
	'text!templates/questionStream.tpl', 
	'../model/questionStream', 
	'view/questionStreamListView'
], 
function(BaseView, questionStreamTPL, QuestionStream, QuestionStreamListView){

	var QuestionStreamView = BaseView.extend({
		objName: 'questionStreamView',

		events: {
			'click #filter-unanswered': 'filterHandler', 
			'click #filter-answered': 'filterHandler', 
			'click #filter-myquestions': 'filterHandler'
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
				collection: this.model.get('currentQuestionStream'),
				el: this.$el.find('.streamList')
			});
		},

		setup: function() {
			if (!this.isSetup) {
				// Compile the template
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
		}, 

		filterHandler: function(e){
			console.log(e.currentTarget.id);
			if (e.currentTarget.id === 'filter-unanswered') {
				this.model.setCurrentFilter('unanswered');
			}
			if (e.currentTarget.id === 'filter-answered') {
				this.model.setCurrentFilter('answered');
			}
			if (e.currentTarget.id === 'filter-myquestions') {
				this.model.setCurrentFilter('myQuestions');
			}

		}
		
	});

	return QuestionStreamView;
});
