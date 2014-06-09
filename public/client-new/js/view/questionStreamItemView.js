define(
		[ 'baseView', '../handlebar_helpers/pluralize_helper',
				'text!templates/questionStreamItem.tpl',
				'view/questionItemView', 'model/question',
				'model/questionStream', ],
		function(BaseView, Pluralize, questionStreamItemTPL, QuestionItemView,
				QuestionModel, QuestionStreamModel) {
			var QuestionStreamItem = BaseView
					.extend({
						objName : 'questionStreamItem',

						events : {
							'click .rock-icon' : 'rockQuestion',
							'click .already-rocked' : 'rockQuestion',
							'click .qs-comment-link' : 'toggleCommentText',
							'click .qs-answer-link' : 'toggleQuestionText',
							'click #answer-button-sidestream' : 'submitAnswer',
							'click #comment-button-sidestream' : 'submitComment',
							'blur .qs-answer' : 'hideAnswerInputField',
							'blur .qs-comment' : 'hideCommentInputField',
							'click .follow-question' : 'followQuestion',
							'click .mark-answered' : 'markAnswered',
							'click .delete-question' : 'deleteQuestion',
							'click .question-dropdown' : 'toggleDropdown'

						},

						/*
						 * onAfterInit: function(){ this.receiveThroughPubNub(); },
						 */

						initialize : function() {
							BaseView.prototype.initialize
									.apply(this, arguments);
							// this.model.on('answerPost', this.render, this);
							// this.model.on('commentPost', this.render, this);
						},

						render : function() {
							var compiledTemplate = Handlebars
									.compile(questionStreamItemTPL);
							this.$el
									.html(compiledTemplate(this.model.attributes));
							return this;
						},

						rockQuestion : function(e) {
							this.model.rockQuestion();

						},

						toggleCommentText : function() {
							this.$el.find('.qs-comment').show();
							this.$el.find('.commentinputField').show();
							this.$el.find('input.qs-comment').focus();
							this.$el.find('.qs-answer').hide();
							this.$el.find('.answerinputField').hide();
							this.model.updateEditStatus();
						},

						toggleQuestionText : function() {
							this.$el.find('.qs-answer').show();
							this.$el.find('.answerinputField').show();
							this.$el.find('input.qs-answer').focus();
							this.$el.find('.qs-comment').hide();
							this.$el.find('.commentinputField').hide();
							this.model.updateEditStatus();
						},

						submitAnswer : function(e) {
							var answertext = $.trim(this.$el.find('.qs-answer')
									.val());
							if (answertext !== "") {
								var element = e.target.parentElement;
								var parent = $(element).parents(
										'div.side-question').attr('id');
								var answerAmt = $(
										'div#' + parent + '-totalanswersidebar')
										.text();
								var answerSubmission = answertext;
								this.model.postAnswer(answerSubmission, parent,
										answerAmt);
								this.$el.find('.qs-answer').val('');
								var QuestionStream = new QuestionStreamModel();
								QuestionStream.createQuestionList();
								this.$el.find('.qs-answer').hide();
								this.$el.find('.answerinputField').hide();
							} else {
								alert("Wrong Entity")
							}

						},

						submitComment : function(e) {

							var element = e.target.parentElement;
							var parent = $(element)
									.parents('div.side-question').attr('id');
							var commentAmt = $(
									'div#' + parent + '-totalcommentsidebar')
									.text();
							var commenttext = $.trim(this.$el.find(
									'.qs-comment').val());
							if (commenttext !== "") {
								var commentSubmission = commenttext;
								// var commentCount = $()
								this.model.postComment(commentSubmission,
										parent, commentAmt);
								this.$el.find('.qs-comment').val('');
								this.model.updateEditStatus();
								this.$el.find('.qs-comment').hide();
								this.$el.find('.commentinputField').hide();
							} else {
								alert("Wrong Entity")
							}

						},

						hideAnswerInputField : function(e) {

							var self = this;
							var answertext = $.trim(this.$el.find('.qs-answer')
									.val());
							setTimeout(
									function() {
										if ($('.answerinputField').is(
												':visible'))

										{
											if (answertext == "") {
												self.$el.find('.qs-answer')
														.hide();
												self.$el.find(
														'.answerinputField')
														.hide();
											} else {
												bootbox
														.dialog(
																"Do you want to post the Answer?",
																[
																		{

																			"label" : "YES",
																			"class" : "btn-primary",
																			"callback" : function() {

																			}

																		},
																		{
																			"label" : "NO",
																			"class" : "btn-primary",
																			"callback" : function() {

																				self.$el
																						.find(
																								'.qs-answer')
																						.hide();
																				self.$el
																						.find(
																								'input.qs-answer')
																						.val(
																								'');
																				self.$el
																						.find(
																								'.answerinputField')
																						.hide();
																			}
																		} ]);

											}

										}
									}, 120)
						},

						hideCommentInputField : function(e) {
							var self = this;
							var commenttext = $.trim(this.$el.find(
									'.qs-comment').val());

							setTimeout(
									function() {
										if ($('.commentinputField').is(
												':visible'))

										{
											if (commenttext == "") {
												self.$el.find('.qs-comment')
														.hide();
												self.$el.find(
														'.commentinputField')
														.hide();

											} else {
												bootbox
														.dialog(
																"Do you wana to post the Comment?",
																[
																		{

																			"label" : "YES",
																			"class" : "btn-primary",
																			"callback" : function() {

																			}

																		},
																		{
																			"label" : "NO",
																			"class" : "btn-primary",
																			"callback" : function() {

																				self.$el
																						.find(
																								'.qs-comment')
																						.hide();
																				self.$el
																						.find(
																								'input.qs-comment')
																						.val(
																								'');
																				self.$el
																						.find(
																								'.commentinputField')
																						.hide();
																			}
																		} ]);
											}
										}
									}, 120)
						},

						receiveThroughPubNub : function() {
							var self = this;
							self.pagePushUid = Math.floor(
									Math.random() * 16777215).toString(16);
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var trueUrl = '';

							// Trigger the change pagePushUid event
							this.trigger('change:pagePushUid', {
								pagePushUid : self.pagePushUid
							});

							PUBNUB
									.subscribe({
										channel : "questioncommentSideStream",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {

												question.cmtCount++;

												$(
														'#'
																+ question.parent
																+ "-totalcommentsidebar")
														.text(question.cmtCount);
											}
										}
									})

							PUBNUB
									.subscribe({

										channel : "delete_ques_CommentSideBar",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {
												var commentCountSideBar = $(
														'#'
																+ question.questionId
																+ "-totalcommentsidebar")
														.text();
												$(
														'#'
																+ question.questionId
																+ "-totalcommentsidebar")
														.text(
																commentCountSideBar - 1);

											}
										}
									})

							PUBNUB
									.subscribe({
										channel : "questionanswerSideStream",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												question.cmtCount++;

												$(
														'#'
																+ question.parent
																+ "-totalanswersidebar")
														.text(question.cmtCount);
											}
										}
									})

							PUBNUB
									.subscribe({

										channel : "delete_ques_AnswerSide",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {
												var answerCountSideBar = $(
														'#'
																+ question.questionId
																+ "-totalanswersidebar")
														.text();
												$(
														'#'
																+ question.questionId
																+ "-totalanswersidebar")
														.text(
																answerCountSideBar - 1);

											}
										}
									})

						},

						followQuestion : function() {
							this.model.followQuestion();
						},

						markAnswered : function() {
							this.model.markAnswered();
						},

						deleteQuestion : function() {
							var model = this.model;
							if (!model.get('onlineUserAsked')) {
								if (model.get('StreamOwner')) {
									bootbox.dialog(
											"Are you sure you want to delete?",
											[ {
												"label" : "Yes",
												"class" : "delete-question",
												"callback" : function() {
													model.deleteQuestion();
												}
											}, {
												"label" : "No",
												"class" : "delete-question",
												"callback" : function() {
												}
											} ]);
								}
							} else {
								model.deleteQuestion();
							}
							/*
							 * var countUnansweredQues =
							 * $("#number-new-questions").text();
							 * countUnansweredQues--;
							 * $("#number-new-questions").text(countUnansweredQues);
							 */
						},

						toggleDropdown : function() {
							this.model.updateEditStatus();
						}

					});

			return QuestionStreamItem;
		});
