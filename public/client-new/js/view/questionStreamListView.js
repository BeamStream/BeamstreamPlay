define(
		[ 'baseView', 'text!templates/questionStreamList.tpl',
				'view/questionStreamItemView', 'model/question', ],
		function(BaseView, questionStreamListTPL, QuestionStreamItemView,QuestionModel){
var QuestionStreamListView = BaseView.extend({
										objName : 'questionStreamListView',

						events : {

						},

						initialize : function() {
							this.receiveQuestionThroughPubNubQs();

							BaseView.prototype.initialize
									.apply(this, arguments);

							var that = this;
							this.collection.on('reset', function() {
								that.render();
							});

							this.compiledTemplate = Handlebars
									.compile(questionStreamListTPL);
						},

						addChildViews : function() {
							var that = this;
							this.collection.map(function(question) {
								var itemView = new QuestionStreamItemView({
									model : question
								});
								// itemView.render();
								that.$el.find('.questionStreamItems').append(
										itemView.el);
							});
						},

						render : function() {
							this.$el.html(this.compiledTemplate);

							this.addChildViews();

							// Set height to prevent scrolling
							// this might be necessary in older browsers
							// this.$el.css({ height: this.$el.height()+'px' });

							return this;
						},

						setOnlineuser : function() {
							var onlineUser;
							$.ajax({
								type : 'GET',
								url : "/loggedInUserJson",
								async : false,
								success : function(data) {
									onlineUser = data.id.id;
									if (typeof callback === "function")
										callback(streamCreator);
								}
							});

							return (onlineUser);
						},

						setStreamOwner : function(streamId) {

							if (streamId != "remove-button" || streamId != null)
{
var streamCreator;
$.ajax({
																				type : 'GET',
											url : "/streamData/" + streamId,
											async : false,
											success : function(data) {
												streamCreator = data.creatorOfStream.id;
												if (typeof callback === "function")
													callback(streamCreator);
											}
										});
								return (streamCreator);
							}

						},

						/**
						 * PUBNUB real time push
						 */
						receiveQuestionThroughPubNubQs : function() {

							var self = this;
							self.pagePushUid = Math.floor(
									Math.random() * 16777215).toString(16);
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var trueUrl = '';

							/* self.useronline = this.onlineuser; */

							// Trigger the change pagePushUid event
							/*
							 * this.trigger('change:pagePushUid', { pagePushUid:
							 * self.pagePushUid });
							 */

							PUBNUB
									.subscribe({
										channel : 'questionsSideStream',
										callback : function(question) {
											var streamId = $(
													'.sortable li.active')
													.attr('id');
											if (self
													.setStreamOwner(question.streamId) == question.data.question.userId.id) {
												StreamOwner = false;
											} else {
												StreamOwner = true;
											}
											if (self.setOnlineuser() == question.data.question.userId.id) {
												var onlineUserAsked = true;
											} else {
												var onlineUserAsked = false;
											}
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
																onlineUserAsked : onlineUserAsked,
																StreamOwner : StreamOwner,
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
													$(
															'#questionStreamView div.questionStreamItems')
															.prepend(
																	questionStreamItemView
																			.render().el);
													/*
													 * var compiledTemplate =
													 * Handlebars.compile(QuestionStreamItem);
													 * $('#questionStreamView
													 * div.questionStreamItems').prepend(compiledTemplate(questionModel.attributes));
													 */
												}
											}

											$
													.ajax({

														type : 'GET',
														url : "/noOfUnansweredQuestions/"
																+ question.streamId,
														success : function(data) {

															$(
																	"#number-new-questions")
																	.text(
																			data.count);
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

											var countUnansweredQues = $(
													"#number-new-questions")
													.text();
											countUnansweredQues--;
											$("#number-new-questions").text(
													countUnansweredQues);

										}

									})

							PUBNUB
									.subscribe({

										channel : "sideQuestionDelete",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {
												$('div.questionStreamItems')
														.find(
																'div#'
																		+ question.questionId)
														.remove();
											}

											$
													.ajax({

														type : 'GET',
														url : "/noOfUnansweredQuestions/"
																+ question.streamID,
														success : function(data) {

															$(
																	"#number-new-questions")
																	.text(
																			data.count);
														}

													});

										}

									})

							PUBNUB.subscribe({

								channel : "markedAnswer",
								callback : function(question) {
									$('div.questionStreamItems').find(
											'div#' + question.questionId)
											.remove();
									var countUnansweredQues = $(
											"#number-new-questions").text();
									countUnansweredQues--;
									$("#number-new-questions").text(
											countUnansweredQues);
								}

							})

							PUBNUB
									.subscribe({

										channel : "questionRockSideStream",
										restore : false,
										callback : function(question) {
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

											$
													.ajax({

														type : 'GET',
														url : "/noOfUnansweredQuestions/"
																+ question.streamId,
														success : function(data) {

															$(
																	"#number-new-questions")
																	.text(
																			data.count);
														}

													});
											var countUnansweredQues = $(
													"#number-new-questions")
													.text();
											countUnansweredQues--;
											$("#number-new-questions").text(
													countUnansweredQues);

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
						}

					});

			return QuestionStreamListView;
		});