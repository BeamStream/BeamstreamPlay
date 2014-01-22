define([
    'baseView', 
    'text!templates/questionStream.tpl', 
    'view/questionItemView',
    '../model/questionStream', 
    'model/question',
    'view/questionStreamItemView',
    'view/questionStreamListView',
    'text!templates/questionStreamItem.tpl',
  ], 
  function(BaseView, questionStreamTPL,QuestionItemView, QuestionStream,QuestionModel,QuestionStreamItemView, QuestionStreamListView,QuestionStreamItem){

	var QuestionStreamView = BaseView.extend({
		objName: 'questionStreamView',

		events: {
			'click #filter-unanswered': 'filterHandler', 
			'click #filter-answered': 'filterHandler', 
			'click #filter-myquestions': 'filterHandler', 
			'submit .question-form': 'searchQuestions',
			'click .popout': 'popout',
			'click .minimize': 'minimize',
			
			
		},

		onAfterInit: function(){
			this.receiveQuestionThroughPubNub();
		},
		initialize: function() {
			BaseView.prototype.initialize.apply(this, arguments);
			
			// Create a new model
			this.model = new QuestionStream({
				streamId: undefined, 
				currentFilter: 'unanswered'
					
			
			});

			this.render();
		},
			
		popout:function(){
			
			$("#messageListView").hide();
			$("#questionListView").css("display","block");
			$("#questionListView").css("visibility","visible");
		
			
		},
		
		
		/* Miimize left question stream*/
		minimize:function(){
		
			$("#messageListView").show();
			$("#questionListView").css("display","none");
			
			$("#questionListView").css("visibility","hidden");
			/*$("#questionStreamView").hide();*/
			/*$("#questionStreamView").css("visibility","hidden");*/
		/*	 $( "#questionStreamView" ).animate({
				    width: "0%",
				    opacity: 0,
				    visibility:"hidden",
				    	display:"none"
				    
				  }, 1500 );*/
			$( "#questionStreamView" ).hide();
			$(".body").css("padding-right","0");
			$(".chatbox").css("right","40");
			$("#topheader").css("padding-right","0");
			
			/*$("#sidequestionexpand").css("opacity","1");*/
			
			$("#sidequestionexpand").css("right","0");
		
			    
		
			
			
			
				 
			
			
		},
		
		
		/**
         * PUBNUB real time push
         */
         receiveQuestionThroughPubNub: function() {
                 var self = this;
                 self.pagePushUid = Math.floor(Math.random()*16777215).toString(16);
                 var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
                 var trueUrl='';

                 // Trigger the change pagePushUid event
                 this.trigger('change:pagePushUid', {
                         pagePushUid: self.pagePushUid
                 });
                
                 
                 PUBNUB.subscribe({
                         
                         channel : 'questions',
                        // message: function(m){alert("Aa gya dekh"+m)}
                         
                         callback : function(question) {
                                 
                               //  alert("caal of the function")
                                 var streamId = $('.sortable li.active').attr('id');

                               //  alert(streamId);
                                 if (question.pagePushUid != self.pagePushUid)
                                 { 
                                       //  alert("if block")
                                         if(question.streamId==streamId)
                                                {
                                                   /* set the values to Question Model */
                                                 questionModel = new QuestionStream();
                                                   questionModel.set({
//                                                           docDescription :question.data.docDescription,
//                                                           docName : question.data.docName,
                                                           question : question.data.question,
                                                           questionAccess : question.data.questionAccess,
                                                           profilePic : question.data.profilePic,
                                                           streamId : question.data.streamId,
                                                           followerOfQuestionPoster : question.data.followerOfQuestionPoster,
                                                           polls: question.data.polls,
                                                           pollOptions:question.data.pollOptions
                                                   })
                                                   
                                                 //  alert(question);
                                                    // show the posted message on feed
                                                         var questionStreamItemView  = new QuestionStreamItemView({model :questionModel});
                                                         //var compiledTemplate = Handlebars.compile(QuestionStreamItem);
                                                         $('#questionStreamView div.questionStreamItems').prepend(questionStreamItemView.render().el);
                                                         //$('#questionStreamView div.questionStreamItems').prepend(compiledTemplate);
                                                }
                                    }
                 
                            }
                         });
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
			this.$el.find('.selected-arrow').toggleClass('selected-arrow');
			this.$el.find('.selected-filter').toggleClass('selected-filter');
		}

	});

	return QuestionStreamView;
});