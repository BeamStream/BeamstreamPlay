/*******************************************************************************
 * BeamStream
 * 
 * Author : Cuckoo Anna(cuckoo@toobler.com) Company : Toobler Email: :
 * info@toobler.com Web site : http://www.toobler.com Created : 07/March/2013
 * Description : Backbone login template
 * ==============================================================================================
 * Change History:
 * ----------------------------------------------------------------------------------------------
 * Sl.No. Date Author Description
 * ----------------------------------------------------------------------------------------------
 * 
 * 
 */

define(
		[ 'view/formView' ],
		function(FormView) {
			var LoginView;
			LoginView = FormView
					.extend({
						objName : 'LoginView',

						events : {
							'click .menu-pic' : 'getUserTypeValue',
							'click #login' : 'login',
							'keyup #password' : 'loginOnEnterKeyPress',
							'click .register-cancel' : 'clearAllFields',
							//'blur .home_reg' : 'validationsymbol'
							
							'blur #mailid' : 'validateMailID',
							'blur #password' : 'validatePassword'
						},

						onAfterInit : function() {
							this.data.reset();
							localStorage["logged"] = '';
							$('.sign-tick').hide();
							$('.sign-close').hide();
							$('#mailid').prop('disabled', false);
							$('#password').prop('disabled', false);
							$('#mailid1').prop('disabled', false);
							$('#password1').prop('disabled', false);
							$('div.container-fluid').last().addClass('signup-container');
						},

						/**
						 * tick and cross mark handling
						 */
						validationsymbol : function(e) {
							var target = $(e.currentTarget).parent('fieldset').find('div.field-error');
							if (target.length == 0 && $(e.currentTarget).val()) {
								$(e.currentTarget).parent('fieldset').find('div.sign-close').hide();
								$(e.currentTarget).parent('fieldset').find('div.sign-tick').show();

							} else if ($(e.currentTarget).val()) {
								$(e.currentTarget).parent('fieldset').find('div.sign-tick').hide();
								$(e.currentTarget).parent('fieldset').find('div.sign-close').show();
							}
						},
						
						validateMailID : function(e){
							var emailID = $("#mailid").val();
							var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
					        var status = pattern.test(emailID);
							if(status && emailID){
								$("#email-sign-tick").show();
								$("#email-sign-close").hide();
							}else{
								$("#email-sign-close").show();
								$("#email-sign-tick").hide();
							}
						},
						
						
						validatePassword : function(e){
							var password = $("#password").val();
							var Len =password.length;
							if(Len > 5){
								$("#password-sign-tick").show();
								$("#password-sign-close").hide();
							}else{
								$("#password-sign-tick").hide();
								$("#password-sign-close").show();
							}
						},

						/**
						 * @TODO user registration
						 */
						login : function(e) {
							e.preventDefault();
							this.data.url = "/login";
							this.data.models[0].set('iam',$("#usertype").val());
							this.saveForm();

						},

						/**
						 * on form save success
						 */
						success : function(model, data) {
							var self = this;
							// On login success redirect to stream page
							if (data.result.status == 'Success') {
								$('.sign-tick').hide();
								$('.sign-close').hide();
								// redirect to Registration page if user has not
								// registered yet
								if (data.result.message != "Login Successful"
										&& data.result.message != "Login Unsuccessful") {
									window.location = data.server
											+ "/registration?userId="
											+ data.user.id.id + "&token="
											+ data.result.message
								} else {
									// set the logged users
									// profile picture and
									// Id
									if (data.profilePicOfUser)
										localStorage["loggedUserProfileUrl"] = data.profilePicOfUser;
									else
										localStorage["loggedUserProfileUrl"] = '/beamstream-new/images/profile-upload.png';

									localStorage["loggedUserId"] = data.user.id.id;

									/* PUBNUB -- AUTO AJAX PUSH */
									/*
									 * PUBNUB.publish({ channel : "onlineUsers",
									 * message : {
									 * pagePushUid:self.pagePushUid,userInfo:data} })
									 */
									/*
									 * redirect to class page if the user has no
									 * stream
									 */

									if (data.hasClasses == true) {
										window.location = "/stream";
									} else
										window.location = "/class";
								}
							} else {
								alert(data.result.message);

							}

							/* clear the fields and model */
							$('#login-form').find(
									"input[type=text], input[type=password]")
									.val("");
							this.data.models[0].set({
								mailId : '',
								password : ''
							});
							$('span.error').remove();
							$('.sign-tick').hide();
							$('.sign-close').hide();

						},

						/**
						 * login on enter key press on password field
						 */
						loginOnEnterKeyPress : function(eventName) {
							var self = this;
							if (eventName.which == 13) {
								self.login(eventName);
							}
						},

						/**
						 * Method to set the value of "iam"
						 */
						getUserTypeValue : function(eventName) {
							eventName.preventDefault();

							$('.menu-pic div.active').removeClass('active');
							$(eventName.currentTarget).find('div').addClass(
									'active');

							$("#usertype").val(eventName.currentTarget.id);
						},

						/**
						 * clear all fields when we click cancel button
						 */
						clearAllFields : function(e) {
							e.preventDefault();
							$('#login-form').find(
									"input[type=text], input[type=password]")
									.val("");
							$('span.error').remove();
							$('.sign-tick').hide();
							$('.sign-close').hide();
						},

						pushConnection : function() {
							var self = this;
							self.pagePushUid = Math.floor(
									Math.random() * 16777215).toString(16);

							// /* for online users */
							PUBNUB.subscribe({
								channel : "onlineUsers",
								restore : false,
								callback : function(message) {
									// if(message.pagePushUid !=
									// self.pagePushUid)
									// {
									// console.log(45);
									// console.log($('#onlinechatbox'));
									// var template = '<li> <a href="#">'
									// +'<img width="30" height="28"
									// src="'+message.userInfo.profileImageUrl+'">'
									// +'<span>'+message.userInfo.user.firstName+'</span>
									// <span
									// class="offline-chat">'
									// +'<img width="12" height="13"
									// src="img/online-icon.png"></span></a>
									// </li>';
									// $('#onlinechatbox').append('<p>call ho
									// gyi</p>');
								}

							})
						}

					})
			return LoginView;
		});
