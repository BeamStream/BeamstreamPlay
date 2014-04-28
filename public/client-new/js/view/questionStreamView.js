define(
		[ 'baseView', 'text!templates/questionStream.tpl',
				'view/questionItemView', 'model/questionStream',
				'model/question', 'view/questionStreamItemView',
				'view/questionStreamListView',
				'text!templates/questionStreamItem.tpl', ],
		function(BaseView, questionStreamTPL, QuestionItemView, QuestionStream,
				QuestionModel, QuestionStreamItemView, QuestionStreamListView,
				QuestionStreamItem) {

			var QuestionStreamView = BaseView
					.extend({
						objName : 'questionStreamView',

						events : {
							'click #filter-unanswered' : 'filterHandler',
							'click #filter-answered' : 'filterHandler',
							'click #filter-myquestions' : 'filterHandler',
							'submit .question-form' : 'searchQuestions',

						},

						
						initialize : function() {

							BaseView.prototype.initialize
									.apply(this, arguments);

							// Create a new model
							this.model = new QuestionStream({
								// 	streamId : undefined,
								currentFilter : 'unanswered'

							});
							
							
							
							this.receiveQuestionThroughPubNubQs();
							
							
							this.render();
						},

						
						
					
						
						/**
						 * PUBNUB real time push
						 */
						receiveQuestionThroughPubNubQs : function() {

							//alert("posting question 1>>>>>>>>>>");
							var self = this;
							self.pagePushUid = Math.floor(
									Math.random() * 16777215).toString(16);
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var trueUrl = '';

							// Trigger the change pagePushUid event
							/*
							 * this.trigger('change:pagePushUid', { pagePushUid:
							 * self.pagePushUid });
							 */

							PUBNUB.subscribe({

										channel : 'questionsSideStream',

										callback : function(question) {
											
											//alert("posting question");


											var streamId = $(
													'.sortable li.active')
													.attr('id');
												
											
											
											if (question.pagePushUid != self.pagePushUid) {
												if (question.streamId == streamId) {
													/*
													 * set the values to
													 * Question Model
													 */
													questionModel = new QuestionModel();
													questionModel
															.set({
																// docDescription
																// :question.data.docDescription,
																// docName :
																// question.data.docName,
																question : question.data.question,
																questionAccess : question.data.questionAccess,
																profilePic : question.data.profilePic,
																streamId : question.data.streamId,
																followerOfQuestionPoster : question.data.followerOfQuestionPoster,
																polls : question.data.polls,
																pollOptions : question.data.pollOptions
															})

													// show the posted message
													// on feed
													var questionStreamItemView = new QuestionStreamItemView(
															{
																model : questionModel
															});
													// var
													// compiledTemplate
													// =
													// Handlebars.compile(QuestionStreamItem);
													$('#questionStreamView div.questionStreamItems').prepend(
																	questionStreamItemView
																			.render().el);

													// $('#questionStreamView
													// div.questionStreamItems').prepend(compiledTemplate);
												}
											}
											
											
											
											$.ajax({
												
												type: 'GET',	           
									            url: "/noOfUnansweredQuestions/"+question.streamId,
									            success: function(data){
									            	
									            	
									            	$("#number-new-questions").text	(data.count);
									            }
												
											});

										}

									});

							PUBNUB
									.subscribe({

										channel : "deleteQuestionSideStream",
										restore : false,
										callback : function(question) {
											
											if (question.pagePushUid != self.pagePushUid) {

												$(
														'div#'
																+ question.questionId
																+ ":parent")
														.remove();
											}
											

											$.ajax({
												
												type: 'GET',	           
									            url: "/noOfUnansweredQuestions/"+question.streamId,
									            success: function(data){
									            	
									            	
									            	$("#number-new-questions").text	(data.count);
									            }
												
											});
											var countUnansweredQues = $("#number-new-questions").text();
											countUnansweredQues--;
											$("#number-new-questions").text(countUnansweredQues);
											
										}
									
									
									
									})

							PUBNUB
									.subscribe({

										channel : "questionRockSideStream",
										restore : false,
										callback : function(question) {
											// alert(JSON.stringify(question));
											if (question.pagePushUid != self.pagePushUid) {

												// if(localStorage["loggedUserId"]==question.ownerId)
												// {
												// if($('#'+question.quesId+'-rockicon').hasClass('rock-icon'))
												// {
												// $('#'+question.quesId+'-rockicon').removeClass('rock-icon');
												// $('#'+question.quesId+'-rockicon').addClass('already-rocked');
												// }
												// else
												// {
												// $('#'+question.quesId+'-rockicon').removeClass('already-rocked');
												// $('#'+question.quesId+'-rockicon').addClass('rock-icon');
												// }

												// }
												$(
														'#'
																+ question.quesId
																+ '-totalrocksidebar')
														.find('span').html(
																question.data);
											}
										}
									})

							PUBNUB
									.subscribe({

										channel : "questionRockfromSidetoSideStream",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												$(
														'#'
																+ question.quesId
																+ '-totalrocksidebar')
														.find('span').html(
																question.data);

											}
										}
									})

							PUBNUB
									.subscribe({
										channel : "sideCommentPushSideStream",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												question.cmtCount++;

												$(
														'#'
																+ question.questionId
																+ "-totalcommentsidebar")
														.text(question.cmtCount);
											}
										}
									})
							PUBNUB
									.subscribe({
										channel : "sideAnswerPushSideStream",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {

												question.ansCount++;

												$(
														'#'
																+ question.questionId
																+ "-totalanswersidebar")
														.text(question.ansCount);
											}
										}
									})
						},

						addChildViews : function() {
							
							// Create sub view, but don't yet tell it where to
							// render itself
							this.streamListView = new QuestionStreamListView({
								collection : this.model
										.get('currentQuestionStream'),
								el : this.$el.find('.streamList')
							});
						},

						setup : function() {
							if (!this.isSetup) {
								// Compile the template
								this.compiledTemplate = Handlebars
										.compile(questionStreamTPL);

								// Add child views
								this.addChildViews();

								this.isSetup = true;
							}
						},

						render : function() {
							this.setup();
								
							
							
							// Render the template
							this.$el.html(this.compiledTemplate);

							// Tell child views to setElement and render itself
							this.streamListView.setElement(this.$el
									.find('.streamList'));
							this.streamListView.render();

							return this;
						},

						filterHandler : function(e) {
							
							
							if (e.currentTarget.id === 'filter-unanswered') {
								this.model.setCurrentFilter('unanswered');
								this.$el.find('.selected-arrow').toggleClass(
										'selected-arrow');
								this.$el.find('.selected-filter').toggleClass(
										'selected-filter');
								this.$el
										.find('#filter-unanswered')
										.toggleClass(
												'selected-filter selected-arrow');
							}
							if (e.currentTarget.id === 'filter-answered') {
								this.model.setCurrentFilter('answered');
								this.$el.find('.selected-arrow').toggleClass(
										'selected-arrow');
								this.$el.find('.selected-filter').toggleClass(
										'selected-filter');
								this.$el.find('#filter-answered').toggleClass(
										'selected-filter selected-arrow');
							}
							if (e.currentTarget.id === 'filter-myquestions') {
								this.model.setCurrentFilter('myQuestions');
								this.$el.find('.selected-arrow').toggleClass(
										'selected-arrow');
								this.$el.find('.selected-filter').toggleClass(
										'selected-filter');
								this.$el
										.find('#filter-myquestions')
										.toggleClass(
												'selected-filter selected-arrow');
							}

						},

						searchQuestions : function(event) {
							event.preventDefault();
							var searchQuery = this.$el.find(
									'.question-txt-input').val();
							this.model.updateCurrentStream(searchQuery);
							this.$el.find('.question-txt-input').val('');
							this.$el.find('.selected-arrow').toggleClass(
									'selected-arrow');
							this.$el.find('.selected-filter').toggleClass(
									'selected-filter');
						}

					});

			return QuestionStreamView;
		});