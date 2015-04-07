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
							var compiledTemplate = Handlebars.compile(OnlineUsers);
							this.$(".content").html(compiledTemplate(this.data.toJSON()));
						},

						/**
						 * if other online users
						 */
						displayPage : function() {

							$.ajax({
									url : '/onlineUsers',
									success : function(data) {
										var self = this;
										$('#user-online ul').html("");
										var onlineUsersLength = data.onlineUsers.length;
										$('.online-count').html(
											"Online ("
													+ onlineUsersLength 
													+ ")"
										);
										_.each(data.onlineUsers,function(model) {
											var profileImageUrl = '';
											if (model.profileImageUrl) {

												profileImageUrl = model.profileImageUrl;

											} else {

												profileImageUrl = '/beamstream-new/images/profile-upload.png';
											}

											if (model.id.id == localStorage["loggedUserId"] ) {
												var template = '<li id="me" class="online active"><a href="#" class="active"><img src="'
														+ profileImageUrl
														+ '" width="30" height="28"> '
														+ '<span>Me</span> <span class="online-chat">Online</span></a></li>';

												$('#user-online ul').prepend(template);
											} else {

												var template = '<li id="'
														+ model.id.id
														+ '" onclick=popit("'
														+ localStorage["loggedUserId"]
														+ '","'
														+ model.id.id
														+ '","'
														+ model.firstName
														+ '")> '
														+ '<img width="30" height="28" src="'
														+ profileImageUrl
														+ '">'
														+ '<span>'
														+ model.firstName
														+ '</span> <span class="online-chat">Online</span>';

												$('#user-online ul').append(template);

											}
											
											$('#user-online').mCustomScrollbar("update");

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


						/**
						 * method to provide scrolling functionality in
						 * onlineusers box
						 */
						scroll : function(eventName) {
							$("#user-online").mCustomScrollbar({
								set_width : false, 
								set_height : false, 
								horizontalScroll : false,
								scrollInertia : 550, 
								scrollEasing : "easeOutCirc", 
								mouseWheel : "auto",
								autoDraggerLength : true, 
								scrollButtons : { 
									enable : false, 
									scrollType : "continuous", 
									scrollSpeed : 20,
									scrollAmount : 40
								},
								advanced : {
									updateOnBrowserResize : true,
									updateOnContentResize : false,
									autoExpandHorizontalScroll : false
								},
								callbacks : {
									onScroll : function() {
									},
									onTotalScroll : function() {
									},
									onTotalScrollOffset : 0
								
								}
							});
						},

					})
			return onlineUserView;
		});