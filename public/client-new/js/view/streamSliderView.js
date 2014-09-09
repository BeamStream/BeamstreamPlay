define(
		[ 'baseView', 'text!templates/newStreamList.tpl',
				'text!templates/streamSlider.tpl',
				'text!templates/streamTitle.tpl',
				'text!templates/privateToList.tpl',
				'../../lib/jquery.simplyscroll' ],
		function(BaseView, NewStreamTpl, StreamList, StreamTitle,
				PrivateToList, simplyscroll) {

			var streamSliderView;
			streamSliderView = BaseView
					.extend({

						objName : 'streamSliderView',
						streamId : null,
						events : {
							'click .close-btn' : 'removeStreamTab',
							'click .cancel-btn' : 'closeRemoveOption',
							'click .sortable li' : 'renderRightContenetsOfSelectedStream',
							'click .remove-stream' : 'removeStreamAction'
						},

						onAfterInit : function() {
							this.data.reset();
							this.activeDiv = '<div class="active-curve"></div>';

						},

						/**
						 * after render set scrolling effect
						 */
						onAfterRender : function() {

							this.slider();

							/*
							 * added active class and style for first stream in
							 * the left side bar
							 */
							$('#sortable4 li:first').addClass('active');
							$('#sortable4 li:first').append(this.activeDiv);

							PUBNUB
									.subscribe({

										channel : "classMembers",
										restore : false,
										callback : function(data) {
											/*
											 * alert(JSON.stringify(data))
											 * alert(data.data.stream.usersOfStream.length)
											 * alert(data.data.stream.streamName)
											 */

											var compiledTemplate = Handlebars
													.compile(StreamTitle);
											$('.stream-header-left')
													.html(
															compiledTemplate({
																streamName : data.data.stream.streamName,
																userCount : data.data.stream.usersOfStream.length
															}));

											$(
													'span#'
															+ data.data.stream.id.id
															+ '-users')
													.html(
															data.data.stream.usersOfStream.length);
										}
									})

							PUBNUB
									.subscribe({

										channel : "deleteStream",
										restore : false,
										callback : function(data) {
											var noOfUers = $(
													"#" + data.streamId
															+ "-users").text();
											if (noOfUers > 0) {
												$(
														"#" + data.streamId
																+ "-users")
														.text(noOfUers - 1);
												$(
														"ul.strem-header-info li.mebers")
														.text(
																noOfUers
																		- 1
																		+ " Members");
											}
										}
									});

							/* added all streams to privateTo dropdown list */
							var streamName = $('.sortable li.active').attr(
									'name');
							var userCount = $('.sortable li.active').attr(
									'data-userCount');
							$('#select-privateTo').text(streamName);
							$('#Q-privateTo-select').text(streamName);

							/*
							 * render the stream title and description view
							 * based on selected stream
							 */
							$('.stream-header-left').attr('data-value',
									$('.sortable li.active').attr('id'));
							var compiledTemplate = Handlebars
									.compile(StreamTitle);
							$('.stream-header-left').html(compiledTemplate({
								streamName : streamName,
								userCount : userCount
							}));

							// set the streamId value
							this
									.setStreamId((this.data.models[0]) ? this.data.models[0]
											.get('stream').id.id
											: null);

							this.myStreams = (this.data) ? this.data : null;

							/** rendered by default : discussion page */
							// var sidebarView = this.getViewById('sidebar');
							if (this.streamId) {

								var view = this.getViewById('messageListView');
								if (view) {

									view.data.url = "/allMessagesForAStream/"
											+ this.streamId + "/date/"
											+ view.messagesPerPage + "/"
											+ view.pageNo + "/week";
									view.fetch();
								}

							}

						},

						/**
						 * if there is no streams for a user then show another
						 * view
						 */
						displayNoResult : function(callback) {
							$('#class-red-border').addClass('class-border');
							var compiledTemplate = Handlebars
									.compile(NewStreamTpl);
							this.$(".content").html(compiledTemplate);
						},

						/**
						 * if there is a streams then add to the stream list
						 */
						displayPage : function(callback) {
							$('#class-red-border').removeClass('class-border');
							/*
							 * for the private to list section on Discussion and
							 * Question page
							 */
							var listTemplate = Handlebars
									.compile(PrivateToList);
							$('#private-to-list').html(
									listTemplate(this.data.toJSON()));
							$('#Q-privatelist').html(
									listTemplate(this.data.toJSON()));

							// /* render the left stream list */
							var compiledTemplate = Handlebars
									.compile(StreamList);
							this.$(".content").html(
									compiledTemplate(this.data.toJSON()));
						},

						/**
						 * remove a stream access
						 */
						removeStreamAction : function(e) {

							var streamId = $(e.target).parents('li').attr('id');
							var StreamName = $(e.target).parents('li').attr(
									'name');
							$('#detele-streamId').val(streamId);
							$('#deleteStream').modal("show");
						},
						/**
						 * slider/scrolling effect for stream list
						 */
						slider : function() {
							var self = this;
							var activeDiv = '<div class="active-curve"><img src="" width="20" height="58"></div>';
							$('span.close-btn').hide();
							$('div.drag-icon').hide();
							$(".scroller").simplyScroll({
								customClass : 'vert',
								orientation : 'vertical',
								auto : false,
								manualMode : 'end',
								frameRate : 20,
								speed : 8,
							});
							var activeStream = '';

							/*
							 * stream side bar EDIT/DONE functionality (stream
							 * sorting)
							 */
							$(".done")
									.toggle(
											function() {

												$('a.done').text('DONE');
												$('a.done').css('background','#f80046');
												$('a.done').css('color','#ffffff');
												$('a.done').css('font-size','9px');
												$('a.done').css('text-align','center');
												$('a.done').css('line-height','28.5px');
												$('a.done').css('font-weight','600');
												$('a.done').attr('data-value',
														'inActive');
												activeStream = $(
														'.sortable li.active')
														.attr('id');
												$('.sortable li.active').find(
														'div.active-curve')
														.remove();
												$('.sortable li.active')
														.removeClass('active');
												$('.menu-count').hide();
												$('span.close-btn').show();
												$('div.drag-icon').show();
												$('#sortable1, #sortable2')
														.sortable();
												$('#sortable3').sortable({
													items : ':not(.disabled)'
												});
												$('#sortable-with-handles')
														.sortable({
															handle : '.handle'
														});
												$('#sortable4, #sortable5')
														.sortable(
																{
																	connectWith : '.connected'
																});
											},
											function() {

												//$('a.done').text('EDIT');
												$('a.done').html('<span id="edit-stream-nav"></span>')
												$('a.done').attr('data-value',
														'active');
												$('a.done').css('background','#737b83');

												$(
														'.sortable li#'
																+ activeStream)
														.addClass('active');
												$('.sortable li.active')
														.append(activeDiv);

												$('span.close-btn').hide();
												$('div.drag-icon').hide();

												$('.menu-count').show();
												$('#sortable1').remove();
												$('#sortable4, #sortable5')
														.sortable('destroy');
												$('li').removeAttr('draggable');

												/*
												 * remove if any red actvated
												 * stream li
												 */
												$("#sortable4 li")
														.each(
																function(n) {
																	var streamId = $(
																			this)
																			.attr(
																					'id');
																	var StreamName = $(
																			this)
																			.attr(
																					'name');
																	var userCount = $(
																			this)
																			.attr(
																					'data-userCount');
																	if ($(this)
																			.hasClass(
																					'red-active')) {

																		var removeOption = '<a  id ="'
																				+ streamId
																				+ '" name ="'
																				+ StreamName
																				+ '"  href="#" class="icon1">'
																				+ StreamName
																				+ '</a>'
																				+ '<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange" style="display: none;">'
																				+ '<img src="images/menu-left-icon.png">'
																				+ '</div>'
																				+ '<span class="menu-count" > '
																				+ userCount
																				+ '</span>'
																				+ '<span class="close-btn drag-rectangle" data-original-title="Delete" style="display: none;">'
																				+ '<img src="images/close.png">'
																				+ '</span>';

																		if (streamId == activeStream) {
																			removeOption += '<div class="active-curve">'
																					+ '<img width="20" height="58" src="images/active-curve.png">'
																					+ '</div>';
																		}

																		$(this)
																				.removeClass(
																						"icon1 red-active");
																		$(this)
																				.html(
																						removeOption);
																		$(
																				'.drag-rectangle')
																				.tooltip()

																	}
																});
												/*
												 * if the deleted stream was
												 * active stream then set first
												 * stream as an active stream
												 */
												if ($('li[id=' + activeStream
														+ ']').length == 0) {

													self.fetch();
													self.streamId = $(
															'#sortable4 li:first')
															.attr('id')
													self
															.renderTabContents(self.streamId);

												}

											});
							$('.drag-rectangle').tooltip()
						},

						/**
						 * open a remove option to remove that stream
						 */
						removeStreamTab : function(eventName) {

							eventName.preventDefault();
							var self = this;

							/* get selected stream's id and name */
							var streamId = $(eventName.target).parents('li')
									.attr('id');
							var StreamName = $(eventName.target).parents('li')
									.attr('name');

							// set new style for streamtab
							var removeOption = '<a href="#" class="red-active-icon1">'
									+ StreamName
									+ ' </a>'
									+ '<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"></div>'
									+ '<span class="remove-btn remove-stream"><a href="#" id="remove-button">Remove</a></span> <span class="remove-btn cancel-btn "><a href="#">Cancel</a></span>';

							$(eventName.target).parents('li').addClass(
									"icon1 red-active");
							$(eventName.target).parents('li')
									.html(removeOption);
							$('.tooltip').remove();

						},

						/**
						 * close the remove option
						 */
						closeRemoveOption : function(eventName) {

							eventName.preventDefault();
							var self = this;

							/* get selected stream's id , user count and name */
							var streamId = $(eventName.target).parents('li')
									.attr('id');
							var StreamName = $(eventName.target).parents('li')
									.attr('name');
							var userCount = $(eventName.target).parents('li')
									.attr('data-userCount');

							// set previous style for li
							var removeOption = '<a  id ="'
									+ streamId
									+ '" name ="'
									+ StreamName
									+ '"  href="#" class="icon1">'
									+ StreamName
									+ '</a>'
									+ '<div class="drag-icon drag-rectangle" data-original-title="Drag To Rearrange"></div>'
									+ '<span class="menu-count" style="display:none;"> '
									+ userCount
									+ '</span>'
									+ '<span class="close-btn drag-rectangle" data-original-title="Delete"></span>';

							$(eventName.target).parents('li').removeClass(
									"icon1 red-active");
							$(eventName.target).parents('li')
									.html(removeOption);
							$('.drag-rectangle').tooltip()

						},

						// turn active stream assignment into a function so we
						// can trigger an event
						setStreamId : function(streamId) {
							this.streamId = streamId;

							// Trigger the change streamId event
							this.trigger('change:streamId', {
								streamId : streamId
							});
						},

						/**
						 * render right block contents of a selected stream
						 */
						renderRightContenetsOfSelectedStream : function(
								eventName) {

							eventName.preventDefault();

							this.setStreamId(eventName.target.id);

							this.renderTabContents(this.streamId);

						},

						/**
						 * render tab contents of selected stream
						 */
						renderTabContents : function(streamId) {

							// disable the content rendering when the stream
							// list is on edit stage
							if ($('a.done').attr('data-value') == "inActive")
								return;

							// if there is no stream in stream list
							if (!streamId)
								return;

							/*
							 * set the privateTo drop down select option as
							 * selected stream
							 */
							var streamName = $('#' + streamId + '')
									.attr('name');
							$('#select-privateTo').text(streamName);
							$('#Q-privateTo-select').text(streamName);

							// set active stage for stream li
							$('.sortable li.active').find('div.active-curve')
									.remove();
							$('.sortable li.active').removeClass('active');
							$('.sortable li#' + streamId).addClass('active');
							$('.sortable li.active').append(this.activeDiv);
							var userCount = $('.sortable li.active .menu-count')
									.text();

							/*
							 * render the stream title and description view
							 * based on selected stream
							 */
							var compiledTemplate = Handlebars
									.compile(StreamTitle);
							$('.stream-header-left').html(compiledTemplate({
								streamName : streamName,
								userCount : userCount
							}));

							// render active tab contents
							var activeTab = $('.stream-tab li.active').attr(
									'id');

							if (activeTab == 'discussion') {
								/*
								 * fetch all messages of a stream for
								 * messageListView
								 */
								view = this.getViewById('messageListView');
								if (view) {

									view.data.url = "/allMessagesForAStream/"
											+ this.streamId + "/date/" + 10
											+ "/" + 1 + "/week";
									view.fetch();

								}
							}
							if (activeTab == "question") {
								/* fetch all questions of a stream */
								view = this.getViewById('questionsView');
								if (view) {

									view.data.url = "/getAllQuestionsForAStream/"
											+ this.streamId
											+ "/date/"
											+ 10
											+ "/" + 1;
									view.fetch();

								}
							}

						}

					})

			return streamSliderView;

		});
