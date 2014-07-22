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
							'click #closepublishsidebar' : 'hidePublishSidebar',
							'click #questionsLink' : 'fliptoQuestion',
							'click #questions-poll-Link' : 'fliptoQuestion',
							'click #discussions-link' : 'fliptoDiscussion',
							'keypress #Q-area' : 'fliptoDiscussionfromquestion',
							'click .popout' : 'popout',
							'click .minimize' : 'minimize',
							'click #sidequestionexpand' : 'restoretonormal',
							'click #create-google-docs-close' : 'askToPublishDocs',
							'click .cancel-publish' : 'askToPublishDocs',
							'click #googleDocPopupCloseBtn' : 'updateGoogleDoc',
							'click #googleDocGeneralCloseBtn' : 'closeGoogleDocGeneralPopup',
						},
						messagesPerPage : 10,
						pageNo : 1,
						init : function() {
							
							var fullDate = new Date();
							var twoDigitMonth = fullDate.getMonth()+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
							var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
							var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();

							$("div.current-date").text(currentDate);

							var currentStreamView = new StreamSliderView({
								el : $('#sidebar')
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
								currentQuestionStream.model.setQuestionStreamId(evt.streamId);						
								
								if(evt.streamId !== null && evt.streamId !== "remove-button")
									{
									$.ajax({
										
										type: 'GET',	           
							            url: "/noOfUnansweredQuestions/"+evt.streamId,
							            success: function(data){
							            	
							            	
							            	$("#number-new-questions").text	(data.count);
							            }
										
									});
									
									}

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
						
						closeGoogleDocGeneralPopup : function(){
							window.history.pushState({}, "stream", "/stream");
						},
						
						updateGoogleDoc : function(eventName){
							
							var googleDocURL = $('#iframe-').attr('src').split("/");
							var fileId = "";
							if(googleDocURL.length == 9) {
								fileId = googleDocURL[7];
								}
							else if(googleDocURL.length == 7) {
								fileId = googleDocURL[5];
							}
							
							window.history.pushState({}, "stream", "/stream");
							
							$.ajax({
								
								type: 'GET',	           
					            url: 'googleDoc/update '+fileId,
					            success: function(data){
					            	$('#streamTab a').click();
					            }
								
							});
						},
						

						popout : function() {
								
							$('#discussions-link').css('display', 'block');
							$('#discussions-link').css('padding', '0');
							$('#discussions-link').css('text-decoration',
								'none');
							$('#flipQuestion').css('display', 'none');
							$('#questions-icon').css('display', 'none');
							$("#messageListView").hide();
							$("#questionListView").css("display", "block");
							$("#questionListView").css("visibility", "visible");

							/*$('#discussions-link').css('display', 'block');
							$('#discussions-link').css('padding', '0');
							$('#discussions-link').css('text-decoration',
									'none');
							$('#flipQuestion').css('display', 'none');
							$('#questions-icon').css('display', 'none');*/

							$("#questionStreamView").animate({
								//"margin-right" : '+=254',
								"padding-right":"500px",
								"opacity":'0',
								"z-index":"-100"
									
							}, 1000);
							$("#sidequestionexpand").animate({
								"margin-right" : '+=254',
									"opacity":'0',
									"z-index":"-100"
										
							}, 1000);
					
											
							
							$('#topheader').css('padding-right', '0');
							$('.header-profile').css('margin',
									'-5px 267px -17px 0px');

							view = this.getViewById('questionListView');
							view.myStreams = this.getViewById('sidebar').myStreams;
							//view.myStreams = this.getViewById('sidebar').myStreams;
							view.data.url = "/getAllQuestionsForAStream/"
									+ this.getViewById('sidebar').streamId
									+ "/date/" + view.messagesPerPage + "/"
									+ view.pageNo;

							view.fetch();
							
							$("#questionsLink").click();

						},

						/* Miimize left question stream */
						minimize : function() {

							$("#questionStreamView").animate({
								"margin-right" : '-=254'
							}, 1000);
							$("#sidequestionexpand").animate({
								"margin-right" : '-=254'
							}, 1000);

							$("#messageListView").show();
							$("#questionListView").css("display", "none");

							$("#questionListView").css("visibility", "hidden");
							/* $("#questionStreamView").hide(); */
							/* $("#questionStreamView").css("visibility","hidden"); */
							/*
							 * $( "#questionStreamView" ).animate({ width: "0%",
							 * opacity: 0, visibility:"hidden", display:"none" },
							 * 1500 );
							 */

							// $( "#questionStreamView" ).toggle("slide", {
							// direction: "right" }, 2000);
							// $(".body").css("padding-right","0");
							$(".chatbox").css("right", "40");
							// $("#topheader").css("padding-right","0");

							$("#sidequestionexpand").css("opacity", "1");

							$('#topheader').css('padding-right', '0');
							$('.header-profile').css('margin',
									'-5px 267px -17px 0px');
						},

						afterUpload : function(event) {
							$("#uploadgoogledoc").modal('hide');
						},

						fliptoQuestion : function() {
							//$('#discussions-link').css('display', 'block');
							//$('#discussions-link').css('padding', '0');
							//$('#discussions-link').css('text-decoration',
								//	'none');
							//$('#flipQuestion').css('display', 'none');
							//$('#questions-icon').css('display', 'none');
						},

						fliptoDiscussion : function() {
							//if (position <= "254px") {
							
							
							var position = $("#sidequestionexpand").css(
							"right");
							
							if (position <= "253px") {
								
								$("#questionStreamView").animate({
									"padding-right" : '5px',
									"z-index":"100"
								}, 1000).animate({
									"opacity" : '1px',
									
								}, 1000);
								
							$("#sidequestionexpand").animate({
								"z-index":"100"
							}, 1000).animate({
								"opacity" : '1px',
								
							}, 1000);
							}
						var positionAfter = $("#sidequestionexpand").css("margin-right");
					
						if (positionAfter <= "254px")
							{
							$("#questionStreamView").animate({
								"opacity" : '1px',
								
							}, 1000).animate({
								"padding-right" : '5px',
								"z-index":"100"
							}, 1000);
							$("#sidequestionexpand").css("margin-right","0px")
								$("#sidequestionexpand").animate({
								
									"z-index":"100"
								}, 1000).animate({
									"opacity" : '1',
									
								}, 1000);
							}

						//}
							$('button#upload-files2').css('visibility','visible');
							$('#discussions-link').css('display', 'none');
							$('#flipQuestion').css('padding',
									'0px 0px 0px 12px');
							$('#questions-icon').css('margin-top', '-2px');
							$('#flipQuestion').css('display', 'block');
							$('#questions-icon').css('display', 'block');
							$("#messageListView").show();
							$("#questionListView").css("display", "none");
							//var position = $("#sidequestionexpand").css(
								//	"margin-right");
							
							// $( "#questionStreamView"
							// ).animate({"margin-right": '+=300'}, 1000);
							// $("#sidequestionexpand").animate({"margin-right":
							// '+=300'}, 1000);
						},

						/* Expand Side Question Stream */

						restoretonormal : function() {
							/*
							$("#messageListView").show();
							$("#questionListView").css("display", "none");*/
							
							$('#discussions-link').css('display', 'none');
							$('#flipQuestion').css('padding',
									'0px 0px 0px 12px');
							$('#questions-icon').css('margin-top', '-2px');
							$('#flipQuestion').css('display', 'block');
							$('#questions-icon').css('display', 'block');
							$("#messageListView").show();
							$("#questionListView").css("display", "none");

							/* $("#questionListView").css("visibility","hidden"); */

							/* $("#questionStreamView").hide(); */
							/* $("#questionStreamView").css("visibility","hidden"); */
							/*
							 * $( "#questionStreamView" ).animate({ width:
							 * "300", opacity: 1, visibility:"visible",
							 * display:"block" }, 1500 );
							 */
							/*
							 * $("#questionStreamView").show();
							 * $(".body").css("padding-right", "280");
							 * $(".chatbox").css("right", "40");
							 * $("#topheader").css("padding-right", "19");
							 * $("#sidequestionexpand").css("opacity","1");
							 * $("#sidequestionexpand").css("right", "318");
							 */
							// $( "#questionStreamView").show();
							var position = $("#sidequestionexpand").css(
									"margin-right");
							if (position <= "-254px") {
								$("#questionStreamView").animate({
									"margin-right" : '+=254'
								}, 1000);
								$("#sidequestionexpand").animate({
									"margin-right" : '+=254'
								}, 1000);
								// $("#sidequestionexpand").animate({"margin-right":
								// '+=254'});
								// $("#sidequestionexpand").css("margin-right","0px");
								$('#topheader').css('padding-right', '19px');
								$('.header-profile').css('margin',
										'-5px 248px -17px 0px');
							}
						},

						fliptoDiscussionfromquestion : function(eventName) {
							if (eventName.which == 13) {

							}

						},

						showsidebar : function(e) {
							
							
							$("#showAndPublishForm ").find("#docName")
									.attr("value",$(e.currentTarget).data("id"));
							$("#showAndPublishForm ").find("#docUrl")
									.attr("value",$(e.currentTarget).data("name"));
							$(".showgoogledocsSidebar").show();
							$("#showgoogledoc.modal").css("margin", "3% 0 0 4%");
						},

						hidePublishSidebar : function() {
							$(".showgoogledocsSidebar").hide();
							$("#showgoogledoc.modal").css("margin",
									"3% 0 0 14%");
						},

						/* ------------------------------- */
						/* Upload Google Doc */
						/* ------------------------------- */
						uploadGoogleDocs : function(upload) {

							$.ajax({

								type : 'GET',
								url : 'googleDoc/upload',

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

						/* ------------------------------- */
						/* Create Google document */
						/* ------------------------------- */

						createGDocument : function(create) {

							
						/*		
							    $('.modal-backdrop').attr('disabled',true);*/
					
							
							$('#creategoogledoc').modal({
								  backdrop: 'static',
								  keyboard: false
								});
							$(".contentcreatedoc").empty();
							$(".publish-btn")
									.css("border", "2px solid #3d71a5");
							$(".publish-txt").css("color", "#fff");
							$('#creategoogledoc #floatingCirclesG').show();
							$
									.ajax({
										type : 'GET',
										url : 'googleDoc/document',
										success : function(data) {
											$(
													'#creategoogledoc #floatingCirclesG')
													.hide();
											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data
													.toString()
													.startsWith(
															"https://accounts.google.com/o/oauth2/")) {
												window.location.assign(data)
											} else {
												/*
												 * $("#creategoogledoc").modal(
												 * 'show');
												 */
												$(".contentcreatedoc").empty();

												$(".contentcreatedoc")
														.append(
																"<iframe id='googleStuff' style='width:100%;height:100%;border-radius:0 0 10px 10px;' frameborder='0' src="
																		+ data[0]
																		+ "/>");
												$("#docUrl").attr("value",
														data[0]);
												$("#docName").attr("value",
														data[1]);
												$("div.file-name")
														.text(data[1]);
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

															});

										}

									});
									
							
							
							
						
						
						},// Create Google document Ends

						// Create Google spreadsheet

						createGSpreadsheet : function(create) {
						
							$('#creategoogledoc').modal({
								  backdrop: 'static',
								  keyboard: false
								})
							$(".contentcreatedoc").empty();
							$(".publish-btn")
									.css("border", "2px solid #3d71a5");
							$(".publish-txt").css("color", "#fff");
							$('#creategoogledoc #floatingCirclesG').show();
							$
									.ajax({

										type : 'GET',
										url : 'googleDoc/spreadsheet',

										success : function(data) {
											$(
													'#creategoogledoc #floatingCirclesG')
													.hide();
											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data
													.toString()
													.startsWith(
															"https://accounts.google.com/o/oauth2/")) {
												window.location.assign(data)
											} else {
												/*
												 * $("#creategoogledoc").modal(
												 * 'show');
												 */
												$(".contentcreatedoc").empty();
												$(".contentcreatedoc")
														.append(
																"<iframe id='googleStuff' style='width:100%;height:100%;border-radius:0 0 10px 10px;' frameborder='0' src="
																		+ data[0]
																		+ "/>");
												$("#docUrl").attr("value",
														data[0])
												$("#docName").attr("value",
														data[1]);
												$("div.file-name")
														.text(data[1]);
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

															});

										}

									});

						}, // Create Google spreadsheet Ends

						// Create Google Presentation

						createGPresentation : function(create) {
							
							$('#creategoogledoc').modal({
								  backdrop: 'static',
								  keyboard: false
								})
							$(".contentcreatedoc").empty();
							$(".publish-btn")
									.css("border", "2px solid #3d71a5");
							$(".publish-txt").css("color", "#fff");
							$('#creategoogledoc #floatingCirclesG').show();
							$
									.ajax({

										type : 'GET',
										url : 'googleDoc/presentation',

										success : function(data) {
											$(
													'#creategoogledoc #floatingCirclesG')
													.hide();
											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data
													.toString()
													.startsWith(
															"https://accounts.google.com/o/oauth2/")) {
												window.location.assign(data)
											} else {
												/*
												 * $("#creategoogledoc").modal(
												 * 'show');
												 */
												$(".contentcreatedoc").empty();
												$(".contentcreatedoc")
														.append(
																"<iframe id='googleStuff' style='width:100%;height:100%;border-radius:0 0 10px 10px;' frameborder='0' src="
																		+ data[0]
																		+ "/>");
												$("#docUrl").attr("value",
														data[0])
												$("#docName").attr("value",
														data[1]);
												$("div.file-name")
														.text(data[1]);
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

															});

										}

									});

						},// Create Google Presentation Ends

						// Show Google Doc

						showGoogleDocs : function(show) {

							$("#showgoogledoc").modal('show');

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
															});

										}

									});

							$
									.ajax({

										type : 'GET',
										url : 'googleDoc/show',

										success : function(data) {
											
											
											
											$(
													'#showgoogledoc #floatingCirclesG')
													.hide();
											String.prototype.startsWith = function(
													s) {
												if (this.indexOf(s) == 0)
													return true;
												return false;
											}
											if (data.toString().startsWith(
													"http")) {
												window.location.assign(data)
											} else {

												$("#docsview > .drive-view-row")
														.remove();

												/*
												 * $("#showgoogledoc").modal(
												 * 'show');
												 */

												$
														.each(
																data,
																function(index,
																		value) {
																	
																	var nameOfDocument = "Name Not Available";
																	;
																	if (value._1 != null) {
																		nameOfDocument = value._1;
																		var extention = value._1
																				.split('.')[1];
																	}
																	if (extention == "ppt"
																			|| extention == "pptx"
																			|| extention == "odp") {
																		$(
																				"#docsview")
																				.append(
																						" <div class='drive-view-row'><div class='powerpoint-img'><img src='"
																								+ value._5
																								+ "'></div><div class='doc-txt-container'><div class='doc-name'>"
																								+ nameOfDocument
																								+ "</div><div class='doc-info'><div class='owner'>OWNER: <span>"
																								+ value._4
																								+ "</span></div>"
																								+ "<div class='last-modified'>LAST MODIFIED:"
																								+ " <span>"
																								+ value._3
																								+ "</span></div></div></div>"
																								+ "<a class='preview-btn' target='_blank' href="
																								+ value._2
																								+ ">Preview</a><div class='preview-btn publishGdocs'  data-id='"
																								+ nameOfDocument
																								+ "' data-name="
																								+ value._2
																								+ ""
																								+ ">Publish</div></div>");
																		
																		/*$("#docUrl").attr("value",
																				data[0]);
																		$("#docName").attr("value",
																				nameOfDocument);
																		$("div.file-name")
																				.text(data[1]);*/

																	}

																	else if (extention == "xls"
																			|| extention == "ods") {
																		$(
																				"#docsview")
																				.append(
																						" <div class='drive-view-row'><div class='spreadsheet-img'><img src='"
																								+ value._5
																								+ "'></div><div class='doc-txt-container'><div class='doc-name'>"
																								+ nameOfDocument
																								+ "</div><div class='doc-info'>"
																								+ "<div class='owner'>OWNER: <span>"
																								+ value._4
																								+ "</span></div>"
																								+ "<div class='last-modified'>LAST MODIFIED:"
																								+ " <span>"
																								+ value._3
																								+ "</span></div></div></div>"
																								+ "<a class='preview-btn' target='_blank' href="
																								+ value._2
																								+ ">Preview</a><div class='preview-btn publishGdocs'  data-id='"
																								+ nameOfDocument
																								+ "' data-name="
																								+ value._2
																								+ ""
																								+ ">Publish</div></div>");

																	}

																	else {
																		$(
																				"#docsview")
																				.append(
																						" <div class='drive-view-row'><div class='text-img'><img src='"
																								+ value._5
																								+ "'></div><div class='doc-txt-container'><div class='doc-name'>"
																								+ nameOfDocument
																								+ "</div><div class='doc-info'>"
																								+ "<div class='owner'>OWNER: <span>"
																								+ value._4
																								+ "</span></div>"
																								+ "<div class='last-modified'>LAST MODIFIED:"
																								+ " <span>"
																								+ value._3
																								+ "</span></div></div></div>"
																								+ "<a class='preview-btn' target='_blank' href="
																								+ value._2
																								+ ">Preview</a><div class='preview-btn publishGdocs' data-id='"
																								+ nameOfDocument
																								+ "' data-name="
																								+ value._2
																								+ ""
																								+ ">Publish</div></div>");

																		
																	}

																});

											}
										}

									});

						}, // Show google Doc Ends

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
							$('button#upload-files2').css('visibility','hidden');
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

						},

						askToPublishDocs : function() {

							var docURL = $('input#docUrl').val();
							var docAttrs = docURL.split("/");
							$(".publish-btn")
									.css("border", "2px solid #3d71a5");
							$(".publish-txt").css("color", "#fff");
							$(".publish-btn")
									.css("background-color", "#5199e1");
							bootbox
									.dialog(
											"Are you sure you want to delete?",
											[
													{

														"label" : "Delete",
														"class" : "btn googledocclose",

														"callback" : function() {
															window.history.pushState({}, "stream", "/stream");
															if (docAttrs[6]
																	.indexOf("key=") != -1) {
																var key = docAttrs[6]
																		.split("key=");
																var spreadsheetid = key[1]
																		.split("&usp=drivesdk")
																$
																		.ajax({
																			type : 'GET',
																			url : 'googleDoc/'
																					+ spreadsheetid[0],
																			success : function() {
																				$(
																						"#creategoogledoc")
																						.modal(
																								'hide');
																				        
																			}
																		});
															} else {
																$
																		.ajax({

																			type : 'GET',
																			url : 'googleDoc/'
																					+ docAttrs[7],
																			success : function() {
																				$(
																						"#creategoogledoc")
																						.modal(
																								'hide');
																			}
																		});
															}
														}
													},
													{
														"label" : "Continue",
														"class" : "btn googledocclose",
														"callback" : function() {

															$(".publish-btn")
																	.css(
																			"border",
																			"2px solid #bf462e");
															$(".publish-btn")
																	.css(
																			"background-color",
																			"#e36a49");
															// $(".publish-txt").css("color","#bf462e");
															// $(".publish-txt").css("text-shadow","1px
															// 1px 2px #000");
														}
													} ]);

						},

					})
			return MyStreamView;
		});