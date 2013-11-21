define(
		[ 'pageView', 'view/streamSliderView', 'view/overView',
				'view/discussionsView', 'view/questionsView',
				'view/deadlinesView', 'view/calendarView',
				'view/messageListView', 'view/questionListView',
				'view/questionStreamView', 'text!templates/googledoc.tpl' ],
		function(PageView, StreamSliderView, OverView, DiscussionsView,
				QuestionsView, DeadlinesView, CalendarView, MessageListView,
				QuestionListView, QuestionStreamView, GoogleDoc) {
			var MyStreamView;
			MyStreamView = PageView
					.extend({
						objName : 'MyStreamView',
						events : {
							'click #streamTab a' : 'tabHandler',
							'click #show-info' : 'showDetails',
							'click #question' : 'addPollOptionsArea',
							'click .ques' : 'hide',
							'click #showgdocsdemo' : 'showGoogleDocs'
						},
						messagesPerPage : 10,
						pageNo : 1,
						init : function() {

							var currentStreamView = new StreamSliderView({
								el : '#sidebar'
							})
							this.addView(currentStreamView);

							this.addView(new DiscussionsView({
								el : $('#discussionsView')
							}));

							var currentMainQuestionStream = new QuestionsView({
								el : $('#questionsView')
							});
							this.addView(currentMainQuestionStream);

							this.addView(new DeadlinesView({
								el : $('#deadlinesView')
							}));
							this.addView(new CalendarView({
								el : $('#calendarView')
							}));

							this.addView(new MessageListView({
								el : $('#messageListView')
							}));
							this.addView(new QuestionListView({
								el : $('#questionListView')
							}));

							var currentQuestionStream = new QuestionStreamView(
									{
										el : $('#questionStreamView')
									});
							this.addView(currentQuestionStream);

							// on streamId change, notify the questionStream
							currentStreamView.on('change:streamId', function(
									evt) {
								currentQuestionStream.model
										.setQuestionStreamId(evt.streamId);
							});

							// // on pagePushUid change, notify the
							// questionStream
							// currentMainQuestionStream.on('change:pagePushUid',
							// function(evt){
							// currentQuestionStream.model.setPagePushUid(evt.pagePushUid);
							// console.log('pagePushUid changed',
							// evt.pagePushUid);
							// })

						},

						showGoogleDocs : function(show) {

							$
									.ajax({

										type : 'GET',
										url : 'uploadNow/show',
										dataType : "json",
										cache : false,
										contentType : false,
										processData : false,
										success : function(data) {
											$("#docsview > .drive-view-row")
													.remove();
											$
													.each(
															data,
															function(index,
																	value) {

																/*
																 * $("#docsview").append("
																 * <div
																 * class='drive-view-row'><div
																 * class='text-img'></div><div
																 * class='doc-txt-container'><div
																 * class='doc-name'>"+value._1+"</div><div
																 * class='doc-info'><div
																 * class='owner'>OWNDER:
																 * <span>ME</span></div><div
																 * class='last-modified'>LAST
																 * MODIFIED:
																 * <span>9/14/2013</span></div></div></div><a
																 * class='preview-btn'
																 * href="+value._2+">Preview
																 * To Publish</a></div>");
																 */

																if (value._1 != null)
																	var extention = value._1
																			.split('.')[1];

																if (extention == "js"
																		|| extention == "odt") {
																	$(
																			"#docsview")
																			.append(
																					" <div class='drive-view-row'><div class='text-img'></div><div class='doc-txt-container'><div class='doc-name'>"
																							+ extention
																							+ "</div><div class='doc-info'><div class='owner'>OWNDER: <span>ME</span></div>" +
																									"<div class='last-modified'>LAST MODIFIED:" +
																									" <span>9/14/2013</span></div></div></div>"
																							+"<a class='preview-btn' target='_blank' href="
																							+ value._2
																							+ ">Preview</a><a class='preview-btn' target='_blank' href='#'"
																							+ ">Publish</a></div>");

																}

																else {
																	$(
																			"#docsview")
																			.append(
																					" <div class='drive-view-row'><div class='spreadsheet-img'></div><div class='doc-txt-container'><div class='doc-name'>"
																							+ extention
																							+ "</div><div class='doc-info'>" +
																									"<div class='owner'>OWNDER: <span>ME</span>" +
																									"</div><div class='last-modified'>LAST MODIFIED: <span>9/14/2013</span></div></div></div>" +
																									"<a class='preview-btn' target='_blank' href="
																							+ value._2
																							+ ">Preview</a><a class='preview-btn' target='_blank' href='#'"
																							+ ">Publish</a></div>");

																}

																// add this
																// block
																/*
																 * var
																 * compiledTemplate =
																 * Handlebars.compile(GoogleDoc);
																 * $('#docsview').append(compiledTemplate(data));
																 */

															});

										}

									})

							$("#googledoc").modal('show');

							/*
							 * newwindow=window.open('uploadNow/show','name','height=400,width=300');
							 * if (window.focus) {newwindow.focus()};
							 */

						},

						/*
						 * var authenticateToGoogle = function(data){
						 * 
						 * alert(data._1); }
						 */

						showFriends : function() {

							// Makre an ajax call to uploadNow/show

							// success json data name -url /name-url

							$("#googledoc").modal('show');

						},

						/**
						 * show stream details on top
						 */
						showDetails : function(eventName) {
							eventName.preventDefault();
							$('.show-info').toggle(100);

						},

						addPollOptionsArea : function(eventName) {
							/*
							 * eventName.preventDefault(); this.options = 2;
							 * $('#pollArea').show();
							 */

							$('.question-button').text("ADD");
							$('.add-poll').hide();

							$('textarea#Q-area').addClass('showpolloption');
							$('textarea#Q-area').attr('placeholder',
									'Click here to add a poll ....');

						},

						hide : function(eventName) {
							/*
							 * eventName.preventDefault(); this.options = 2;
							 */
							$('#pollArea').hide();
							$('.question-button').text("ASK");
							$('.add-poll').hide();

							$('textarea#Q-area').removeClass('showpolloption');
							$('textarea#Q-area').attr('placeholder',
									'Ask your own question here.....');
						},

						tabHandler : function(e) {
							var tabId = $(e.target).attr('href').replace('#',
									''), view;

							if (tabId == 'discussionsView') {

								/*
								 * fetch all messages of a stream for
								 * messageListView
								 */
								view = this.getViewById('messageListView');
								if (view) {
									view.myStreams = this
											.getViewById('sidebar').myStreams;

									view.data.url = "/allMessagesForAStream/"
											+ this.getViewById('sidebar').streamId
											+ "/date/" + view.messagesPerPage
											+ "/" + view.pageNo + "/week";
									view.fetch();

								}
							}
							if (tabId == "questionsView") {

								/*
								 * fetch all messages of a stream for
								 * messageListView
								 */
								view = this.getViewById('questionListView');
								if (view) {
									view.myStreams = this
											.getViewById('sidebar').myStreams;

									view.data.url = "/getAllQuestionsForAStream/"
											+ this.getViewById('sidebar').streamId
											+ "/date/"
											+ view.messagesPerPage
											+ "/" + view.pageNo;
									view.fetch();

								}
							}

						}

					})
			return MyStreamView;
		});
