define(
		[ 'pageView', 'view/streamSliderView', 'view/overView',
				'view/discussionsView', 'view/questionsView',
				'view/deadlinesView', 'view/calendarView',
				'view/messageListView', 'view/questionListView',
				'view/questionStreamView' ],
		function(PageView, StreamSliderView, OverView, DiscussionsView,
				QuestionsView, DeadlinesView, CalendarView, MessageListView,
				QuestionListView, QuestionStreamView) {
			var MyStreamView;
			MyStreamView = PageView
					.extend({
						objName : 'MyStreamView',
						events : {
							'click #streamTab a' : 'tabHandler',
							'click #show-info' : 'showDetails',
							'click #question' : 'addPollOptionsArea',
							'click .ques' : 'hide',
							'click #showgdoc' : 'showGoogleDocs',
							'click #uploadgdoc' : 'uploadGoogleDocs',
							'click #uploadToGoogle' : 'uploadToGoogle',
							'click #creategdocument' : 'createGDocument',
							'click #creategspreadsheet' : 'createGSpreadsheet',
							'click #creategpresentation' : 'createGPresentation',
							'submit #uploadForm' : 'afterUpload',
							'click .publishGdocs' : 'showsidebar',
							
					
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

						afterUpload : function(event) {
							$("#uploadgoogledoc").modal('hide');
							
						   

						},
						
						
						/*Expand Side Question Stream*/
						
						sidequestionexpand:function(){
						
							/*$("#messageListView").show();
							$("#questionListView").css("display","none");*/
							
					/*		$("#questionListView").css("visibility","hidden");*/
							/*$("#questionStreamView").hide();*/
							/*$("#questionStreamView").css("visibility","hidden");*/
							/* $( "#questionStreamView" ).animate({
								    width: "300",
								    opacity: 1,
								    visibility:"visible",
								    	display:"block"
								    
								  }, 1500 );*/
							$( "#questionStreamView" ).show();
							$(".body").css("padding-right","280");
							$(".chatbox").css("right","40");
							$("#topheader").css("padding-right","19");
							
							/*$("#sidequestionexpand").css("opacity","1");*/
							
							$("#sidequestionexpand").css("right","318");
							
							
							
								 
							
							
						},
						
						showsidebar: function(){
							
							$(".showgoogledocsSidebar").show();
						},
						
						
						
						// Upload Google Doc

						uploadGoogleDocs : function(upload) {

							$.ajax({

								type : 'GET',
								url : 'uploadNow/upload',

								success : function(data) {

									String.prototype.startsWith = function(s) {
										if (this.indexOf(s) == 0)
											return true;
										return false;
									}
									if (data.toString().startsWith("http")) {
										window.location.assign(data)
									} else {
										$("#uploadgoogledoc").modal('show');
									}

								}

							});

							/*
							 * var control = $("#uplaodfilestogoogle");
							 * 
							 * $("#uploadToGoogle").on("click", function () {
							 * control.replaceWith( control = control.clone(
							 * true ) ); });
							 */

						},

						uploadToGoogle : function(event) {
							$("#uploadgoogledoc").modal('hide');

						},

						// Create Google document

						createGDocument : function(create) {
                       
							
							
							$
									.ajax({

										type : 'GET',
										url : 'uploadNow/document',

										success : function(data) {

											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data.toString().startsWith("http")) {
												window.location.assign(data)
											} else {
												$("#creategoogledoc").modal('show');
												$(".contentcreatedoc").empty();
												$(".contentcreatedoc")
														.append(
																"<iframe style='width:100%;height:100%;border-radius:0 0 10px 10px;' frameborder='0' src='http://docs.google.com/document/create?hl=en ' />");
											}
										}
									});
							$
									.ajax({

										type : 'GET',
										url : '/allStreamsForAUser',

										success : function(data) {

										
											$("select#streamSelectOption")
													.empty();
											$
													.each(
															data,
															function(index,
																	value) {

																$(
																		"select#streamSelectOption")
																		.append(
																				"<option value="
																						+ value.stream.id.id
																						+ ">"
																						+ value.stream.streamName
																						+ "</option>");
																//alert(value.stream.streamName);
															});

										}

									});

						},

						// Create Google spreadsheet

						createGSpreadsheet : function(create) {

							$
									.ajax({

										type : 'GET',
										url : 'uploadNow/spreadsheet',

										success : function(data) {
											
										
											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data.toString().startsWith("http")) {
												window.location.assign(data)
											} else {
												$("#creategoogledoc").modal(
														'show');
												$(".contentcreatedoc").empty();
												$(".contentcreatedoc")
														.append(
																"<iframe style='width:100%;height:100%;' frameborder='0' src='http://spreadsheets.google.com/ccc?new&hl=en' />");
											}
										}
									});
							$
							.ajax({

								type : 'GET',
								url : '/allStreamsForAUser',

								success : function(data) {

								
									$("select#streamSelectOption")
											.empty();
									$
											.each(
													data,
													function(index,
															value) {

														$(
																"select#streamSelectOption")
																.append(
																		"<option value="
																				+ value.stream.id.id
																				+ ">"
																				+ value.stream.streamName
																				+ "</option>");
														//alert(value.stream.streamName);
													});

								}

							});

						},

						// Create Google Presentation

						createGPresentation : function(create) {

							$
									.ajax({

										type : 'GET',
										url : 'uploadNow/presentation',

										success : function(data) {
											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data.toString().startsWith("http")) {
												window.location.assign(data)
											} else {
												$("#creategoogledoc").modal(
														'show');
												$(".contentcreatedoc").empty();

												$(".contentcreatedoc")
														.append(
																"<iframe style='width:100%;height:100%;' frameborder='0' src='https://drive.google.com' />");

											}
										}
									});
							$
							.ajax({

								type : 'GET',
								url : '/allStreamsForAUser',

								success : function(data) {

								
									$("select#streamSelectOption")
											.empty();
									$
											.each(
													data,
													function(index,
															value) {

														$(
																"select#streamSelectOption")
																.append(
																		"<option value="
																				+ value.stream.id.id
																				+ ">"
																				+ value.stream.streamName
																				+ "</option>");
														//alert(value.stream.streamName);
													});

								}

							});

						},

						// Show Google Doc

						showGoogleDocs : function(show) {
							
							$(".showgoogledocsSidebar").hide();
							$
							.ajax({

								type : 'GET',
								url : '/allStreamsForAUser',

								success : function(data) {

								
									$("select#streamSelectOption")
											.empty();
									$
											.each(
													data,
													function(index,
															value) {

														$(
																"select#streamSelectOption")
																.append(
																		"<option value="
																				+ value.stream.id.id
																				+ ">"
																				+ value.stream.streamName
																				+ "</option>");
														//alert(value.stream.streamName);
													});

								}

							});
							

							$.ajax({

										type : 'GET',
										url : 'uploadNow/show',

										success : function(data) {
													
											
													
													String.prototype.startsWith = function(
															s) {
														if (this.indexOf(s) == 0)
															return true;
														return false;
													}
													if (data.toString().startsWith("http")) {
														window.location.assign(data)
													} else {

												$("#docsview > .drive-view-row").remove();
												
												$("#showgoogledoc").modal('show');

												$.each(data,function(index,value) {
																	var nameOfDocument =  "Name Not Available";;
																	if (value._1 != null) {
																		nameOfDocument = value._1;
																		var extention = value._1.split('.')[1];
																	}
																	if (extention == "ppt" || extention == "pptx" || extention == "odp") {
																		$("#docsview")
																				.append(
																						" <div class='drive-view-row'><div class='powerpoint-img'></div><div class='doc-txt-container'><div class='doc-name'>"
																								+ nameOfDocument
																								+ "</div><div class='doc-info'><div class='owner'>OWNDER: <span>ME</span></div>"
																								+ "<div class='last-modified'>LAST MODIFIED:"
																								+ " <span>9/14/2013</span></div></div></div>"
																								+ "<a class='preview-btn' target='_blank' href="
																								+ value._2
																								+ ">Preview</a><div class='preview-btn publishGdocs'"
																								+ ">Publish</div></div>");

																	}

																	else if(extention == "xls" || extention == "ods") {
																		$("#docsview")
																				.append(
																						" <div class='drive-view-row'><div class='spreadsheet-img'></div><div class='doc-txt-container'><div class='doc-name'>"
																								+ nameOfDocument
																								+ "</div><div class='doc-info'>"
																								+ "<div class='owner'>OWNDER: <span>ME</span>"
																								+ "</div><div class='last-modified'>LAST MODIFIED: <span>9/14/2013</span></div></div></div>"
																								+ "<a class='preview-btn' target='_blank' href="
																								+ value._2
																								+ ">Preview</a><div class='preview-btn publishGdocs'"
																								+ ">Publish</div></div>");

																	}
																	
																	else {
																		$("#docsview")
																				.append(
																						" <div class='drive-view-row'><div class='text-img'></div><div class='doc-txt-container'><div class='doc-name'>"
																								+ nameOfDocument
																								+ "</div><div class='doc-info'>"
																								+ "<div class='owner'>OWNDER: <span>ME</span>"
																								+ "</div><div class='last-modified'>LAST MODIFIED: <span>9/14/2013</span></div></div></div>"
																								+ "<a class='preview-btn' target='_blank' href="
																								+ value._2
																								+ ">Preview</a><div class='preview-btn publishGdocs' "
																								+ ">Publish</div></div>");

																	}

																});
											
											}
										}

									});

							/*
							 * newwindow=window.open('uploadNow/show','name','height=400,width=300');
							 * if (window.focus) {newwindow.focus()};
							 */

						}, // Show google Doc Ends

						/*
						 * var authenticateToGoogle = function(data){
						 * 
						 * alert(data._1); }
						 */

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
