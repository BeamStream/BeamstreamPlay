/*******************************************************************************
 * BeamStream
 * 
 * Author : Aswathy P .R (aswathy@toobler.com) Company : Toobler Email: :
 * info@toobler.com Web site : http://www.toobler.com Created : 29/January/2013
 * Description : Backbone view for registration steps
 * ==============================================================================================
 * Change History:
 * ----------------------------------------------------------------------------------------------
 * Sl.No. Date Author Description
 * ----------------------------------------------------------------------------------------------
 * 
 * 
 */
define(
		[ 'view/formView', '../../lib/bootstrap.min',
				'../../lib/bootstrap-select', '../../lib/bootstrap-modal',
				'../../lib/jquery.meio.mask', '../../lib/bootstrap-datepicker',
				'text!templates/registration.tpl', '../../lib/extralib/exif', 
				'../../lib/extralib/binaryajax'],
		function(FormView, Bootstrap, BootstrapSelect, BootstrapModal,
				MaskedInput, Datepicker, RegistrationTpl) {
			var RegistrationView;
			RegistrationView = FormView
					.extend({
						objName : 'RegistrationView',

						events : {

							'click #skip_step1' : 'completeFirstStep',
							'click #done_step1' : 'completeFirstStep',
							'click #done_step2' : 'comepleteSecondStep',
							'click #step2-reset' : 'resetStep2Form',
							'click #step2_back' : 'backtostep1',
							'click .browse' : 'continuestep3',
							'change #uploadProfilePic' : 'changeProfile',
							'click #skip_step3' : 'completeRegistration',
							'click #addPhoto' : 'uploadProfilePic',
							'click #continue' : 'noprofilepic',
							'click #step3_back' : 'backtostep2',
							'click .register-social' : 'connectMedia',
							'keyup #schoolName' : 'populateSchools',
							'focusin #schoolName' : 'populateSchools',
							'change #degreeProgram' : 'addOtherDegree',
							'change #graduate' : 'showGraduateType',
							'click #cancle_registration' : 'cancelRegistration',
							'blur #username':'usernamecheck',

						},

						onAfterInit : function() {

							this.data.reset();
							this.profile = null;
						},

						
						
						usernamecheck : function(e){
							
							var username = $("#username").val();
							$.ajax ({
								 type : 'POST',
								 url : "/isUserNameAvailable",
								 dataType : "json",
							     contentType : "application/json",
								 data : JSON.stringify({ 
									 username : username,
									 }),
									 
								 success : function(data){
									 if(data == false)
									 alert("Username already taken");
								 }
							 });
							},
						/**
						 * @TODO JanRain Sign up
						 */
						displayPage : function(callback) {
							

							// get user informations from Social site ( janRain
							// sign up case )
							var userInfo = jQuery.parseJSON($('#registration')
									.attr('data-value'));
							var compiledTemplate = Handlebars
									.compile(RegistrationTpl);

							// DH Remove commented code when ready //
							this.$(".content")
									.html(compiledTemplate(this.data));
							this.temp_photo = '/beamstream-new/images/step-one-pic.png';
							this.enableStepTwo();
							$("#cellNumber").setMask('(999) 999-9999');
							// Remove up to here. Uncomment below this line //

							/*
							 * if(userInfo == null){ // signup via email
							 * 
							 * this.$(".content").html(
							 * compiledTemplate(this.data));
							 * this.temp_photo='/beamstream-new/images/step-one-pic.png'; }
							 * else{ //signup via janRain if (userInfo.stat ==
							 * "ok") {
							 * 
							 * var firstName = '', lastName ='', location ='',
							 * email='' ;
							 * this.temp_photo='/beamstream-new/images/step-one-pic.png';
							 * firstName = userInfo.profile.name.givenName;
							 * lastName = userInfo.profile.name.familyName;
							 * 
							 * this.data.models[0].set({'firstName':firstName ,
							 * 'lastName': lastName});
							 * 
							 * if (userInfo.profile.providerName == "Twitter"){
							 * 
							 * var formattedName =
							 * userInfo.profile.name.formatted; var parts =
							 * formattedName.split(' '); if(parts.length > 1 ) {
							 * firstName =
							 * formattedName.substr(0,formattedName.indexOf('
							 * ')); lastName =
							 * formattedName.substr(formattedName.indexOf('
							 * ')+1); } if(parts.length == 1) { firstName =
							 * userInfo.profile.name.formatted; lastName =''; }
							 * 
							 * if(userInfo.profile.address === undefined){ }
							 * else{ location =
							 * userInfo.profile.address.formatted; }
							 * this.temp_photo = userInfo.profile.photo; } else
							 * if(userInfo.profile.providerName == "Facebook"){
							 * 
							 * if(userInfo.profile.address === undefined){ }
							 * else{ location =
							 * userInfo.profile.address.formatted; } email =
							 * userInfo.profile.email; this.temp_photo =
							 * userInfo.profile.photo; } else if
							 * (userInfo.profile.providerName == "LinkedIn") {
							 * 
							 * email = userInfo.profile.email; this.temp_photo =
							 * userInfo.profile.photo; } else if
							 * (userInfo.profile.providerName == "Google") {
							 * 
							 * email = userInfo.profile.email; this.temp_photo =
							 * userInfo.profile.photo; } else{ }
							 * 
							 * userInfo = { "status" : "true" , "firstName" :
							 * firstName,"lastName": lastName,"location":
							 * location, "email": email ,"photo":
							 * this.temp_photo};
							 * 
							 * this.data.models[0].set({'firstName':firstName ,
							 * 'lastName': lastName , 'location': location
							 * ,'mailId': email}); this.$(".content").html(
							 * compiledTemplate(userInfo)); } }
							 */

						},

						onAfterRender : function() {

							/* set style for select boxes */
							$('.selectpicker-info').selectpicker({
								style : 'register-select'
							});

							$('#datepicker').datepicker();

							$
									.ajax({
										type : 'GET',
										url : '/findUserData',
										success : function(data) {
											if (data.data.username == undefined) {
												$('#location').val(
														data.data.location);
											} else {
												$('#username').val(
														data.data.username);
												$('#firstName').val(
														data.data.firstName);
												$('#lastName').val(
														data.data.lastName);
												$('#schoolName').val(
														data.data.schoolName);
												$('#major')
														.val(data.data.major);
												$('#aboutYourself')
														.val(
																data.data.aboutYourself);
												var gradeLvl = data.data.gradeLevel;
												$('[name=gradeLevel] option')
														.filter(
																function() {
																	return ($(
																			this)
																			.text() == gradeLvl);
																}).prop(
																'selected',
																true);
												var degreePgrm = data.data.degreeProgram;
												$('[name=degreeProgram] option')
														.filter(
																function() {
																	return ($(
																			this)
																			.text() == degreePgrm);
																}).prop(
																'selected',
																true);
												$('#location').val(
														data.data.location);
												$('#cellNumber').val(
														data.data.cellNumber);
												$('#associatedSchoolId')
														.val(
																data.data.associatedSchoolId);
												$('#myUserId').val(
														data.data.userId);
											}
										}
									});
						},

						/**
						 * activate step 2 registration block
						 */
						enableStepTwo : function() {
							$('#step_1').hide(500);
							$('#step1_block').removeClass('active-border');
							$('#step2_block').removeClass('box-active');
							$('#step2_block').addClass('active-border');
							$('#step_2').show(500);
						},

						/**
						 * activate step 3 registration block
						 */
						enableStepThree : function() {

							$('#step_2').hide(500);
							$('#step2_block').removeClass('active-border');
							if (this.temp_photo === "/beamstream-new/images/step-one-pic1.png") {

								this.temp_photo = '/beamstream-new/images/upload-photo.png';
							}

							var upload_block = '<div id="step3_block" class="round-block upload-photo step-3-photo">'
									+ '<a class="browse" href="#"><img src="'
									+ this.temp_photo
									+ '" width="148" height="37" id="profile-photo"> </a>'
									+ '<div class="progress-container" style="position:relative; top:-35px; left:240px; padding:5px; display:none;">'
									+ '<div class="progress progress-striped active reg-upload">'
									+ '<div class="bar" style="width: 0%;"></div>'
									+ '</div>'
									+ '</div>'
									+ '<div id="profile-error" ></div>'
									+ '</div>';
							$('#upload-step').html(upload_block);
							$('#step_3').show(500);

						},

						/**
						 * complete step1 registration process
						 */
						completeFirstStep : function(e) {
							e.preventDefault();
							/* disable first step and enable step 2 block */
							this.enableStepTwo();
							$("#cellNumber").setMask('(999) 999-9999');
						},

						/**
						 * complete step2 registration process - user details
						 * form
						 */
						comepleteSecondStep : function(e) {

							e.preventDefault();
							this.data.url = "/registration";

							/*
							 * @TODO only select a school from existing list or
							 * add new school
							 */
							if ($('#schoolName').val()) {
								if (!$('#associatedSchoolId').val()) {
									alert('Please select existing School or add a new one');
									return;
								}
							}

							// set validation for other degree field
							if (!$('#otherDegree').is(':hidden')
									&& !$('#otherDegree').val()) {
								this.data.models[0].set({
									'otherDegree' : ''
								});
							}

							// set validation for other graduationDate field
							if (!$('#graduationDate').is(':hidden')
									&& !$('#graduationDate').val()) {
								this.data.models[0].set({
									'graduationDate' : ''
								});
							}

							// set validation for degreeExpected field
							if (!$('#degreeExpected-set').is(':hidden')
									&& !$('#degreeExpected').val()) {
								this.data.models[0].set({
									'degreeExpected' : ''
								});
							}
							// set school details to modal
							this.data.models[0].set({
								'userId' : $('#myUserId').val(),
								'schoolName' : $('#schoolName').val(),
								'associatedSchoolId' : $('#associatedSchoolId')
										.val()
							});
							this.data.models[0].set({
								'username' : $('#username').val(),
								'firstName' : $('#firstName').val(),
								'lastName' : $('#lastName').val(),
								'major' : $('#major').val(),
								'aboutYourself' : $('#aboutYourself').val(),
								// 'gradeLevel' : $('#gradeLevel').val(),
								// 'degreeProgram' : $('#degreeProgram').val(),
								'location' : $('#location').val(),
								'cellNumber' : $('#cellNumber').val(),
							});
							this.saveForm();
						},

						/**
						 * step 2 registration success
						 */
						success : function(model, data) {
							/* enable step 3 */
							if (data != "Username Already Exists"
									&& data != "Please select an existing school or create your own one") {
								// set the logged users Id
								localStorage["loggedUserId"] = data.user.id.id;
								this.data.models[0].set({
									'id' : data.user.id.id
								});
								this.data.models[0].set({
									'userSchoolId' : data.userSchool.id.id
								});
								this.data.models[0].removeAttr('user');
								this.data.models[0].removeAttr('userSchool');

								this.enableStepThree();
							} else {
								alert(data)
							}
						},

						/**
						 * reset step 2 form values - clear all form values
						 */
						resetStep2Form : function(e) {

							e.preventDefault();
							$('button#degreeProgram span:first').text(
									'Degree Program?');
							$('button#gradeLevel span:first').text(
									'Grade Level?');
							$('button#graduate span:first').text('Graduated?');
							$('#step2_block input').attr('value', '');
							$('#step2_block textarea').attr('value', '');
							$('.error').remove();

						},
						/**
						 * * added by Cuckoo
						 */

						backtostep1 : function(e) {
							e.preventDefault();
							$('#step_2').hide(500);
							$('#step2_block').removeClass('active-border');
							$('#step1_block').removeClass('box-active');
							$('#step1_block').addClass('active-border');
							$('#step_1').show(500);

						},
						/**
						 * upload profile picture or profile video
						 */
						uploadProfilePic : function(e) {
							e.preventDefault();
							$("#selectUploadPhoto").modal('hide');
							$('#uploadProfilePic').click();

						},

						/**
						 * Change profile pic or profile video
						 */
						changeProfile : function(e) {
							var self = this;
							var file = e.target.files[0];
							this.temp_photo = '';
							var reader = new FileReader();

							/* Only process image files. */
							if (!file.type.match('image.*')
									&& !file.type.match('video.*')) {

								$('#profile-photo')
										.attr("src",
												"/beamstream-new/images/upload-photo.png");
								$('#profile-error').html(
										'File type not allowed !!');
								self.profile = '';
							} else {
								//alert("All info about this file: " + ImageInfo.getAllFields(file).toSource());
								//alert(file.getAsBinary());
								//var exif = EXIF.readFromBinaryFile(new BinaryFile(reader.readAsBinaryString(file)));
								//alert(exif);
								//reader.onloadend = function() {
								//var binaryData = new BinaryFile(this.result);
								//alert(JSON.stringify(binaryData));
      								//  var exif = EXIF.readFromBinaryFile(file);
        
       								  //alert(exif);
    							//};
								/* capture the file informations */
								reader.onload = (function(f) {
								//var exif = EXIF.readFromBinaryFile(new BinaryFile(this.result));
						        //alert(exif);

									self.profile = file;
									return function(e) {
										$('#profile-error').html('');
										// show the selected photo
										if (file.type.match('image.*')) {
											self.temp_photo = e.target.result;
											$('#profile-photo').attr("src",
													e.target.result);
										}
										// show a default profile image
										if (file.type.match('video.*')) {
											$('#profile-photo')
													.attr("src",
															"/beamstream-new/images/no-video.png");
										}

										self.name = f.name;

									};
								})(file);

								// read the image file as data URL
								reader.readAsDataURL(file);
							}
						},

						continuestep3 : function(e) {

							e.preventDefault();
							var self = this;
							var fileSize = 0;
							/* post the image / video data as mutiform data */
							if(this.profile != null) {
							    fileSize = this.profile.size/1000;
							}
							if(fileSize < 500) {
								fileSize = 500;
							}
							if (this.profile) {
								$('.progress-container').show();

								/* updating progress bar */
								this.progress = setInterval(function() {

									this.bar = $('.bar');
									if (this.bar.width() == 200) {
										clearInterval(this.progress);
									} else {
										this.bar.width(this.bar.width() + 8);
									}
									this.bar.text(this.bar.width() / 2 + "%");

								}, fileSize);

								var data;
								data = new FormData();
								data.append('profileData', this.profile);
								$
										.ajax({
											type : 'POST',
											data : data,
											url : "/media",
											// cache : false,
											contentType : false,
											processData : false,
											success : function(data) {

												// set progress bar as 100 %
												self.bar = $('.bar');
												self.bar.width(200);
												self.bar.text("100%");
												clearInterval(self.progress);

												// @TODO redirect to class page
												// on upload success from
												// UI side
												if (data.id) {
													$('.profile-loading').css(
															"display", "block");
													// set the logged users Id

													if (data.frameURL)
														localStorage["loggedUserProfileUrl"] = data.frameURL;
													else
														localStorage["loggedUserProfileUrl"] = data.mediaUrl;

													if (!data.frameURL
															&& !data.mediaUrl)
														localStorage["loggedUserProfileUrl"] = '/beamstream-new/images/profile-upload.png';
													window.location = "/class";
												} else {
													alert(data.message);
												}

											}
										});
							} else {

								$('#addPhoto').click();
							}

						},
						/**
						 * steps 3 registration - image/video upload
						 */
						completeRegistration : function(e) {
							e.preventDefault();
							$("#selectUploadPhoto").modal('show');
							$.ajax({
								type : 'GET',
								url : "/defaultMedia",
								// cache : false,
								contentType : false,
								processData : false
							});

						},

						noprofilepic : function(e) {
							e.preventDefault();
							$("#selectUploadPhoto").modal('hide');
							/*
							 * $.ajax({ type : 'GET', url : "/defaultMedia",
							 * cache : false, contentType : false, processData :
							 * false });
							 */
							localStorage["loggedUserProfileUrl"] = '/beamstream-new/images/profile-upload.png';
							window.location = "/class";
						},

						/**
						 * 
						 * added by Cuckoo
						 */

						backtostep2 : function(e) {

							e.preventDefault();
							$('#step_3').hide(500);
							var upload_block = '<div id="step3_block" class="round-block upload-photo step-one-photo">'
									+ '<a ><img src="'
									+ this.temp_photo
									+ '" width="148" height="37" id="profile-photo">'
									+ ' </a> </div>';
							$('#upload-step').html(upload_block);
							$('#step2_block').addClass('active-border');
							$('#step_2').show(500);

						},

						/**
						 * connect to social medias
						 */
						connectMedia : function(e) {
							e.preventDefault();

							/* activate selected medias */
							if ($(e.target).parents('li').hasClass('active')) {
								$(e.target).parents('li').removeClass('active');
							} else {
								$(e.target).parents('li').addClass('active');
							}

						},

						/**
						 * auto populate school
						 */
						populateSchools : function(eventName) {
							var id = eventName.target.id;
							var text = $('#' + id).val();
							var self = this;
							this.status = false;
							if (text) {
								$('.loading').css("display", "block");
								var newSchool = text;

								/*
								 * post the text that we type to get matched
								 * school
								 */
								$
										.ajax({
											type : 'POST',
											url : "/getAllSchoolsForAutopopulate",
											data : {
												data : text,
											},
											dataType : "json",
											success : function(datas) {

												var codes = '';

												var allSchoolInfo = datas;
												var schoolNames = [];
												_
														.each(
																datas,
																function(data) {

																	schoolNames
																			.push({
																				label : data.schoolName,
																				value : data.schoolName,
																				id : data.id.id
																			});

																});

												// set auto populate schools
												$('#' + id)
														.autocomplete(
																{
																	source : schoolNames,
																	select : function(
																			event,
																			ui) {
																		var text = ui.item.value;

																		/*
																		 * set
																		 * the
																		 * school
																		 * details
																		 * to
																		 * modal
																		 */
																		if (ui.item.value) {
																			$(
																					'#associatedSchoolId')
																					.attr(
																							'value',
																							ui.item.id);
																			// self.data.models[0].set({'schoolName'
																			// :
																			// ui.item.value
																			// ,
																			// 'associatedSchoolId'
																			// :ui.item.id}
																			// );
																		}
																	}
																});
												$('.loading').css("display",
														"none");

											}
										});
							}

						},

						/**
						 * add text box field a enter degree when we choose
						 * 'Other' from Degre Program
						 */
						addOtherDegree : function(eventName) {

							var id = eventName.target.id;
							if ($('#' + id).val() == "Other") {
								$('#otherDegree').show();
							} else {
								this.data.models[0].removeAttr('otherDegree');
								$('#otherDegree').hide();
							}

						},

						/**
						 * to display 'degree expected' or 'date' field
						 */
						showGraduateType : function(eventName) {
							var id = eventName.target.id;
							var dat = '#' + id;
							// var self =
							var value = $('#graduate').val();
							if (value == "attending" || value == "no") {
								this.data.models[0]
										.removeAttr('graduationDate');
								$('#graduationDate-set').hide();
								$('#degreeExpected-set').show();
							} else if (value == "yes") {
								this.data.models[0]
										.removeAttr('degreeExpected');

								$('#degreeExpected-set').hide();
								$('#graduationDate-set').show();
								$('#datepicker').datepicker();
							} else {
								$('#degreeExpected-set').hide();
								$('#graduationDate-set').hide();
							}
						},

						cancelRegistration : function() {
							$.ajax({
								type : 'GET',
								url : "/cancel/registration",
								success : function() {
									window.location.replace("/signup");
								}
							});
						},

					})
			return RegistrationView;
		});