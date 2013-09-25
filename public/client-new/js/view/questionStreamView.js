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
			'click #filter-myquestions': 'filterHandler', 
			'submit .question-form': 'searchQuestions'
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
				this.$el.find('.selected-arrow').toggleClass('selected-arrow');
				this.$el.find('.selected-filter').toggleClass('selected-filter');
				this.$el.find('#filter-unanswered').toggleClass('selected-filter selected-arrow');
			}
			if (e.currentTarget.id === 'filter-answered') {
				this.model.setCurrentFilter('answered');
				this.$el.find('.selected-arrow').toggleClass('selected-arrow');
				this.$el.find('.selected-filter').toggleClass('selected-filter');
				this.$el.find('#filter-answered').toggleClass('selected-filter selected-arrow');
			}
			if (e.currentTarget.id === 'filter-myquestions') {
				this.model.setCurrentFilter('myQuestions');
				this.$el.find('.selected-arrow').toggleClass('selected-arrow');
				this.$el.find('.selected-filter').toggleClass('selected-filter');
				this.$el.find('#filter-myquestions').toggleClass('selected-filter selected-arrow');
			}

		}, 

		searchQuestions: function(event){
			event.preventDefault();
			var searchQuery = this.$el.find('.question-txt-input').val();
			this.model.updateCurrentStream(searchQuery);
			this.$el.find('.question-txt-input').val('');
		}

	});

	return QuestionStreamView;
});
