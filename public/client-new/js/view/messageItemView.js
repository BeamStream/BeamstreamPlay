/*******************************************************************************
 * BeamStream
 * 
 * Author : Aswathy P.R (aswathy@toobler.com) Company : Toobler Email: :
 * info@toobler.com Web site : http://www.toobler.com Created : 08/April/2013
 * Description : View for Message item on discussion page
 * ==============================================================================================
 * Change History:
 * ----------------------------------------------------------------------------------------------
 * Sl.No. Date Author Description
 * ----------------------------------------------------------------------------------------------
 * 
 * 
 */

define(
		[ 'view/formView', 'view/documentView', 'view/mediaEditView',
				'model/comment', 'model/discussion', 'model/usermedia',
				'model/user', 'text!templates/discussionMessage.tpl',
				'text!templates/discussionComment.tpl',
				'text!templates/messageRocker.tpl',
				'text!templates/allmessages.tpl',
				'../../lib/extralib/jquery.embedly.min',
				'../../lib/extralib/jquery.prettyPhoto'

		],
		function(FormView, DocumentView, MediaEditView, CommentModel,
				DiscussionModel, UserMediaModel, UserModel, DiscussionMessage,
				DiscussionComment, MessageRocker, Allmessages, JqueryEmbedly,
				PrettyPhoto) {

			var MessageItemView;
			MessageItemView = FormView
					.extend({
						objName : 'MessageItemView',
						events : {
							'click .editMediaTitle' : 'editMediaTitle',
							'click .message-comment-button' : 'addMessageComments',
							'click .rocks-message' : 'rockMessage',
							'click .rock-message' : 'rockMessage',
							'click .add-comment' : 'showCommentTextArea',
							'click .show-all-comments' : 'showAllCommentList',
							'click .who-rocked-it' : 'showRockersList',
							'click .show-all' : 'showAllList',
							'click .follow-message' : 'followMessage',
							'click .rock-comments' : 'rockComment',
							'click .rocks-small a' : 'rockComment',
							'click .mediapopup' : 'showFilesInAPopup',
							'click .downloadbutton' : 'download',
							'click .delete_post' : 'deleteMessage',
							'click .follow-user' : 'followUser',
							'click .delete_comment' : 'deleteComment',
						},

						onAfterInit : function() {
							this.data.reset();
									this.urlRegex2 = /^((http|https|ftp):\/\/)/,
									this.urlRegex1 = /(https?:\/\/[^\s]+)/g,
									this.urlRegex = /(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-\./]*$/i;

						},

						setStreamOwner : function(streamId) {

							if (streamId != "remove-button") {
								var streamCreator;
								$
										.ajax({
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
						 * render the message item
						 */
						render : function() {

							var self = this;
							var trueurl = '';
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;

							// get the model attributes
							var model = this.model.attributes;
							var contentType = '';
							var msgBody = model.message.messageBody;
							var previewImageUrl = model.message.anyPreviewImageUrl
							var docId = model.message.docIdIfAny
							// alert(JSON.stringify(model.message));
							var messageAccess = model.message.messageAccess.name
							var streamId = model.message.streamId.id
							// alert(model.message.streamId.id);
							// var streamCreatorId = {
							/*
							 * function() { var streamdata; if (true) {
							 */

							if (messageAccess == "PrivateToClass") {
								model.message.messageAccess.name = "Private to Class"
							}

							/* get url from the message text */
							var msgUrl = msgBody.replace(self.urlRegex1,
									function(msgUrlw) {
										trueurl = msgUrlw;
										return msgUrlw;
									});

							// to get the extension of the uploaded file
							if (trueurl)
								var extension = (trueurl).match(pattern);

							/* case : normal message without uploaded files */
							if (model.message.messageType.name == "Text") {

								// to check whether the url is a google doc url
								// or not
								if (msgBody
										.match(/^(https:\/\/docs.google.com\/)/)) {
									contentType = "googleDoc";
								} else {
									contentType = "messageOnly";
									var linkTag = msgBody
											.replace(
													self.urlRegex1,
													function(url) {
														return '<a target="_blank" href="'
																+ url
																+ '">'
																+ url + '</a>';
													});
								}
							} else {

								if (msgBody
										.match(/^(https:\/\/docs.google.com\/)/)) {
									contentType = "docs";

								}
								// set first letter of extension in capital
								// letter
								if (extension) {
									extension = extension[1].toLowerCase()
											.replace(
													/\b[a-z]/g,
													function(letter) {
														return letter
																.toUpperCase();
													});
								}
							}

							// customize the date format
							var datVal = formatDateVal(model.message.timeCreated);

							var datas = {
								"data" : model,
								"datVal" : datVal,
								"contentType" : contentType,
								"loggedUserId" : localStorage["loggedUserId"],
								"streamCreatorId" : this
										.setStreamOwner(streamId),
							}

							/* generate data depends on its type */
							if (contentType == "docs") {
								var datas = {
									"data" : model,
									"datVal" : datVal,
									"previewImage" : function() {
										var src = "/beamstream-new/images/google_docs_image.png"
										if (previewImageUrl == "") {
											$
													.ajax({
														type : 'GET',
														url : 'googleDoc/addPreviewImageUrl',
														success : function() {
														}
													});
										} else {
											src = previewImageUrl;
										}
										return src;
									},
									"commenImage" : "true",
									"type" : "googleDoc",
									"contentType" : contentType,
									"loggedUserId" : localStorage["loggedUserId"],
									"streamCreatorId" : this
											.setStreamOwner(streamId)
								}

							} else if (contentType == "messageOnly") {
								var datas = {
									"data" : model,
									"datVal" : datVal,
									"type" : contentType,
									"contentType" : contentType,
									"loggedUserId" : localStorage["loggedUserId"],
									"streamCreatorId" : this
											.setStreamOwner(streamId),
								}

							} else {
								/* for images/videos */
								if (model.message.messageType.name == "Image"
										|| model.message.messageType.name == "Video") {
									var datas = {
										"data" : model,
										"datVal" : datVal,
										"contentType" : "media",
										"loggedUserId" : localStorage["loggedUserId"],
										"streamCreatorId" : this
												.setStreamOwner(streamId)
									}

								} else /*
										 * for other types of docs , pdf , ppt
										 * etc..
										 */
								{
									var previewImage = '';
									var commenImage = "";
									var type = "";

									if (extension == 'Ppt') {
										previewImage = "/beamstream-new/images/presentations_image.png";
										type = "ppt";

									} else if (extension == 'Doc') {
										previewImage = "/beamstream-new/images/docs_image.png";
										type = "doc";

									} else if (extension == 'Pdf') {
										previewImage = model.message.anyPreviewImageUrl;
										type = "pdf";
									} else {
										previewImage = "/beamstream-new/images/textimage.png";
										commenImage = "true";
										type = "doc";

									}

									var datas = {
										"data" : model,
										"datVal" : datVal,
										"previewImage" : previewImage,
										"extension" : extension,
										"commenImage" : commenImage,
										"type" : type,
										"contentType" : "docs",
										"loggedUserId" : localStorage["loggedUserId"],
										"streamCreatorId" : this
												.setStreamOwner(streamId),

									}
									
									

								}

							}
							
							
							// render the template
							compiledTemplate = Handlebars
									.compile(DiscussionMessage);
							$(this.el).html(compiledTemplate(datas));

							/* set the link style for the lisks in message */
							if (linkTag)
								$('p#' + model.message.id.id + '-id').html(
										linkTag);

							// embedly
							$('p#' + model.message.id.id + '-id').embedly({
								maxWidth : 200,
								wmode : 'transparent',
								method : 'after',
								key : '4d205b6a796b11e1871a4040d3dc5c07'
							});

							$('.drag-rectangle').tooltip();

							/*
							 * pretty photo functionality for video /image
							 * popups
							 */
							$("area[rel^='prettyPhoto']").prettyPhoto();
							$(".gallery:first a[rel^='prettyPhoto']")
									.prettyPhoto({
										animation_speed : 'normal',
										theme : 'light_square',
										slideshow : 3000,
										autoplay_slideshow : true
									});
							$(".gallery:gt(0) a[rel^='prettyPhoto']")
									.prettyPhoto({
										animation_speed : 'fast',
										slideshow : 10000,
										hideflash : true
									});
							$('.commentList').hide();

							return this;
						},

						/**
						 * Show the popup for editing title and description of
						 * uploaded files
						 */
						editMediaTitle : function(eventName) {

							/* show the doc details in the popupa */
							var mediaId = eventName.currentTarget.id;

							$('#docId').val(mediaId);
							$('#docType').val(
									this.model.get('message').messageType.name);
							$('#edit-file-name').html(
									'Edit ' + $('#name-' + mediaId).text());
							$('#docName').val($('#name-' + mediaId).text());
							$('#docDescription').val(
									$('#description-' + mediaId).text());

							$('#editMedia').modal("show");

						},

						/**
						 * post new comments on clicking POST button
						 */
						addMessageComments : function(eventName) {
							
							var element = eventName.target.parentElement;
							var parent = $(element).parents(
									'div.follow-container').attr('id');
							var totalComments = $(
									'#' + parent + '-totalComment').text();
							var commentText = $('#' + parent + '-msgComment')
									.val();
							var self = this;

							/* post comments on enter key press */

								eventName.preventDefault();

								if (!commentText.match(/^[\s]*$/)) {
									// this.data.url = "/newComment";

									/*
									 * set the Comment model values and posted
									 * to server
									 */
									var streamId = $('.sortable li.active').attr('id');
									var comment = new CommentModel();
									comment.urlRoot = "/newComment";
									comment
											.save(
													{
														comment : commentText,
														messageId : parent,
														stream_id : streamId
													},
													{
														success : function(
																model, response) {

															$(
																	'#'
																			+ parent
																			+ '-msgComment')
																	.val('');

															// shows the posted
															// comment
															self
																	.showPostedComment(
																			response,
																			parent,
																			totalComments);

															/* pubnum auto push */
															PUBNUB
																	.publish({
																		channel : "comment",
																		message : {
																			pagePushUid : self.pagePushUid,
																			data : response,
																			parent : parent,
																			cmtCount : totalComments,
																			profileImage : localStorage["loggedUserProfileUrl"]
																		}
																	})

														},
														error : function(model,
																response) {

														}

													});

								}

							
						},

						/**
						 * show posted comment
						 */
						showPostedComment : function(response, parent,
								totalComments) {

							$('#' + parent + '-addComments').slideUp(200);

							/* display the posted comment */
							var compiledTemplate = Handlebars
									.compile(DiscussionComment);
							$('#' + parent + '-allComments')
									.prepend(
											compiledTemplate({
												data : response,
												profileImage : localStorage["loggedUserProfileUrl"]
											}));

							if (!$('#' + parent + '-allComments')
									.is(':visible')) {
								$('#' + parent + '-msgRockers').slideUp(1);
								$('#' + parent + '-newCommentList')
										.slideDown(1);
								$('#' + parent + '-newCommentList')
										.prepend(
												compiledTemplate({
													data : response,
													profileImage : localStorage["loggedUserProfileUrl"]
												}));

							}
							totalComments++;
							// /* show user profile image */
							// $('div#'+parent+'-newCommentList').find('#'+response[0].id.id+'-image').attr('src',localStorage["loggedUserProfileUrl"]);
							// $('div#'+parent+'-allComments').find('#'+response[0].id.id+'-image').attr('src',localStorage["loggedUserProfileUrl"]);

							$('#' + parent + '-show-hide').text("Hide All");
							$('#' + parent + '-totalComment').text(
									totalComments);
						},

						/**
						 * Rocking messages
						 */
						rockMessage : function(eventName) {
							eventName.preventDefault();
							var self = this;
							var element = eventName.target.parentElement;
							var messageId = $(element).parents('div.follow-container').attr('id');
							var streamId = $('.sortable li.active').attr('id');

							// set values to model for rocking the message
							var Discussion = new DiscussionModel();
							Discussion.urlRoot = "/rockedIt";
							Discussion.save(
											{
												id : messageId
											},
											{
												success : function(model,response) {

													/*
													 * show/hide the rock and
													 * unrock symbols
													 */
													if ($('#'+ messageId+ '-msgRockCount').hasClass('downrocks-message')) 
														{
															$('#'+ messageId+ '-msgRockCount').removeClass('downrocks-message');
															$('#'+ messageId+ '-msgRockCount').addClass('uprocks-message');
															$('a#'+ messageId+ '-Nice').html("+ Nice!");
															
													} else {
														$('#'+ messageId+ '-msgRockCount').removeClass('uprocks-message');
														$('#'+ messageId+ '-msgRockCount').addClass('downrocks-message');
														$('a#'+ messageId+ '-Nice').html("- Nice!");
													}

													// display the count in icon
													$('#'+ messageId+ '-msgRockCount').find('span').html(response);

													/*
													 * ajax auto push for
													 * message rock
													 */
													PUBNUB.publish({
																channel : "msgRock",
																message : {
																	pagePushUid : self.pagePushUid,
																	streamId : streamId,
																	data : response,
																	msgId : messageId
																}
															})

													if ($('#rockedIt-'+ messageId).hasClass('active')) {
														self.getRockers(eventName,messageId);
													}
												},
												error : function(model,
														response) {
												}
											});
						},

						/**
						 * delete message
						 */
						deleteMessage : function(e) {
							e.preventDefault();
							var messageId = e.target.id;
							var ownerId = $('div#' + messageId).attr('name');
							var self = this;

							if (localStorage["loggedUserId"] != ownerId) {
								bootbox
										.dialog(
												"Are you sure you want to delete this message?",
												[
														{

															"label" : "DELETE",
															"class" : "btn-primary",
															"callback" : function() {

																var discussion = new DiscussionModel();
																discussion.urlRoot = '/remove/message';

																discussion
																		.save(
																				{
																					id : messageId
																				},
																				{
																					success : function(
																							model,
																							response) {

																						if (response.status == "Success") {

																							$(
																									'div#'
																											+ messageId)
																									.remove();

																							/*
																							 * pubnum
																							 * auto
																							 * push --
																							 * delete
																							 * message
																							 */
																							PUBNUB
																									.publish({
																										channel : "deleteMessage",
																										message : {
																											pagePushUid : self.pagePushUid,
																											messageId : messageId
																										}
																									})

																						} else {
																							bootbox
																									.alert("You're Not Authorised To Delete This Message");
																						}

																					},
																					error : function(
																							model,
																							response) {
																					}

																				});

															}

														},
														{
															"label" : "CANCEL",
															"class" : "btn-primary",
															"callback" : function() {
																console
																		.log("ok");
															}
														} ]);
							} else {
								var discussion = new DiscussionModel();
								discussion.urlRoot = '/remove/message';

								discussion
										.save(
												{
													id : messageId
												},
												{
													success : function(model,
															response) {

														if (response.status == "Success") {

															$(
																	'div#'
																			+ messageId)
																	.remove();

															/*
															 * pubnum auto push --
															 * delete message
															 */
															PUBNUB
																	.publish({
																		channel : "deleteMessage",
																		message : {
																			pagePushUid : self.pagePushUid,
																			messageId : messageId
																		}
																	})
														} else {
															alert("You're Not Authorised To Delete This Message");
														}
													}
												});
							}
						},

						/**
						 * Delete comment
						 */
						deleteComment : function(e) {

							e.preventDefault();
							var self = this;
							var commentId = e.target.id;
							var ownerId = $(e.target).attr('data-username');
							var messageId = $(e.target)
									.parents('div.ask-outer').attr('id');
							$
							.ajax({
								type : 'GET',
								url : '/can/remove/comment/' + commentId + '/' + messageId,
								success : function(data) {								
									if (data == "true") {
								     bootbox
										.dialog(
												"Are you sure you want to delete this comment?",
												[
														{

															"label" : "DELETE",
															"class" : "btn-primary",
															"callback" : function() {

																var comment = new CommentModel();
																comment.urlRoot = '/remove/comment/'
																		+ messageId;

																/*
																 * delete the
																 * omment from
																 * the model
																 */
																comment
																		.save(
																				{
																					id : commentId
																				},
																				{
																					success : function(
																							model,
																							response) {

																						if (response.status == "Success") {

																							var commentCount = $(
																									'#'
																											+ messageId
																											+ '-totalComment')
																									.text()
																							// $('#'+messageId+'-totalComment').text(commentCount-1);
																							$(
																									'div#discussion-'
																											+ commentId)
																									.remove();

																							/*
																							 * pubnum
																							 * auto
																							 * push --
																							 * delete
																							 * message
																							 */
																							PUBNUB
																									.publish({
																										channel : "deleteComment",
																										message : {
																											pagePushUid : self.pagePushUid,
																											messageId : messageId,
																											commentId : commentId
																										}
																									})

																						} else {
																							bootbox
																									.alert("You're Not Authorised To Delete This Comment");
																						}

																					},
																					error : function(
																							model,
																							response) {
																					}

																				});

															}

														},
														{
															"label" : "CANCEL",
															"class" : "btn-primary",
															"callback" : function() {
																console
																		.log("ok");
															}
														} ]);
							} else {
								bootbox
										.alert("You're Not Authorised To Delete This Comment");
							  }
						     }
							});
						},

						// added by cuckoo

						followUser : function(e) {
							e.preventDefault();
							var userId = e.currentTarget.id;
							var datavalue = $('#' + e.currentTarget.id).attr(
									'data-value');

							// set values to model, to follow a user
							var user = new UserModel();
							user.urlRoot = "/followUser/";
							user
									.save(
											{
												id : userId
											},
											{
												success : function(model,
														response) {
													// set display
													if (datavalue == "follow") {
														$('a.follow-user')
																.each(
																		function() {

																			if ($(
																					this)
																					.attr(
																							'id') == userId) {
																				$(
																						this)
																						.text(
																								"Unfollow");
																				$(
																						this)
																						.attr(
																								'data-value',
																								'unfollow');
																			}

																		});

													} else {

														$('a.follow-user')
																.each(
																		function() {

																			if ($(
																					this)
																					.attr(
																							'id') == userId) {
																				$(
																						this)
																						.text(
																								"follow");
																				$(
																						this)
																						.attr(
																								'data-value',
																								'follow');
																			}

																		});

													}
												},
												error : function(model,
														response) {
												}
											});
						},

						/**
						 * @TODO : show the uploaded file in a popup
						 */
						showFilesInAPopup : function(e) {

							var self = this;

							var docId = e.currentTarget.id, docUrl = '';
							var fileType = $(e.currentTarget).attr('name');
							var download_url = $('input#id-' + docId).val();
							/* show document is a popup */
							if (fileType == "googleDoc") {
								docUrl = $('input#id-' + docId).val();
								$
								.ajax({
									type : 'GET',
									url : 'googleDoc/access ' + docId,
									success : function(data) {
										if (data == true) {
											$('#dwnload-url').attr('value',
													download_url);
											$('#iframe-' + docId).attr(
													'src', docUrl);
											$('#document-' + docId).modal(
													"show");
										} else {
											// alert(data);
											// alert("You do have Permission
											// to Access this Google Doc");
											if (data == false)
												self
														.requestAccessOfGoogleDoc(docId);
											else{
												window.location = data;
											}
										}
									}
								});

							} else {
								docUrl = "http://docs.google.com/gview?url="
										+ $('input#id-' + docId).val()
										+ "&embedded=true";
								$('#dwnload-url').attr('value',
										download_url);
								$('#iframe-' + docId).attr(
										'src', docUrl);
								$('#document-' + docId).modal(
										"show");


								// userMediaModel = new UserMediaModel();
								// userMediaModel.set({id:this.model.get('message').docIdIfAny.id
								// ,
								// docName : this.model.get('docName'),
								// docDescription
								// :this.model.get('docDescription'),
								// docUrl: docUrl});

								// console.log(userMediaModel.get('docUrl'));
								// //render the document
								// var documentView = new DocumentView({el:
								// '#poupview' , model
								// : userMediaModel});
								// // documentView.render();
								// $('#iframe-'+docId).attr('src',docUrl);
								// $('#document-'+docId).modal("show");
							}
							// var fileId = docUrl.split('/')[7];
/*
 * $ .ajax({ type : 'GET', url : 'googleDoc/access ' + docId, success :
 * function(data) { if (data == true) { $('#dwnload-url').attr('value',
 * download_url); $('#iframe-' + docId).attr( 'src', docUrl); $('#document-' +
 * docId).modal( "show"); } else { // alert(data); // alert("You do have
 * Permission // to Access this Google Doc"); if (data == false) self
 * .requestAccessOfGoogleDoc(docId); else{ alert("Login into Gmail First");
 * window.location = data; } } } });
 */
							/*
							 * $('#dwnload-url').attr('value', download_url);
							 * $('#iframe-' + docId).attr('src', docUrl);
							 * $('#document-' + docId).modal("show");
							 */

							// window.open(docUrl, '_blank');
						},

						requestAccessOfGoogleDoc : function(docId) {
							bootbox.dialog("Do you want to Request Access?", [
									{

										"label" : "Yes",
										"callback" : function() {
											$.ajax({
												type : 'GET',
												url : 'requestAccess/' + docId,
												success : function() {
												}
											});
										}
									}, {
										"label" : "No",
										"callback" : function() {
										}
									} ]);

						},

						download : function(eventName) {

							eventName.preventDefault();
							window.location = $('#dwnload-url').attr('value');
						},

						/**
						 * Show comment text area on click
						 */
						showCommentTextArea : function(eventName) {
							eventName.preventDefault();
							var element = eventName.target.parentElement;
							var messageId = $(element).parents(
									'div.follow-container').attr('id');

							// show / hide commet text area
							if ($('#' + messageId + '-addComments').is(
									":visible")) {
								$('#' + messageId + '-msgComment').val('');
								$('#' + messageId + '-addComments')
										.slideToggle(300);
								$('#' + messageId + '-addComments > textarea')
										.focus();
							} else {
								$('#' + messageId + '-msgComment').val('');
								$('#' + messageId + '-addComments')
										.slideToggle(200);
								$('#' + messageId + '-addComments > textarea')
										.focus();
							}

						},

						/**
						 * Show / hide all comments of a message
						 */
						showAllCommentList : function(eventName) {
							eventName.preventDefault();
							var element = eventName.target.parentElement;
							var parentUl = $(eventName.target).parent('ul');

							var messageId = $(element).parents(
									'div.follow-container').attr('id');

							$(parentUl).find('a.active').removeClass('active');

							/* Get all the comments of a message */

							$
									.ajax({

										type : 'POST',
										url : "/getAllComments",
										data : JSON.stringify({
											"messageId" : messageId
										}),
										contentType : 'application/json; charset=utf-8',

										success : function(data) {

											if ($(
													'#' + messageId
															+ '-allComments')
													.is(":visible")) {
												$(eventName.target)
														.removeClass('active');
												$(
														'#' + messageId
																+ '-msgRockers')
														.slideUp(1);
												$(
														'#'
																+ messageId
																+ '-newCommentList')
														.html('');
												$(
														'#'
																+ messageId
																+ '-allComments')
														.empty();
												$(
														'#'
																+ messageId
																+ '-allComments')
														.slideUp(600);
												$(
														'#' + messageId
																+ '-show-hide')
														.text("Show All");
											} else {
												$(eventName.target).addClass(
														'active');
												$(
														'#' + messageId
																+ '-msgRockers')
														.slideUp(1);
												$(
														'#'
																+ messageId
																+ '-newCommentList')
														.html('');
												$(
														'#'
																+ messageId
																+ '-allComments')
														.empty();
												$
														.each(
																data,
																function(index,
																		value) {
																	compiledTemplate = Handlebars
																			.compile(Allmessages);
																	$(
																			'#'
																					+ messageId
																					+ '-allComments')
																			.prepend(
																					compiledTemplate({
																						value : value,
																						profileImage : localStorage["loggedUserProfileUrl"]
																					}));
																	$(
																			'#'
																					+ messageId
																					+ '-allComments')
																			.slideDown(
																					600);
																	$(
																			'#'
																					+ messageId
																					+ '-show-hide')
																			.text(
																					"Hide All");

																})

											}

										}

									})

						},

						/**
						 * show Message rockers list
						 */
						showRockersList : function(eventName) {

							eventName.preventDefault();

							var element = eventName.target.parentElement;
							var parentUl = $(eventName.target).parent('ul');

							var messageId = $(element).parents(
									'div.follow-container').attr('id');
							$(parentUl).find('a.active').removeClass('active');

							this.getRockers(eventName, messageId);

						},

						getRockers : function(eventName, messageId) {

							if ($('#' + messageId + '-msgRockers').is(
									":visible")) {

								$(eventName.target).removeClass('active');
								$('#' + messageId + '-msgRockers').slideUp(600);

							} else {
								var Discussion = new DiscussionModel();
								Discussion.urlRoot = "/rockersOf/message/"
										+ messageId;
								Discussion
										.fetch({
											success : function(data, models) {
												$(
														'#' + messageId
																+ '-msgRockers')
														.html('');

												_
														.each(
																data.attributes,
																function(value) {
																	if (jQuery
																			.type(value) === "string") {
																		compiledTemplate = Handlebars
																				.compile(MessageRocker);
																		$(
																				'#'
																						+ messageId
																						+ '-msgRockers')
																				.append(
																						compiledTemplate({
																							rocker : value
																						}));
																	}

																});

												$(eventName.target).addClass(
														'active');
												$(
														'#'
																+ messageId
																+ '-allComments')
														.slideUp(1);
												$(
														'#'
																+ messageId
																+ '-newCommentList')
														.html('');
												$(
														'#' + messageId
																+ '-msgRockers')
														.slideDown(600);
												$(
														'#' + messageId
																+ '-show-hide')
														.text("Show All");

											}
										});

							}

						},

						/**
						 * show / hide all comments ..
						 */
						showAllList : function(eventName) {
							eventName.preventDefault();

							var element = eventName.target.parentElement;
							var parentUl = $(eventName.target).parents('ul');
							$(parentUl).find('a.active').removeClass('active');
							var messageId = $(element).parents(
									'div.follow-container').attr('id');
							if ($('#' + messageId + '-show-hide').text() == "Hide All") {
								$('#' + messageId + '-msgRockers').slideUp(1);
								$('#' + messageId + '-newCommentList').html('');
								$('#' + messageId + '-allComments')
										.slideUp(600);
								$(eventName.target).removeClass('active');
								$(eventName.target).text("Show All");
							} else {
								$('#' + messageId + '-msgRockers').slideUp(1);
								$('#' + messageId + '-newCommentList').html('');
								$('#' + messageId + '-allComments').slideDown(
										600);
								$(eventName.target).addClass('active');
								$(eventName.target).text("Hide All");
							}

						},

						/**
						 * Follow a message
						 */
						followMessage : function(eventName) {
							eventName.preventDefault();

							var element = eventName.target.parentElement;
							var messageId = $(element).parents(
									'div.follow-container').attr('id');
							var datavalue = $('#' + eventName.target.id).attr(
									'data-value');

							// this.data.url = "/followMessage";

							// set values to model
							var Discussion = new DiscussionModel();
							Discussion.urlRoot = "/follow/message";
							Discussion.save({
								id : messageId
							}, {
								success : function(model, response) {
									// set display
									if (datavalue == "follow") {
										$('#' + eventName.target.id).text(
												"Unfollow");
										$('#' + eventName.target.id).attr(
												'data-value', 'unfollow');

									} else {
										$('#' + eventName.target.id).text(
												"Follow");
										$('#' + eventName.target.id).attr(
												'data-value', 'follow');
									}

								},
								error : function(model, response) {
								}

							});

						},
						
						
						
						/**
						 * Rock comments
						 */
						rockComment : function(eventName) {
							eventName.preventDefault();
							var commentId = $(eventName.target).parents(
									'div.answer-description').attr('id');
							var messageId = $(eventName.target).parents(
									'div.follow-container').attr('id');
							var streamId = $('.sortable li.active').attr('id');
							var self = this;

							var comment = new CommentModel();
							comment.urlRoot = "/rockingTheComment";
							// set values to model
							comment.save({
								id : commentId
							}, {
								success : function(model, response) {

									// display the count in icon
									$('div#' + messageId + '-newCommentList')
											.find(
													'a#' + commentId
															+ '-mrockCount')
											.html(response);
									$('div#' + messageId + '-allComments')
											.find(
													'a#' + commentId
															+ '-mrockCount')
											.html(response);

									/* pubnub auto push for rock message */
									PUBNUB.publish({
										channel : "commentRock",
										message : {
											pagePushUid : self.pagePushUid,
											streamId : streamId,
											data : response,
											messageId : messageId,
											commentId : commentId
										}
									})

								},
								error : function(model, response) {
								}

							});
						},

					})
			return MessageItemView;
		});