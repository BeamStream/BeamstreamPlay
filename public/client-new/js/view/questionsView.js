define(
[ 'view/formView', 'view/questionItemView', 'model/question',
'text!templates/questionMessage.tpl',
'text!templates/questionComment.tpl',
'text!templates/questionAnswer.tpl', ],
function(FormView, QuestionItemView, QuestionModel, QuestionMessage,
QuestionComment, QuestionAnswer) {
var QuestionsView;
QuestionsView = FormView
.extend({
objName : 'QuestionsView',

events : {
							'click #sortQuestionBy-list' : 'sortQuestions',
							'focus #Q-area' : 'showAskButton',
							'blur #Q-area' : 'hideAskButton',
							'keypress #sortQ_by_key' : 'sortQuestionsByKey',
							'click #sortQueByDate-list' : 'sortQuestionsWithinAPeriod',
							'click #share-discussions li a' : 'actvateShareIcon',
							'click #Q-privatelist li' : 'selectPrivateToList',
							'click #post-question' : 'postQuestion',
							// 'click #questions-poll-Link' : 'addpoll',
							'focus .showpolloption' : 'addPollOptionsArea',
							/* 'click .add-poll' : 'addPollOptionsArea', */
							'click .add-option' : 'addMorePollOptions',
							'click #Q-private-to' : 'checkPrivateAccess',
							'click #question-file-upload li' : 'uploadFiles',
							'change #Q-files-area' : 'getUploadedData',
							// 'keypress #Q-area' : 'postQuestionOnEnterKey',
							'keyup #Q-area' : 'removePreview',
							'keypress #sort_by_key_questions' : 'searchQuestionByKey',
							'blur #sort_by_key_questions':'searchQuestionByBlur',
							'keyup #sort_by_key_questions':'searchQuestionByKeyup',
							'click form.all-search span.backToNormal' : 'clearSearchField',

						},

						messagesPerPage : 10,
						pageNo : 1,

						onAfterInit : function() {
							var self = this;
							this.data.reset();
							this.selected_medias = [];
							$('#Q-main-photo').attr('src',
									localStorage["loggedUserProfileUrl"]);
							this.setupPushConnection();
							this.questionSortedType = '';
							this.file = '';

							this.urlRegex1 = /(https?:\/\/[^\s]+)/g;
							this.urlRegex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
							this.urlRegex2 = /^((http|https|ftp):\/\/)/;
							this.urlReg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
							this.website = /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&amp;?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;

							/* pagination */
							$(window)
									.bind(
											'scroll',
											function(ev) {

												var activeTab = $(
														'.stream-tab li.active')
														.attr('id');
												if (activeTab == 'question') {

													var scrollTop = $(window)
															.scrollTop();
													var docheight = $(document)
															.height();
													var widheight = $(window)
															.height();
													if (scrollTop + 1 == docheight
															- widheight
															|| scrollTop == docheight
																	- widheight) {
														var t = $(
																'#questionListView')
																.find(
																		'div.content');
														if (t.length != 0) {

															// var
															// questionSortedType
															// =
															// $('#sortQuestionBy-select').attr('value');
															$(
																	'#question-pagination')
																	.show();
															var streamId = $(
																	'.sortable li.active')
																	.attr('id');

															view = self
																	.getViewById('questionListView');

															/*if (self.questionSortedType == "date") {
																self.pageNo++;
																if (view) {

																	self.data.url = "/getAllQuestionsForAStream/"
																			+ streamId
																			+ "/date/"
																			+ view.messagesPerPage
																			+ "/"
																			+ self.pageNo;
																	self
																			.appendMessages();
																}
															} else if (self.questionSortedType == "rock") {
																self.pageNo++;
																if (view) {

																	self.data.url = "/getAllQuestionsForAStream/"
																			+ streamId
																			+ "/rock/"
																			+ view.messagesPerPage
																			+ "/"
																			+ self.pageNo;
																	self
																			.appendMessages();
																}
															} else if (self.questionSortedType == "keyword") {
																self.pageNo++;
																var keyword = $(
																		'#sortQ_by_key')
																		.val();
																if (view) {

																	self.data.url = "/getAllQuestionsForAStream/"
																			+ streamId
																			+ "/"
																			+ keyword
																			+ "/"
																			+ view.messagesPerPage
																			+ "/"
																			+ self.pageNo;
																	self
																			.appendMessages();
																}
															}*/

														}
													} else {
														$(
																'#question-pagination')
																.hide();
													}
												}
											});

						},
						
						
						
						searchQuestionByKey : function(eventName) {
							
							var self = this;
							this.pageNo = 1;
							var streamId = $('.sortable li.active').attr('id');
							var keyword = $('#sort_by_key_questions').val();
							if (eventName.which == 13) {
								self.msgSortedType = "keyword";
								eventName.preventDefault();
								if (keyword) {
									/* render the message list */
									view = this.getViewById('questionListView');
									if (view) {
										view.data.url = "/getAllQuestionsForAStream/" + streamId
												+ "/" + keyword + "/" + view.messagesPerPage
												+ "/" + view.pageNo;
										view.data.fetch();

									}
								} else {
									view = this.getViewById('questionListView');
									if (view) {

										view.myStreams = this
												.getViewById('sidebar').myStreams;

										view.data.url = "/getAllQuestionsForAStream/"
												+ this.getViewById('sidebar').streamId
												+ "/date/"
												+ view.messagesPerPage
												+ "/"
												+ view.pageNo;
										view.fetch();

									}
								}

							} 

						},
						
						searchQuestionByBlur:  function(eventName) {

							var self = this;
							this.pageNo = 1;
							var streamId = $('.sortable li.active').attr('id');
							var keyword = $('#sort_by_key_questions').val();
								self.msgSortedType = "keyword";
								eventName.preventDefault();
								if (keyword) {
									/* render the message list */
									view = this.getViewById('questionListView');
									if (view) {

										view.data.url = "/getAllQuestionsForAStream/" + streamId
										+ "/" + keyword + "/" + view.messagesPerPage
										+ "/" + view.pageNo;
										view.fetch();

									}
								} else {
									view = this.getViewById('questionListView');
									if (view) {

										view.myStreams = this
												.getViewById('sidebar').myStreams;

										view.data.url = "/getAllQuestionsForAStream/"
												+ this.getViewById('sidebar').streamId
												+ "/date/"
												+ view.messagesPerPage
												+ "/"
												+ view.pageNo;
										view.fetch();

									}
								}

						},
						
						
						searchQuestionByKeyup: function(eventName) {
							var self = this;
							this.pageNo = 1;
							var streamId = $('.sortable li.active').attr('id');
							var keyword = $('#sort_by_key_questions').val();
							
							$('form.all-search span.backToNormal').css('visibility','visible');
							
							if(keyword == "")
								{
								$('form.all-search span.backToNormal').css('visibility','hidden');
								view = this.getViewById('questionListView');
								if (view) {

									view.myStreams = this
											.getViewById('sidebar').myStreams;

									view.data.url = "/getAllQuestionsForAStream/"
											+ this.getViewById('sidebar').streamId
											+ "/date/"
											+ view.messagesPerPage
											+ "/"
											+ view.pageNo;
									view.fetch();

								}
								}
						},
						clearSearchField: function(eventName) {
							var self = this;
							this.pageNo = 1;
							var streamId = $('.sortable li.active').attr('id');
							view = this.getViewById('questionListView');
							if (view) {

								view.myStreams = this
										.getViewById('sidebar').myStreams;

								view.data.url = "/getAllQuestionsForAStream/"
									+ this.getViewById('sidebar').streamId
									+ "/date/"
									+ view.messagesPerPage
									+ "/"
									+ view.pageNo;
								view.fetch();
							$('form.all-search span.backToNormal').css('visibility','hidden');
							$('#sort_by_key_questions').val('');
							}
						},
						
						

						showAskButton : function() {

						$('#Q-area').css('padding', '0% 0% 0% 0%');
							$('#Q-area').css('margin', '30px 0 30px 22px');
							$('a#post-question').css('visibility', 'visible');
							$('#questionsView .ask-outer').height(
									function(index, height) {
										return (height + 70);
									});
						},

						hideAskButton : function() {
							$('textarea#Q-area').attr('placeholder',
									'Ask your own question here...');
							var flag = true;
							var questionData = $('#Q-area').val();
							if (questionData == '') {
								if (flag == true) {
									$('#Q-area').css('padding', '4px 6px');
									$('#Q-area').css('margin','1px 0 -5px 14px');
									$('a#post-question').css('visibility',
											'hidden');
									$('.ask-outer').css('height', '0px');
									$('textarea#Q-area').val('');
									$('#pollArea').slideUp(700);
								}
							}
							
							
							/*setTimeout(function() {
								if (flag == true) {
									$('#Q-area').css('padding', '4px 6px');
									$('#Q-area').css('margin',
											'1px 0 -5px 14px');
									$('a#post-question').css('visibility',
											'hidden');
									$('.ask-outer').css('height', '0px');
									$('textarea#Q-area').val('');
									$('#pollArea').slideUp(700);
								}
							}, 1000);*/

							$("ul#pollArea").on(
									"click",
									"li",
									function(event) {
										if (event.currentTarget === this) {
											flag = false;
											$('a#post-question').css(
													'visibility', 'visible');
											$('#pollArea').slideDown(700);
										}
									});

							if ($(".showpolloption").is(":visible")) {

								$('textarea#Q-area').attr('placeholder',
										'Click here to add a poll ...');

							}
						},

						/**
						 * append messages to message list on pagination
						 */
						appendMessages : function() {
							this.data.models[0]
									.fetch({
										success : function(data, models) {
											$('#question-pagination').hide();
											/* render messages */
											_
													.each(
															models,
															function(model) {
var questionModel = new QuestionModel();
questionModel
.set({
																			question : model.question,
																			comments : model.comments,
																			followed : model.followed,
																			followerOfQuestionPoster : model.followerOfQuestionPoster,
																			profilePic : model.profilePic,
																			rocked : model.rocked,
																			polls : model.polls
																		})

																var questionItemView = new QuestionItemView(
																		{
																			model : questionModel
																		});
																$(
																		'#questionListView div.content')
																		.append(
																				questionItemView
																						.render().el);

																setTimeout(
																		function() {

																			if (model.polls.length > 0) {
																				var values = [], pollIndex = 0, totalVotes = 0, isAlreadyVoted = false, myAnswer = '';

																				_
																						.each(
																								model.polls,
																								function(
																										poll) {

																									var radioColor = Raphael
																											.hsb(
																													self.color,
																													1,
																													1);

																									values
																											.push(poll.voters.length);
																									totalVotes += poll.voters.length;
																									self.color += .1;

																									// check
																									// whether
																									// the
																									// user
																									// is
																									// already
																									// voted
																									// or
																									// not
																									_
																											.each(
																													poll.voters,
																													function(
																															voter) {

																														if (voter.id == localStorage["loggedUserId"]) {
																															isAlreadyVoted = true;
																															myAnswer = poll.id.id;
																														}

																													});
																								});
																				if (totalVotes != 0) {

																					/*
																					 * creating
																					 * pie
																					 * charts
																					 */
																					donut[model.question.id.id] = new Donut(
																							new Raphael(
																									""
																											+ model.question.id.id
																											+ "-piechart",
																									200,
																									200));
																					donut[model.question.id.id]
																							.create(
																									100,
																									100,
																									30,
																									55,
																									100,
																									values);

																				}

																				// disable
																				// the
																				// polling
																				// option
																				// if
																				// already
																				// polled
																				if (isAlreadyVoted == true) {
																					$(
																							"input[id="
																									+ myAnswer
																									+ "]")
																							.attr(
																									'checked',
																									true);
																					$(
																							"input[name="
																									+ model.question.id.id
																									+ "]")
																							.attr(
																									'disabled',
																									true);
																				}
																			}
																		}, 500);

															});

										}
									});
						},

						/**
						 * post question on enter key press
						 */
						/*
						 * postQuestionOnEnterKey: function(eventName){ var self =
						 * this;
						 * 
						 * if(eventName.which == 13) { self.postQuestion(); }
						 * if(eventName.which == 32){ var text =
						 * $('#Q-area').val(); self.links =
						 * text.match(this.urlReg);
						 * 
						 * if(!self.links) self.links =
						 * text.match(this.website);
						 * 
						 * create bitly for each url in text
						 * self.generateBitly(self.links); } },
						 */

						removePreview : function(eventName) {

							var self = this;
							var text = $('#Q-area').val();
							var link = text.match(self.urlReg);

							if ($('div.selector').is(':visible')) {
								if (!link)
									$('div.selector').remove();
							}

							if (eventName.which == 8 || eventName.which == 46) {

								if (link) {

									if (self.links != link[0]) {
										$('div.selector').attr('display',
												'none');
										$('div.selector')
												.parents('form.ask-disccution')
												.find(
														'input[type="hidden"].preview_input')
												.remove();
										$('div.selector').remove();
										$('.preview_input').remove();
									}
								} else {
									$('div.selector').attr('display', 'none');
									$('div.selector')
											.parents('form.ask-disccution')
											.find(
													'input[type="hidden"].preview_input')
											.remove();
									$('div.selector').remove();
									$('.preview_input').remove();

								}

							}

						},

						/**
						 * generate bitly and preview for url
						 */
						generateBitly : function(links) {
							var self = this;
							var questionText = $('#Q-area').val();

							self.links = questionText.match(self.urlReg);

							if (!self.links)
								self.links = questionText.match(self.website);
							else
								self.links = self.links[0];

							if (links) {
								if (!self.urlRegex2.test(links[0])) {
									urlLink = "http://" + links[0];
								} else {
									urlLink = links[0];
								}

								// To check whether it is google docs or not
								if (!urlLink
										.match(/^(https:\/\/docs.google.com\/)/)) {
									/* don't create bitly for shortened url */
									if (!urlLink
.match(/^(http:\/\/bstre.am\/)/)) {
/* create bitly */
$.ajax({
											type : 'POST',
											url : "bitly",
											data : {
												link : urlLink
											},
											dataType : "json",
											success : function(data) {
												var que = $('#Q-area').val();
												question = que
														.replace(links[0],
																data.data.url);
												self.links = data.data.url;
												$('#Q-area').val(question);

											}
										});

										var preview = {
											// Instead of posting to the server,
											// send the object
											// to display for
											// rendering to the feed.
											submit : function(e, data) {
												e.preventDefault();

											}
										}

									}
								}
							}
						},

						/**
						 * Sort questions
						 */
						sortQuestions : function(eventName) {

							eventName.preventDefault();
							var self = this;
							this.pageNo = 1;
							var streamId = $('.sortable li.active').attr('id');
							var sortKey = $(eventName.target).attr('value');
							self.questionSortedType = sortKey;
							/* render the message list */
							view = this.getViewById('questionListView');
							if (view) {

								view.data.url = "/getAllQuestionsForAStream/"
										+ streamId + "/" + sortKey + "/"
										+ view.messagesPerPage + "/"
										+ view.pageNo;
								view.fetch();

							}

							$('#sortQuestionBy-select').text(
									$(eventName.target).text());
							$('#sortQuestionBy-select').attr('value', sortKey);

						},

						/**
						 * sort questions by keyword
						 */
						sortQuestionsByKey : function(eventName) {

							var self = this;
							this.pageNo = 1;
							var streamId = $('.sortable li.active').attr('id');
							var keyword = $('#sortQ_by_key').val();

							if (eventName.which == 13) {
								self.questionSortedType = "keyword";
								eventName.preventDefault();
								if (keyword) {
									/* render the message list */
									view = this.getViewById('questionListView');
									if (view) {

										view.data.url = "/getAllQuestionsForAStream/"
												+ streamId
												+ "/"
												+ keyword
												+ "/"
												+ view.messagesPerPage
												+ "/" + view.pageNo;
										view.fetch();

									}
								}

							}
						},

						/**
						 * sort questions within a period
						 */
						sortQuestionsWithinAPeriod : function(eventName) {
							eventName.preventDefault();
							$('#sortQueByDate-select').text(
									$(eventName.target).text());
						},

						/**
						 * select private to class options
						 */
						selectPrivateToList : function(eventName) {

							eventName.preventDefault();
							$('#Q-privateTo-select').text(
									$(eventName.target).text());

							// uncheck private check box when select Public
							if ($(eventName.target).text() == "Public") {
								$('#Q-private-to').attr('checked', false);
							} else {
								$('#Q-private-to').attr('checked', true);
								$('#share-discussions li.active').removeClass(
										'active');
							}

						},

						/**
						 * activate share icon on selection
						 */
						actvateShareIcon : function(eventName) {

							eventName.preventDefault();
							var self = this;
							$('#Q-private-to').attr('checked', false);
							$('#Q-privateTo-select').text("Public");
							$('#Q-privateTo-select').attr('value', 'public');

							if ($(eventName.target).parents('li').hasClass(
									'active')) {
								self.selected_medias.remove($(eventName.target)
										.parents('li').attr('name'));
								$(eventName.target).parents('li').removeClass(
										'active');
							} else {
								self.selected_medias.push($(eventName.target)
										.parents('li').attr('name'));
								$(eventName.target).parents('li').addClass(
										'active');
							}

						},

						/**
						 * select Private / Public ( social share ) options
						 */
						checkPrivateAccess : function(eventName) {
							var streamName = $('.sortable li.active').attr(
									'name');

							if ($('#Q-private-to').attr('checked') != 'checked') {
								$('#Q-privateTo-select').text("Public");

							} else {
								$('#Q-privateTo-select').text(streamName);
								$('#share-discussions li.active').removeClass(
										'active');
							}

						},

						/**
						 * show Upload files option when we select category
						 */
						uploadFiles : function(eventName) {

							eventName.preventDefault();
							$('#Q-files-area').click();

						},

						/**
						 * get files data to be upload
						 */
						getUploadedData : function(e) {


							$('a.ask-button').css('visibility', 'hidden');
							var self = this;
							file = e.target.files[0];
							var reader = new FileReader();
							/*
							 * var fileSize = Math.round(file.size/500);
							 * if(fileSize < 500){ fileSize = 500; }
							 */

							/* capture the file informations */
							reader.onload = (function(f) {
								self.file = file;
								// self.bar = $('.bar'); // progress bar
								// self.bar.width('');
								// self.bar.text("");
								clearInterval(self.progress);
								$('.fileUploadMsg').css('visibility', 'visible');
								$('.fileUploadMsg').css('display', 'block');
								$('div#questionFileUploadingImage #floatingCirclesG').css('visibility', 'visible');
								$('div#questionFileUploadingImage #floatingCirclesG').css('display', 'block');
								$('#Q-file-name').html(f.name);
								$('#Q-file-area').show();
								// $('.progress-container').show();
								//$('.ask-outer').css('height', '0px');
								$('.ask-outer').height(function(index, height) {
									return (height + 70);
								});
								$("ul#Q-file-area").css('height','70px');
							})(file);

							// read the file as data URL
							reader.readAsDataURL(file);
							
							/* updating progress bar */
							/*
							 * this.progress = setInterval(function() {
							 * 
							 * var self = this.bar;
							 * 
							 * this.bar = $('.bar'); var self = this.bar; if
							 * (this.bar.width() >= 195) {
							 * clearInterval(this.progress); } else {
							 * this.bar.width(this.bar.width() + 10); }
							 * this.bar.text(this.bar.width() / 2 + "%");
							 *  }, fileSize);
							 */
							
							var message = $('#msg-area').val();
							var msgAccess = $('#private-to').attr('checked');
							var privateTo = $('#select-privateTo')
									.attr('value');
							if (msgAccess == "checked") {
								messageAccess = privateTo;
							} else {
								messageAccess = "Public";
							}
							var streamId = $('.sortable li.active').attr('id');
							
							var data;
							data = new FormData();
							data.append('docDescription', question);
							data.append('docAccess', messageAccess);
							data.append('docData', self.file);
							data.append('streamId', streamId);
							data.append('uploadedFrom', "question");

							/* post profile page details */
							$
									.ajax({
										type : 'POST',
										data : data,
										url : "/uploadDocumentFromDisk",
										cache : false,
										contentType : false,
										processData : false,
										dataType : "json",
										success : function(data) {
											$('.fileUploadMsg').css('visibility', 'hidden');
											$('.fileUploadMsg').css('display', 'none');
											$('div#questionFileUploadingImage #floatingCirclesG').css('visibility', 'hidden');
											$('div#questionFileUploadingImage #floatingCirclesG').css('display', 'none');
											self.docurlAmazon = data[0];
											$('a.ask-button').css('top', '40');
											$('a.ask-button').css('visibility', 'visible');
										}
									});

							

						
							
							
							
							
							
							
							//;;;;;;;;;;;;;;;;;
							
						/*	var self = this;
							;
							file = e.target.files[0];
							var reader = new FileReader();

							 capture the file informations 
							reader.onload = (function(f) {
								self.file = file;
								self.bar = $('.bar'); // progress bar
								self.bar.width('');
								self.bar.text("");
								clearInterval(self.progress);
								$('#Q-file-name').html(f.name);
								$('#Q-file-area').show();

							})(file);

							// read the file as data URL
							reader.readAsDataURL(file);*/

						},

						/**
						 * function for post questions
						 */
						postQuestion : function(eventName) {
							
							$('#msg-area').css('margin','-1px 0 -5px 14px');
							$('#msg-area').css('padding','5px 6px 4px 6px');
							$('.ask-outer').css('height', '0px');
							$('a.ask-button').css('visibility', 'hidden');
							$('div.loadingImage').css('display','block');
							$('#Q-file-area').hide();
							
							// upload file
							var self = this;
							var streamId = $('.sortable li.active').attr('id');
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var question = $('#Q-area').val();

							// get message access private ? / public ?
							var questionAccess, googleDoc = false;
							var queAccess = $('#Q-private-to').attr('checked');
							var privateTo = $('#Q-privateTo-select').text();
							if (queAccess == "checked") {
								if (privateTo == "My School") {
									questionAccess = "PrivateToSchool";
								} else {
									questionAccess = "PrivateToClass";
								}

							} else {
								questionAccess = "Public";
							}

							var trueUrl = '';
							if (streamId) {

								/* if there is any files for uploading */
								if (this.file) {
									
								/*	$('.progress-container').show();

									 updating progress bar 
									this.progress = setInterval(
											function() {

												this.bar = $('.bar');
												if (this.bar.width() >= 194) {
													clearInterval(this.progress);
												} else {
													this.bar.width(this.bar
															.width() + 8);
												}
												this.bar.text(this.bar.width()
														/ 2 + "%");

											}, 800);*/

									var data;
									data = new FormData();
									data.append('docDescription', question);
									data.append('docAccess', questionAccess);
									data.append('docData', self.file);
									data.append('streamId', streamId);
									data.append('uploadedFrom', "question");
									data.append('docURL', self.docurlAmazon);

									/* post profile page details */
									$
									.ajax({
												type : 'POST',
												data : data,
												url : "/postDocumentFromDisk",
												cache : false,
												contentType : false,
												processData : false,
												dataType : "json",
												success : function(data) {

													// set progress bar as 100 %
													$('#Q-area').val("");
													$('#uploded-file').hide();

													self.file = "";

													$('#file-upload-loader')
															.css("display",
																	"none");
													
													var datVal = formatDateVal(data.question.timeCreated);

													var datas = {
														"data" : data,
														"datVal" : datVal
													}

													// set the response data to
													// 	model
													self.data.models[0]
													.set({
																question : data.question,
																docName : data.docName,
																docDescription : data.docDescription,
																profilePic : data.profilePic
															})

													 /* Pubnub auto push */
															
													 PUBNUB.publish({
													 channel : "stream",
													 message : {
														 pagePushUid: self.pagePushUid,
														 streamId:streamId,
														 data:self.data.models[0]}
													 })
															

													var questionItemView = new QuestionItemView(
															{
																model : self.data.models[0]
															});
													$(
															'#questionListView div.content')
															.prepend(
																	questionItemView
																			.render().el);
													// $('#questionStreamView
													// div.baseview').prepend(questionItemView.render().el);
													$('.loadingImage').css('display','none');
													self.file = "";

													self.selected_medias = [];
													$(
															'#share-discussions li.active')
															.removeClass(
																	'active');
													
													$('a.ask-button').css(
															'visibility',
															'hidden');
													$('.ask-outer')
															.css('height',
																	'0px');

												}
											});

									self.file = "";

								} else {

									if (question.match(/^[\s]*$/))
										return;

									// find link part from the message
									question = $.trim(question);
									var link = question.match(self.urlReg);

									if (!link)
										link = question.match(self.website);

									if (link) {
										if (!self.urlRegex2.test(link[0])) {
											urlLink = "http://" + link[0];
										} else {
											urlLink = link[0];
										}

										var questionBody = question, link = questionBody
												.match(self.urlReg);

										if (!link)
											link = questionBody
													.match(self.website);

										var questionUrl = questionBody.replace(
												self.urlRegex1, function(
														questionUrlw) {
													trueurl = questionUrl;
													return questionUrl;
												});

										// To check whether it is google docs or
										// not
										if (!urlLink
												.match(/^(https:\/\/docs.google.com\/)/)) {
											// check the url is already in bitly
											// state or
											// not
											if (!urlLink
.match(/^(http:\/\/bstre.am\/)/)) {
/* post url information */
$
.ajax({
															type : 'POST',
															url : 'bitly',
															data : {
																link : urlLink
															},
															dataType : "json",
															success : function(
																	data) {
																question = question
																		.replace(
																				link[0],
																				data.data.url);
																self
																		.postQuestionToServer(
																				question,
																				streamId,
																				questionAccess,
																				googleDoc);

															}
														});
											} else {
												self.postQuestionToServer(
														question, streamId,
														questionAccess,
														googleDoc);
											}
										} // doc
										else // case: for doc upload
										{
											googleDoc = true;
											self.postQuestionToServer(question,
													streamId, questionAccess,
													googleDoc);

										}
									}
									// case: link is not present in message
									else {
										self.postQuestionToServer(question,
												streamId, questionAccess,
												googleDoc);
									}

									// self.postQuestionToServer(question,streamId,questionAccess);
								}
							}

							
							 /* setTimeout(function() {
							  $("#discussions-link").click(); }, 125)*/
							 
							$('#Q-area').css('padding', '4px 6px');
							$('#Q-area').css('margin','1px 0 -5px 14px');
							$('a#post-question').css('visibility',
									'hidden');
							$('.ask-outer').css('height', '0px');
							$('textarea#Q-area').val('');
							$('#pollArea').slideUp(700);
							$("#discussions-link").click();
					

						},

						/**
						 * click to view areas for adding poll options
						 */
						addPollOptionsArea : function(eventName) {
							eventName.preventDefault();

							this.options = 2;
							$('#pollArea').slideDown(700);
						},

						/**
						 * function to add more poll options
						 */
						addMorePollOptions : function(eventName) {

							eventName.preventDefault();

							this.options++;
							if (this.options == 3)
								var options = '<li class="moreOptions"><input type="text"   id="option'
										+ this.options
										+ '" placeholder="Add 3rd Poll Option" name="Add Option"> </li>';
							else
								var options = '<li class="moreOptions"><input type="text"   id="option'
										+ this.options
										+ '" placeholder="Add '
										+ this.options
										+ 'th Poll Option" name="Add Option"> </li>';

							$('#pollArea li').last().after(options);
						},

						/**
						 * POST question details to server
						 */
						postQuestionToServer : function(question, streamId,
								questionAccess, googleDoc) {

							var self = this;
							this.data.models[0] = new QuestionModel();

							if (googleDoc == true) {

								console.log(44);
								this.data.models[0].removeAttr('question');
								this.data.models[0].removeAttr('profilePic');
								this.data.models[0].removeAttr('followed');
								this.data.models[0]
										.removeAttr('followerOfMessagePoster');
								this.data.models[0].removeAttr('rocked');

								this.data.models[0]
										.removeAttr('questionAccess');

								this.data.models.url = "/newDocument";

								// set values to model
								this.data.models[0]
										.save(
												{
													streamId : streamId,
													docName : question,
													docAccess : questionAccess,
													docURL : question,
													docType : 'GoogleDocs',
													docDescription : ''
},
{
													success : function(model,
															response) {

														/*
														 * PUBNUB -- AUTO AJAX
														 * PUSH
														 */
PUBNUB
.publish({
																	channel : "questionsMainStream",
message : {
																		pagePushUid : self.pagePushUid,
																		streamId : streamId,
																		data : response
																	}
																})
														/*
														 * PUBNUB -- AUTO AJAX
														 * PUSH
														 */
PUBNUB
.publish({
																	channel : "questionsSideStream",
message : {
																		pagePushUid : self.pagePushUid,
																		streamId : streamId,
																		data : response
																	}
																})

														var questionItemView = new QuestionItemView(
																{
																	model : self.data.models[0]
																});
														$(
																'#questionListView div.content')
																.prepend(
																		questionItemView
																				.render().el);
														$('.loadingImage').css('display','none');
														// $('#questionStreamView
														// div.baseview').prepend(questionItemView.render().el);

														/* share widget */
														if (self.selected_medias.length != 0) {
															_
																	.each(
																			self.data.models[0],
																			function(
																					data) {
																				showJanrainShareWidget(
																						self.data.models[0].attributes.question.questionBody,
																						'View my Beamstream post',
																						'http://beamstream.com',
																						self.data.models[0].attributes.question.questionBody,
																						self.selected_medias);
																			});
														}

														/*
														 * delete default
														 * embedly preview
														 */
														$('div.selector').attr(
																'display',
																'none');
														$('div.selector')
																.parents(
																		'form.ask-disccution')
																.find(
																		'input[type="hidden"].preview_input')
																.remove();
														$('div.selector')
																.remove();
														$('.preview_input')
																.remove();
														$('#Q-area').val("");
														$(
																'#share-discussions li.active')
																.removeClass(
																		'active');
														self.selected_medias = [];

													},
													error : function(model,
															response) {
														$('#msg-area').val("");
													}

												});
							}

							else {

								self.color = 0;
								var pollOptions = '';

								for (var i = 1; i <= this.options; i++) {
									pollOptions += $('#option' + i).val() + ',';
									$('#option' + i).val('');
								}

								pollOptions = pollOptions.substring(0,
										pollOptions.length - 1);

								this.data.models[0].url = "/question";
								if (pollOptions == '') {

									var Question = new QuestionModel()
									this.data.models[0]
											.removeAttr('pollOptions');
this.data.models[0]
.save(
{
														streamId : streamId,
														questionBody : question,
														questionAccess : questionAccess
},




{
														success : function(
																model, response) {

															// show the posted
															// message on feed
															var questionItemView = new QuestionItemView(
																	{
																		model : self.data.models[0]
																	});
															$(
																	'#questionListView div.content')
																	.prepend(
																			questionItemView
																					.render().el);
															$('.loadingImage').css('display','none');

															$('div.selector')
																	.attr(
																			'display',
																			'none');

															$('div.selector')
																	.parents(
																			'form.ask-disccution')
																	.find(
																			'input[type="hidden"].preview_input')
																	.remove();

															$('div.selector')
																	.remove();

															$('.preview_input')
																	.remove();

															$('#Q-area')
																	.val("");

															$(
																	'#share-discussions li.active')
																	.removeClass(
																			'active');

															$('#pollArea')
																	.slideUp(
																			700);

															$('.drag-rectangle')
																	.tooltip();

															self.options = 0;
															/*
															 * PUBNUB -- AUTO
															 * AJAX PUSH
															 */


PUBNUB
.publish({
																		channel : "questionsMainStream",
message : {
																			pagePushUid : self.pagePushUid,
																			streamId : streamId,
																			data : response
																		}
																	})

															/*
															 * PUBNUB -- AUTO
															 * AJAX PUSH
															 */




PUBNUB
.publish({
																		channel : "questionsSideStream",
message : {
																			pagePushUid : self.pagePushUid,
																			streamId : streamId,
																			data : response
																		}
																	})

															/* share widget */
															if (self.selected_medias.length != 0) {
																_
																		.each(
																				self.data.models[0],
																				function(
																						data) {
																					showJanrainShareWidget(
																							self.data.models[0].attributes.question.questionBody,
																							'View my Beamstream post',
																							'http://beamstream.com',
																							self.data.models[0].attributes.question.questionBody,
																							self.selected_medias);
																				});
															}

															self.selected_medias = [];
														},

														error : function(model,
																response) {
															$('#Q-area')
																	.val("");
															$('#pollArea')
																	.slideUp(
																			700);
														}

													});

								}

								else {



// set values to model
this.data.models[0]
.save(
{
														streamId : streamId,
														questionBody : question,
														questionAccess : questionAccess,
														pollOptions : pollOptions
},
{
														success : function(
																model, response) {

															/*
															 * PUBNUB -- AUTO
															 * AJAX PUSH
															 */
PUBNUB
.publish({
																		channel : "questionsMainStream",
message : {
																			pagePushUid : self.pagePushUid,
																			streamId : streamId,
																			data : response
																		}
																	})
															/*
															 * PUBNUB -- AUTO
															 * AJAX PUSH
															 */
PUBNUB
.publish({
																		channel : "questionsSideStream",
message : {
																			pagePushUid : self.pagePushUid,
																			streamId : streamId,
																			data : response
																		}
																	})
															// show the posted
															// message on feed
															var questionItemView = new QuestionItemView(
																	{
																		model : self.data.models[0]
																	});
															$(
																	'#questionListView div.content')
																	.prepend(
																			questionItemView
																					.render().el);
															// $('#questionStreamView
															// div.baseview').prepend(questionItemView.render().el);
															/* share widget */
															if (self.selected_medias.length != 0) {
																_
																		.each(
																				self.data.models[0],
																				function(
																						data) {
																					showJanrainShareWidget(
																							self.data.models[0].attributes.question.questionBody,
																							'View my Beamstream post',
																							'http://beamstream.com',
																							self.data.models[0].attributes.question.questionBody,
																							self.selected_medias);
																				});
															}

															$('div.selector')
																	.attr(
																			'display',
																			'none');
															$('div.selector')
																	.parents(
																			'form.ask-disccution')
																	.find(
																			'input[type="hidden"].preview_input')
																	.remove();
															$('div.selector')
																	.remove();
															$('.preview_input')
																	.remove();
															$('#Q-area')
																	.val("");
															$(
																	'#share-discussions li.active')
																	.removeClass(
																			'active');
															self.options = 0;
															$('.drag-rectangle')
																	.tooltip();
															$('#pollArea')
																	.slideUp(
																			700);
															self.selected_medias = [];

														},
														error : function(model,
																response) {
															$('#Q-area')
																	.val("");
															$('#pollArea')
																	.slideUp(
																			700);
														}

													});
								}
							}

						},

						/**
						 * common function for dispaying question after post
						 * (for / auto push )
						 */
						showQuestion : function(streamId, data) {

							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var trueurl = '';

							var compiledTemplate = Handlebars
									.compile(QuestionMessage);
							$('#all-questions').prepend(compiledTemplate({
								data : data
							}));

							var source = $("#tpl-questions_with_polls").html();
							var template = Handlebars.compile(source);
							$('#all-questions').prepend(template({
								data : data,
								rocks : data.question.rockers.length
							}));
							$('.drag-rectangle').tooltip();
							var pollCount = data.polls.length;
							this.color = 0;
							// render each poll options and its polling
							// percentage
							if (pollCount > 0) {
								$('#' + data.question.id.id + '-Answer').hide();
								$('#' + data.question.id.id + '-Answerbutton')
										.hide();
							}

						},

						/**
						 * PUBNUB real time push
						 */
						setupPushConnection : function() {
							var self = this;
							self.pagePushUid = Math.floor(
									Math.random() * 16777215).toString(16);
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var trueUrl = '';

							// Trigger the change pagePushUid event
							this.trigger('change:pagePushUid', {
								pagePushUid : self.pagePushUid
							});

/* for question posting */
PUBNUB
.subscribe({
										channel : "questionsMainStream",
										restore : false,
										callback : function(question) {
											var streamId = $(
													'.sortable li.active')
													.attr('id');

											if (question.pagePushUid != self.pagePushUid) {

												if (question.streamId == streamId) {
  /* set the values to Question Model */
  questionModel = new QuestionModel();
  questionModel.set({
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
													var questionItemView = new QuestionItemView(
															{
																model : questionModel
															});
													$(
															'#questionListView div.content')
															.prepend(
																	questionItemView
																			.render().el);

												}
											}

										}
									})

/* for questio voting */
PUBNUB
.subscribe({
										channel : "voting",
										restore : false,
										callback : function(question) {

											var streamId = $(
													'.sortable li.active')
													.attr('id');
											if (question.pagePushUid != self.pagePushUid) {
												if (question.streamId == streamId) {
													if (document
															.getElementById(question.questionId)) {
														var values = [];
														$(
																'input#'
																		+ question.data.id.id
																		+ '-voteCount')
																.val(
																		question.data.voters.length);

														// get all poll options
														// vote count
														$(
																'input.'
																		+ question.questionId
																		+ '-polls')
																.each(
																		function() {
																			values
																					.push(parseInt($(
																							this)
																							.val()));
																		});

														/* updating pie charts */
														$(
																"#"
																		+ question.questionId
																		+ "-piechart")
																.find('svg')
																.remove();
														donut[question.questionId] = new Donut(
																new Raphael(
																		""
																				+ question.questionId
																				+ "-piechart",
																		200,
																		200));
														donut[question.questionId]
																.create(100,
																		100,
																		30, 55,
																		100,
																		values);
													}
													if (question.userId == localStorage["loggedUserId"]) {
														$(
																"input[id="
																		+ question.data.id.id
																		+ "]")
																.attr(
																		'checked',
																		true);
														$(
																"input[name="
																		+ question.questionId
																		+ "]")
																.attr(
																		'disabled',
																		true);

													}
												}

											}
										}
									})

							/* auto push functionality for comments */
							PUBNUB
									.subscribe({

										channel : "questioncommentMainStream",
										restore : false,

										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												if (!document
														.getElementById(question.data.id.id)) {

													$(
															'#'
																	+ question.parent
																	+ '-addComments')
															.slideUp(200);

													/*
													 * display the posted
													 * comment
													 */
													var compiledTemplate = Handlebars
															.compile(QuestionComment);
													$(
															'#'
																	+ question.parent
																	+ '-allComments')
.prepend(
compiledTemplate({
																		data : question.data,
																		profileImage : question.profileImage
																	}));

													if (!$(
															'#'
																	+ question.parent
																	+ '-allComments')
															.is(':visible')) {
														$(
																'#'
																		+ question.parent
																		+ '-msgRockers')
																.slideUp(1);
														$(
																'#'
																		+ question.parent
																		+ '-newCommentList')
																.slideDown(1);
														$(
																'#'
																		+ question.parent
																		+ '-newCommentList')
.prepend(
compiledTemplate({
																			data : question.data,
																			profileImage : question.profileImage
																		}));

													}
													question.cmtCount++;
													$(
															'#'
																	+ question.parent
																	+ '-show-hide')
															.text("Hide All");
													$(
															'#'
																	+ question.parent
																	+ '-totalComment')
															.text(
																	question.cmtCount);

												}
											}
										}

									})

							/* auto push functionality for comments */
							PUBNUB
									.subscribe({

										channel : "questionanswerMainStream",
										restore : false,

										callback : function(answer) {
											if (question.pagePushUid != self.pagePushUid) {
												if (!document
														.getElementById(answer.data.id.id)) {
													$(
															'#'
																	+ answer.parent
																	+ '-addAnswer')
															.slideUp(200);

													/*
													 * display the posted
													 * comment
													 */
													var compiledTemplate = Handlebars
															.compile(QuestionAnswer);
													$(
															'#'
																	+ answer.parent
																	+ '-allAnswers')
.prepend(
compiledTemplate({
																		data : answer.data,
																		profileImage : question.profileImage
																	}));

													if (!$(
															'#'
																	+ answer.parent
																	+ '-allAnswers')
															.is(':visible')) {
														if ($(
																'#'
																		+ answer.parent
																		+ '-allComments')
																.is(":visible")) {
															$(
																	'#'
																			+ answer.parent
																			+ '-allComments')
																	.hide();
														}
														$(
																'#'
																		+ answer.parent
																		+ '-msgRockers')
																.slideUp(1);
														$(
																'#'
																		+ answer.parent
																		+ '-newAnswerList')
																.slideDown(1);
														$(
																'#'
																		+ answer.parent
																		+ '-newAnswerList')
.prepend(
compiledTemplate({
																			data : answer.data,
																			profileImage : localStorage["loggedUserProfileUrl"]
																		}));

													}
													answer.cmtCount++;
													$(
															'#'
																	+ answer.parent
																	+ '-show-hide')
															.text("Hide All");
													$(
															'#'
																	+ answer.parent
																	+ '-totalAnswer')
															.text(
																	answer.cmtCount);

												}
											}
										}

									})

							/* auto push functionality for comments */
							PUBNUB
									.subscribe({

										channel : "sideCommentPushMainStream",
										restore : false,

										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												if (!document
														.getElementById(question.data.id.id)) {

													// $('#'+question.parent+'-addComments').slideUp(200);

													/*
													 * display the posted
													 * comment
													 */
													var compiledTemplate = Handlebars
															.compile(QuestionComment);
													// $('#'+question.questionId+'-allComments').prepend(compiledTemplate({data:question.data}));
													if ($(
															'#'
																	+ question.questionId
																	+ '-allAnswers')
															.is(':visible')) {
														$(
																'#'
																		+ question.questionId
																		+ '-allAnswers')
																.hide();
													}
													if ($(
															'#'
																	+ question.questionId
																	+ '-newAnswerList')
															.is(':visible')) {
														$(
																'#'
																		+ question.questionId
																		+ '-newAnswerList')
																.hide();
													}

													if ($(
															'#'
																	+ question.questionId
																	+ '-allComments')
															.is(':visible')) {
														// $('#'+question.questionId+'-msgRockers').slideUp(1);
														$(
																'#'
																		+ question.questionId
																		+ '-newCommentList')
																.slideDown(1);
														$(
																'#'
																		+ question.questionId
																		+ '-newCommentList')
.prepend(
compiledTemplate({
																			data : question.data,
																			profileImage : question.profileImage
																		}));

													} else {
														$(
																'#'
																		+ question.questionId
																		+ '-newCommentList')
																.slideDown(1);
														$(
																'#'
																		+ question.questionId
																		+ '-newCommentList')
.prepend(
compiledTemplate({
																			data : question.data,
																			profileImage : localStorage["loggedUserProfileUrl"]
																		}));
													}

													question.cmtCount++;
													$(
															'#'
																	+ question.questionId
																	+ '-show-hide')
															.text("Hide All");
													$(
															'#'
																	+ question.questionId
																	+ '-totalComment')
															.text(
																	question.cmtCount);

												}
											}

										}

									})

							/* auto push functionality for comments */
							PUBNUB
									.subscribe({

										channel : "sideAnswerPushMainStream",
										restore : false,

										callback : function(answer) {

											if (question.pagePushUid != self.pagePushUid) {
												if (!document
														.getElementById(answer.data.id.id)) {

													// $('#'+answer.parent+'-addAnswer').slideUp(200);

													/*
													 * display the posted
													 * comment
													 */
													var compiledTemplate = Handlebars
															.compile(QuestionAnswer);

													if ($(
															'#'
																	+ answer.questionId
																	+ '-allComments')
															.is(":visible")) {
														$(
																'#'
																		+ answer.questionId
																		+ '-allComments')
																.hide();
													}
													if ($(
															'#'
																	+ answer.questionId
																	+ '-newCommentList')
															.is(":visible")) {
														$(
																'#'
																		+ answer.questionId
																		+ '-newCommentList')
																.hide();
													}
													if ($(
															'#'
																	+ answer.questionId
																	+ '-allAnswers')
															.is(':visible')) {
														$(
																'#'
																		+ answer.questionId
																		+ '-newAnswerList')
.prepend(
compiledTemplate({
																			data : answer.data,
																			profileImage : localStorage["loggedUserProfileUrl"]
																		}));
													} else {
														$(
																'#'
																		+ answer.questionId
																		+ '-newAnswerList')
																.slideDown(1);
														$(
																'#'
																		+ answer.questionId
																		+ '-newAnswerList')
.prepend(
compiledTemplate({
																			data : answer.data,
																			profileImage : localStorage["loggedUserProfileUrl"]
																		}));
													}

													answer.ansCount++;
													$(
															'#'
																	+ answer.questionId
																	+ '-show-hide')
															.text("Hide All");
													$(
															'#'
																	+ answer.questionId
																	+ '-totalAnswer')
															.text(
																	answer.ansCount);

												}
											}
										}

									})

							/* for Comment Rocks */
							PUBNUB
									.subscribe({

										channel : "ques_commentRock",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {
												$(
														'div#'
																+ question.questionId
																+ '-newCommentList')
														.find(
																'a#'
																		+ question.commentId
																		+ '-mrockCount')
														.html(question.data);
												$(
														'div#'
																+ question.questionId
																+ '-allComments')
														.find(
																'a#'
																		+ question.commentId
																		+ '-mrockCount')
														.html(question.data);
											}
										}
									})

							PUBNUB
									.subscribe({

										channel : "ques_answerRock",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {
												$(
														'div#'
																+ question.questionId
																+ '-newAnswerList')
														.find(
																'a#'
																		+ question.commentId
																		+ '-mrockCount')
														.html(question.data);
												$(
														'div#'
																+ question.questionId
																+ '-allAnswers')
														.find(
																'a#'
																		+ question.commentId
																		+ '-mrockCount')
														.html(question.data);
											}
										}
									})

							/* for question Rocks */
							PUBNUB
									.subscribe({

										channel : "questionRockMainStream",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {
												$(
														'#'
																+ question.quesId
																+ '-qstRockCount')
														.find('span').html(
																question.data);

											}
										}
									})

							PUBNUB
									.subscribe({

										channel : "questionRockfromSidetoMainStream",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {
												$(
														'#'
																+ question.quesId
																+ '-qstRockCount')
														.find('span').html(
																question.data);

												if (localStorage["loggedUserId"] == question.ownerId) {
													if ($(
															'#'
																	+ question.quesId
																	+ '-qstRockCount')
															.hasClass(
																	'downrocks-message')) {
														$(
																'#'
																		+ question.quesId
																		+ '-qstRockCount')
																.removeClass(
																		'downrocks-message');
														$(
																'#'
																		+ question.quesId
																		+ '-qstRockCount')
																.addClass(
																		'uprocks-message');
													} else {
														$(
																'#'
																		+ question.quesId
																		+ '-qstRockCount')
																.removeClass(
																		'uprocks-message');
														$(
																'#'
																		+ question.quesId
																		+ '-qstRockCount')
																.addClass(
																		'downrocks-message');
													}

												}

											}
										}
									})

							/* for updating user count of stream */
							PUBNUB
									.subscribe({

										channel : "classMembers",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {
												$(
														'span#'
																+ question.data.stream.id.id
																+ '-users')
														.html(
																question.data.stream.usersOfStream.length);
											}
										}
									})

							/* for delete question case */
							PUBNUB
									.subscribe({

										channel : "deleteQuestionMainStream",
										restore : false,
										callback : function(question) {
											if (question.pagePushUid != self.pagePushUid) {

												$('div#' + question.questionId)
														.remove();
											}
										}
									})

							/* for delete comment case */
							PUBNUB
									.subscribe({

										channel : "delete_ques_Comment",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												var commentCount = $(
														'#'
																+ question.questionId
																+ '-totalComment')
														.text()

												$(
														'div#'
																+ question.questionId
																+ '-newCommentList')
														.find(
																'div#'
																		+ question.commentId)
														.remove();
												$(
														'div#'
																+ question.questionId
																+ '-allComments')
														.find(
																'div#'
																		+ question.commentId)
														.remove();
												$(
														'#'
																+ question.questionId
																+ '-totalComment')
														.text(commentCount - 1);

											}
										}
									})

							PUBNUB
									.subscribe({

										channel : "delete_ques_Answer",
										restore : false,
										callback : function(question) {

											if (question.pagePushUid != self.pagePushUid) {

												var answerCount = $(
														'#'
																+ question.questionId
																+ '-totalAnswer')
														.text()

												$(
														'div#'
																+ question.questionId
																+ '-newAnswerList')
														.find(
																'div#'
																		+ question.answerId)
														.remove();
												$(
														'div#'
																+ question.questionId
																+ '-allAnswers')
														.find(
																'div#'
																		+ question.answerId)
														.remove();
												$(
														'#'
																+ question.questionId
																+ '-totalAnswer')
														.text(answerCount - 1);

											}
										}
									})

						},

					})
			return QuestionsView;
		});