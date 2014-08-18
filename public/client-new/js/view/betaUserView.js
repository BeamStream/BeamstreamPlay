/*******************************************************************************
 * BeamStream
 * 
 * Author : Aswathy P.R (aswathy@toobler.com) Company : Toobler Email: :
 * info@toobler.com Web site : http://www.toobler.com Created : 31/January/2013
 * Description : Backbone sign up page
 * ==============================================================================================
 * Change History:
 * ----------------------------------------------------------------------------------------------
 * Sl.No. Date Author Description
 * ----------------------------------------------------------------------------------------------
 * 
 * 
 */

define(
		[ 'view/formView', '../../lib/bootstrap-modal' ],
		function(FormView, Bootstrap) {
			var betaUserView;
			betaUserView = FormView
					.extend({
						objName : 'betaUserView',

						events : {
							'click #betaRegister' : 'betaUserRegistration',
							'click #shareOnRegistration li' : 'shareOnRegistration',
							'click #shareIcons li' : 'shareOnSocialMedia',
							'click #share_btn' : 'showSharePopup'

						},

						onAfterInit : function() {
							this.data.reset();
							localStorage["logged"] = '';
						},

						/**
						 * @TODO beta user registration
						 */
						betaUserRegistration : function(e) {
							e.preventDefault();

							var email = $('input#mailId').val();
							if (email == '') {
								alert('Enter Email ID')
							} else {
								// save only when user enter mail id
								this.data.url = "/betaUser";
								var status = this.saveForm();
							}

						},

						/**
						 * @TODO call on form save success
						 */
						success : function(model, data) {
							var self = this;
							$('#mailId').val('');
							if (data.message == "Allow To Register") {
								localStorage["shareWidget"] = 'modalJoin';
								$("#modalJoin").modal('show');
							} else {
								localStorage["shareWidget"] = 'errorMessage';
								// $("#errorMessage").modal('show');
								alert("You've been already added to the Beamstream's beta users list")

							}
							this.data.reset({
								mailId : ''
							});
						},

						/**
						 * @TODO call on form save error
						 */
						error : function(e) {

							localStorage["shareWidget"] = 'errorMessage';
							$("#errorMessage").modal('show');

							// hide error popup after 6 seconds
							setTimeout(function() {
								$("#errorMessage").modal('hide');
							}, 6000);
							$('#mailId').val('');
						},

						/**
						 * show share popup on share button click
						 */
						showSharePopup : function(e) {
							e.preventDefault();
							localStorage["shareWidget"] = 'modalShare';
							$('#modalShare').modal('show');
						},

						/**
						 * share beamstream on SocialMedia on beta user
						 * registration
						 */
						shareOnRegistration : function(e) {
							e.preventDefault();
							alert('Ankit Shukla')
							/* For social media sharing */
							this.socialMedia = [];
							var seletedMedia = $(e.target).parent('li').attr(
									'id');
							this.socialMedia.push(seletedMedia);
							$('#modalJoin').modal('hide');

							/* set share message for each providers */
							var shareMessage = '';
							if (seletedMedia == 'twitter') {

								shareMessage = "Got on the beta list 4 @beamstream A #highered #social #learning network. Get on the priority beta list 2 #edtech";

							} else if (seletedMedia == 'email') {

								shareMessage = "I just locked in my beta invite for BeamStream, a Social Learning Network for Colleges & Universities. It's built for college students & professors & looks amazing. I can't wait to try it! You can get on the priority beta list two! Just click ";
							} else {

								shareMessage = "I just locked in my beta invite for BeamStream, a Social Learning Network for Colleges & Universities. It's built for college students & professors & looks amazing. I can't wait to try it! You can get on the priority beta list two! Just click http://bstre.am/k7lXGw";
							}

							/*
							 * showJanrainShareWidget(shareMessage, 'View my
							 * Beamstream post', 'http://bstre.am/k7lXGw', '',
							 * this.socialMedia);
							 */
						},

						/**
						 * share beamstream on SocialMedia on Share button click
						 */
						shareOnSocialMedia : function(e) {
							e.preventDefault();
							var self = this;
							/* For social media sharing */
							this.socialMediad = [];
							var seletedMedia = $(e.target).parent('li').attr(
									'id');
							this.socialMediad.push(seletedMedia);
							/* set share message for each providers */
							var shareMessage = '';
							$('#modalShare').modal('hide');

							if (seletedMedia == 'facebook') {
								bootbox
										.dialog(
												"Get on the exclusive beta list for BeamStream, a Social Learning Network for Colleges & Universities. It's built for college students & professors. It's lookin' pretty sweet so far!  http://bstre.am/k7lXGw",
												[ {
													"label" : "Share",
													"class" : "btn-primary",
													"callback" : function() {
														self.facebookShare();
													}
												}, {
													"label" : "Cancel",
													"class" : "btn-primary",
													"callback" : function() {

													}
												} ]);

							}

							else if (seletedMedia == 'twitter') {
								bootbox.dialog(
												"Get on the 1st user's beta list for @beamstream: @A #social #learning network built for #highered. #edtech",
												[ {
													"label" : "Share",
													"class" : "btn-primary",
													"callback" : function() {
														self.twitterShare();
													}
												}, {
													"label" : "Cancel",
													"class" : "btn-primary",
													"callback" : function() {

													}
												} ]);
							}
							else if (seletedMedia == 'gPlus') {
								bootbox.dialog(
										"Get on the 1st user's beta list for @beamstream: @A #social #learning network built for #highered. #edtech",
										[ {
											"label" : "Share",
											"class" : "btn-primary",
											"callback" : function() {
												self.gplusShare();
											}
										}, {
											"label" : "Cancel",
											"class" : "btn-primary",
											"callback" : function() {

											}
										} ]);
							}
							
							else if (seletedMedia == 'linkedin') {
								bootbox.dialog(
										"Get on the 1st user's beta list for @beamstream: @A #social #learning network built for #highered. #edtech",
										[ {
											"label" : "Share",
											"class" : "btn-primary",
											"callback" : function() {
												self.linkedinShare();
											}
										}, {
											"label" : "Cancel",
											"class" : "btn-primary",
											"callback" : function() {

											}
										} ]);
							} else {

								shareMessage = "Get on the exclusive beta list for BeamStream, a Social Learning Network for Colleges & Universities. It's built for college students & professors. It's lookin' pretty sweet so far! http://bstre.am/k7lXGw";
							}

							/*
							 * showJanrainShareWidget(shareMessage, 'View my
							 * Beamstream post', 'http://bstre.am/k7lXGw', '',
							 * this.socialMediad);
							 */
						},

						facebookShare : function() {
							$
									.ajax({
										type : 'GET',
										url : '/facebook/login',
										success : function(data) {
											window
													.open(data, "popupWindow",
															"width=600,height=300, top=200, left=400,scrollbars=yes");
										}
									});
						},

						twitterShare : function() {
							
							window.open('/twitter/twitterLogin', "popupWindow",
									"width=600,height=300, top=100, left=400,scrollbars=yes");
							/*$
									.ajax({
										type : 'GET',
										url : '/twitter/twitterLogin',
										success : function(data) {
											window
													.open(data, "popupWindow",
															"width=600,height=300, top=200, left=400,scrollbars=yes");
										}
									});*/
						},
						gplusShare : function() {
						/*	$
									.ajax({
										type : 'GET',
										url : '/twitter/login',
										success : function(data) {
											window
													.open(data, "popupWindow",
															"width=600,height=300, top=200, left=400,scrollbars=yes");
										}
									});*/
						},
						linkedinShare : function() {
							window.open('/linkedin/login', "popupWindow",
							"width=600,height=300, top=100, left=400,scrollbars=yes");

/*							$
									.ajax({
										type : 'GET',
										url : '/twitter/login',
										success : function(data) {
											window
													.open(data, "popupWindow",
															"width=600,height=300, top=200, left=400,scrollbars=yes");
										}
									});*/
						},

					})
			return betaUserView;
		});