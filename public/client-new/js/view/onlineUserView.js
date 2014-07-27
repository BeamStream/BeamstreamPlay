/*******************************************************************************
 * BeamStream
 * 
 * Author : Cuckoo Anna (cuckoo@toobler.com) Company : Toobler Email: :
 * info@toobler.com Web site : http://www.toobler.com Created :
 * 20/September/2012 Description : Backbone view for main stream page
 * ==============================================================================================
 * Change History:
 * ----------------------------------------------------------------------------------------------
 * SlNo. Date Author Description
 * ----------------------------------------------------------------------------------------------
 * 1. 27March2013 Aswathy.P.R added showOrHideWidget()
 * 
 * 
 */

define(
		[ 'baseView', 'view/loginView', 'text!templates/onlineUsers.tpl',
				'../../lib/jquery.mCustomScrollbar',
				'../../lib/jquery.mousewheel.min',
				'../../lib/jquery.simplyscroll', '../../lib/bootstrap', ],
		function(BaseView, LoginView, OnlineUsers, mCustomScrollbar,
				mousewheel, simplyscroll, bootstrap) {

			var onlineUserView;
			onlineUserView = BaseView
					.extend({
						objName : 'onlineUserView',

						events : {
							'click #chat-status' : 'showOrHideWidget',
						},

						onAfterInit : function() {
							this.data.reset();
							this.scroll();
							// this.pushConnection();
							// this.pushConnectionOffline();

						},

						/**
						 * show/hide the online users list
						 */
						showOrHideWidget : function() {
							$('#user-online').toggle('slow');
						},

						/**
						 * if there is no other online users
						 */
						displayNoResult : function(callback) {
							var compiledTemplate = Handlebars
									.compile(OnlineUsers);
							this.$(".content").html(
									compiledTemplate(this.data.toJSON()));
						},

						/**
						 * if other online users
						 */
						displayPage : function() {

							$
									.ajax({
										url : '/onlineUsers',
										success : function(data) {

											var self = this;
											$('#user-online ul').html("");
											var onlineUsersLength = data.onlineUsers.length;
											$('.online-count')
											
													.html(
															"Online ("
																	+ onlineUsersLength // this.data.models[0].attributes.onlineUsers.length
																	+ ")");
											_
													.each(
															data.onlineUsers,// this.data.models[0].attributes.onlineUsers,
															function(model) {
																var profileImageUrl = '';
																if (model.profileImageUrl) {

																	profileImageUrl = model.profileImageUrl;

																} else {

																	profileImageUrl = '/beamstream-new/images/profile-upload.png';
																}

																if (model.id.id == localStorage["loggedUserId"] /*&& document.querySelector('#me') == null*/) {
																	var template = '<li id="me" class="online active"><a href="#" class="active"><img src="'
																			+ profileImageUrl
																			+ '" width="30" height="28"> '
																			+ '<span>Me</span> <span class="online-chat">Online</span></a></li>';

																	$(
																			'#user-online ul')
																			.prepend(
																					template);
																} else /*if(model.id.id != localStorage["loggedUserId"] && document.getElementById(model.id.id) == null)*/{

																	var template = '<li id="'
																			+ model.id.id
																			+ '" onclick=popit("'
																			+ localStorage["loggedUserId"]
																			+ '","'
																			+ model.id.id
																			+ '","'
																			+ model.firstName
																			+ '","'
																			+ profileImageUrl
																			+ '")> '
																			+ '<img width="30" height="28" src="'
																			+ profileImageUrl
																			+ '">'
																			+ '<span>'
																			+ model.firstName
																			+ '</span> <span class="offline-chat">';

																	$(
																			'#user-online ul')
																			.append(
																					template);

																}
																
																$(
																		'#user-online')
																		.mCustomScrollbar(
																				"update");

															});

										}
									});
						},

						onAfterRender : function() {
							var self = this;
							setInterval(function() {
								self.displayPage();
							}, 10*1000);
						},

						/* Pubnub subscription for online user */
						// TODO : PubNUb Problem For Online Users , Needs to be
						// checked
						/*
						 * pushConnection: function(){ var self = this;
						 * self.pagePushUid =
						 * Math.floor(Math.random()*16777215).toString(16);
						 * 
						 * for online users PUBNUB.subscribe({ channel :
						 * "onlineUsers",
						 * 
						 * callback : function(message) { if(message.pagePushUid !=
						 * self.pagePushUid) { var template='<li id="'+message.userInfo.user.id.id+'" onclick=popit("'+localStorage["loggedUserId"]+'","'+message.userInfo.user.id.id+'","'+message.userInfo.user.firstName+'","'+ profileImageUrl +'")> '+
						 * message.userInfo.user.firstName +'<span
						 * class="online-chat"><img width="12" height="13"
						 * src="/beamstream-new/images/online-icon.png"></span></li>';
						 * $('#user-online ul').append(template); //
						 * $('#user-online ul').append('<li>Ankit</li>'); } } }) },
						 * 
						 * 
						 * Pubnub subscription for offline user
						 * pushConnectionOffline: function(){ var self = this;
						 * self.pagePushUid =
						 * Math.floor(Math.random()*16777215).toString(16);
						 * 
						 * for online users PUBNUB.subscribe({ channel :
						 * "offlineuser", callback : function(message) { //
						 * $('div#user-online ul li').empty(); } }) },
						 * 
						 */

						/**
						 * method to provide scrolling functionality in
						 * onlineusers box
						 */
						scroll : function(eventName) {

							$("#user-online").mCustomScrollbar({
								set_width : false, /*
													 * optional element width:
													 * boolean, pixels,
													 * percentage
													 */
								set_height : false, /*
													 * optional element height:
													 * boolean, pixels,
													 * percentage
													 */
								horizontalScroll : false, /*
															 * scroll
															 * horizontally:
															 * boolean
															 */
								scrollInertia : 550, /*
														 * scrolling inertia:
														 * integer
														 * (milliseconds)
														 */
								scrollEasing : "easeOutCirc", /*
																 * scrolling
																 * easing:
																 * string
																 */
								mouseWheel : "auto", /*
														 * mousewheel support
														 * and velocity:
														 * boolean, "auto",
														 * integer
														 */
								autoDraggerLength : true, /*
															 * auto-adjust
															 * scrollbar dragger
															 * length: boolean
															 */
								scrollButtons : { /* scroll buttons */
									enable : false, /*
													 * scroll buttons support:
													 * boolean
													 */
									scrollType : "continuous", /*
																 * scroll
																 * buttons
																 * scrolling
																 * type:
																 * "continuous",
																 * "pixels"
																 */
									scrollSpeed : 20, /*
														 * scroll buttons
														 * continuous scrolling
														 * speed: integer
														 */
									scrollAmount : 40
								/*
								 * scroll buttons pixels scroll amount: integer
								 * (pixels)
								 */
								},
								advanced : {
									updateOnBrowserResize : true, /*
																	 * update
																	 * scrollbars
																	 * on
																	 * browser
																	 * resize
																	 * (for
																	 * layouts
																	 * based on
																	 * percentages):
																	 * boolean
																	 */
									updateOnContentResize : false, /*
																	 * auto-update
																	 * scrollbars
																	 * on
																	 * content
																	 * resize
																	 * (for
																	 * dynamic
																	 * content):
																	 * boolean
																	 */
									autoExpandHorizontalScroll : false
								/*
								 * auto expand width for horizontal scrolling:
								 * boolean
								 */
								},
								callbacks : {
									onScroll : function() {
									}, /*
										 * user custom callback function on
										 * scroll event
										 */
									onTotalScroll : function() {
									}, /*
										 * user custom callback function on
										 * bottom reached event
										 */
									onTotalScrollOffset : 0
								/*
								 * bottom reached offset: integer (pixels)
								 */
								}
							});
						},

					})
			return onlineUserView;
		});