/*******************************************************************************
 * BeamStream
 * 
 * Author : Aswathy P.R (aswathy@toobler.com) Company : Toobler Email: :
 * info@toobler.com Web site : http://www.toobler.com Created : 28/February/2013
 * Description : View for class page
 * ==============================================================================================
 * Change History:
 * ----------------------------------------------------------------------------------------------
 * Sl.No. Date Author Description
 * ----------------------------------------------------------------------------------------------
 * 
 * 
 */

define(
		[ 'view/formView', 'view/streamSliderView',
				'../../lib/bootstrap-select', '../../lib/bootstrap-datepicker',
				'../../lib/jquery.meio.mask', 'model/userSchool','../../lib/script-timepicker'
		],
		function(FormView, StreamSliderView, BootstrapSelect, Datepicker,
				MaskedInput, userSchool) {

			var classView;
			classView = FormView
					.extend({
						objName : 'classView',
						schools : '',
						events : {
							'keyup #className' : 'populateClassNames',
							'focusin #className' : 'populateClassNames',
							'click #createOrJoinStream' : 'createOrJoinStream',
							'click .access-menu li' : 'activateClassAccess',
							'change #schoolId' : 'clearAllClasses',
							'keyup #classCode' : 'populateClassCodes',
							'click #addMoreClass' : 'addMoreClasses',
							'click #startBeam' : 'startBeamstream',
							'focus #classTime' : 'setDefaultTime',
							'focus #newClassTime' : 'setDefaultNewTime',
							'click #add-school' : 'addOrEdiSchool',
							'click div.school_field ul li' : 'hideAddNewSchoolField',
							'keyup #schoolName' : 'populateSchools',
							'focusin #schoolName' : 'populateSchools',
							'click #add_classmates' : 'showFriends',
							'click .days-of-week' : 'selectdaysofweek',
							'click #add-attachment' : 'uploadFiles',
							'change #upload-files-area' : 'getUploadedData',
							'click #post-button' : 'postMessage',
							'click #add-syllabus-attachment' : 'uploadSyllabusFiles',
							'change #upload-syllabus-files-area' : 'getSyllabusUploadedData',
							'keypress #resourcelink' : 'AddLinkPreview',
							'keypress #contactcellNumber' : 'ContactcellNumber',
							'keypress #contactemail' : 'Contactemail',
							'click .professor-days-of-week' : 'selectcontactdays',
							'click #collapseOneHeading' : 'collapseOneHeadingFunc',
							'click #collapseTwoHeading' : 'collapseTwoHeadingFunc',
							'click #collapseSyllabusHeading' : 'collapseSyllabusHeadingFunc',
							'click #collapseThreeHeading' : 'collapseThreeHeadingFunc',
							'click #collapseFourHeading' : 'collapseFourHeadingFunc',
							'click #collapseFiveHeading' : 'collapseFiveHeadingFunc',
							'focus #contactofficeHours' : 'contactofficeHoursSetTime',
							'click #Hidepreview'  : 'HidepreviewFunc',
							'click #studyResourceAttachment' : 'HidestudyResourceAttachment',
							'click #syllabusAttachment' : 'HidesyllabusAttachment',
							'focusin #testdate'   : 'TestDate'
						},
						
						init : function() {
							this.addView(new StreamSliderView({
								el : '#sidebar'
							}));

						},

						showFriends : function() {
							$("#friend-list-modal").modal('show');
							$('#user-online1').mCustomScrollbar("update");
						},

						onAfterInit : function() {
							this.data.reset();
							this.scroll();
							
							this.urlRegex1 = /(https?:\/\/[^\s]+)/g;
							this.urlRegex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
							this.urlRegex2 = /^((http|https|ftp):\/\/)/;
							this.urlReg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
							this.website = /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&amp;?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;

							/*
							 * fetch userSchool model to get all schools of a
							 * user
							 */
							var users = new userSchool();
							users
									.fetch({
										success : function(data, response) {
											// get school names and its ids and
											// added to school dropdown list
											_
													.each(
															response,
															function(school) {
																$('#schoolId')
																		.append(
																				'<option value="'
																						+ school.assosiatedSchoolId.id
																						+ '">'
																						+ school.schoolName
																						+ '</option>');
															});

											$('#associatedSchoolId').val(
													$('#schoolId').val());

											// set select box style
											$('.selectpicker-info')
													.selectpicker(
															{
																style : 'register-select invite-selecter'
															});

											// // set date picker style
											$('#datepicker').datepicker();

											// add an extra li "Add or Edit
											// School" for school dropdown
											/*
											 * $('div.school_field
											 * div.dropdown-menu ul').append('<li id="add-school"  rel="6"><a
											 * href="#" tabindex="-1">--- ADD OR
											 * EDIT SCHOOL ---</a></li>');
											 */

										}
									});

							this.setupPushConnection();
						},
						

						setDefaultNewTime : function(eventName){
							/*alert("jcshdbjs")*/
							$('.timepicker').timepicker();
						},
					
						
						scroll : function(eventName) {

							$("#user-online1").mCustomScrollbar({
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
									updateOnContentResize : true, /*
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
								/* bottom reached offset: integer (pixels) */
								}
							});
						},

						/**
						 * set default time for class time
						 */
						setDefaultTime : function() {

							$("#classTime").setMask('time').val('hh:mm');
						},

						/**
						 * add or edit school
						 */
						addOrEdiSchool : function() {
							// $('#newSchoolModal').modal("show");
							$('#add-new-school').show();
							$('#associatedSchoolId').val('');
							// this.data.models[0].set({'schoolId' :
							// $('#associatedSchoolId').val()});
						},

						/**
						 * hide add-new-school field when we select a school
						 * from the drop down lits
						 */
						hideAddNewSchoolField : function(e) {

							if ($(e.target).parent('li').attr('id'))
								return;
							$('#add-new-school').hide();
							$('#associatedSchoolId').val($('#schoolId').val());
							this.data.models[0].set({
								'schoolId' : $('#associatedSchoolId').val()
							});

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
																					.val(
																							ui.item.id);

																			self.data.models[0]
																					.set({
																						'schoolId' : ui.item.id
																					});
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
						 * auto populate class names - matching a class name
						 */
						populateClassNames : function(eventName) {
							var self = this;
							var text = $('#className').val();
							var selectedSchoolId = $('#schoolId').val();
							self.data.models[0].removeAttr('id');
							$('#createOrJoinStream').text("Create Stream");

							/* call auto populate only when class name is there */
							if (text != '' && selectedSchoolId != '') {

								/*
								 * post the text that we type to get matched  school
								 */
								$.ajax({
										type : 'POST',
										url : "/autoPopulateClassesbyName",
										data : {
											data : text,
											schoolId : selectedSchoolId
										},
										dataType : "json",
										success : function(datas) {
											var codes = '';
											var allClassInfo = datas;
											self.classNames = [];
											_.each(datas,function(data) {

												/*
												 * for auto  populate
												 */
												self.classNames.push({
													label : data.classToReturn.className,
													value : data.classToReturn.className,
													id : data.classToReturn.id.id,
													info : data.usersMap.Student
															+ " Students,"
															+ data.usersMap.Educator
															+ " Educators,"
															+ data.usersMap.Professional
															+ " Professionals ",
													data : data
												});

											});

											if (self.classNames.length == 0)
												return;

											// set auto populate schools
											$('#className').autocomplete({
												source : self.classNames,
												select : function(event,ui) {
													var text = ui.item.value;
													var id = ui.item.id
													$('#createOrJoinStream').text("Join Stream");

													/*
													 * set  the school  details  to  modal
													 */
													self.data.models[0].set({
														'id' : ui.item.id,
														'className' : ui.item.value,
														'classTime' : ui.item.data.classToReturn.classTime,
														'startingDate' : ui.item.data.classToReturn.startingDate,
														'classType' : ui.item.data.classToReturn.classType,
														'classCode' : ui.item.data.classToReturn.classCode
													});
													self.displayFieldsForName(id,ui.item.data);
												}
											});
											}
										});
							}

						},

						/**
						 * populate List of class codes - matching a class code
						 */
						populateClassCodes : function(eventName) {

							var id = eventName.target.id;
							var self = this;

							var text = $('#classCode').val();
							var identity = id.replace(/[^\d.,]+/, '');
							var selectedSchoolId = $('#schoolId').val();
							self.data.models[0].removeAttr('id');
							$('#createOrJoinStream').text("Create Stream");

							/* post the text that we type to get matched classes */
							if (text != '' && selectedSchoolId != '') {

								$.ajax({
											type : 'POST',
											url : '/autoPopulateClassesbyCode',
											data : {
												data : text,
												assosiatedSchoolId : selectedSchoolId
											},
											dataType : "json",
											success : function(datas) {
												var codes = '';
												var allClassInfo = datas;
												self.classCodes = [];
												_.each(datas,function(data) {
													/*
													 * for auto populate
													 */
													self.classCodes.push({
														label : data.classToReturn.classCode,
														value : data.classToReturn.classCode,
														id : data.classToReturn.id.id,
														data : data
													});

												});

												if (self.classCodes.length == 0)
													return;

												// set auto populate
												// functionality for class code
												$('#classCode').autocomplete({
													source : self.classCodes,
													select : function(event,ui) {
	
														var id = ui.item.id;
														$('#createOrJoinStream').text("Joins Stream");
														/*
														 * set  the school  details  to  modal
														 */
														self.data.models[0].set({
															'id' : ui.item.id,
															'className' : ui.item.value,
															'classTime' : ui.item.data.classToReturn.classTime,
															'startingDate' : ui.item.data.classToReturn.startingDate,
															'classType' : ui.item.data.classToReturn.classType,
															'classCode' : ui.item.data.classToReturn.classCode
														});
	
														self.displayFiledsForCode(id,ui.item.data);
														}
											});
											}
								});
							}
						},
						/**
						 * display all other fields of selected class
						 */
						displayFieldsForName : function(id, data) {
							var weekdayslength=data.classToReturn.weekDays.length
							for(var i=0;i<weekdayslength;i++) {
        						if(data.classToReturn.weekDays[i]==0){
        							$("div#classDays #" + 0).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==1){
        							$("div#classDays #" + 1).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==2){
        							$("div#classDays #" + 2).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==3){
        							$("div#classDays #" + 3).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==4){
        							$("div#classDays #" + 4).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==5){
        							$("div#classDays #" + 5).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==6){
        							$("div#classDays #" + 6).toggleClass( "activedays" );
        						}
    						}
							$('#classCode').val(data.classToReturn.classCode);
							$('#startingDate').val(data.classToReturn.startingDate);
							$('#classType').val(data.classToReturn.classTime);
							$('#newClassTime').val(data.classToReturn.classTime.substr(0, 5));
							$('#time span.filter-option').text(data.classToReturn.classTime.substr(5, 7));
							/* if (data.classToReturn.classType == "quarter") {
								$('#classType option').text("Quarter");
							} else {
								$('#classType option').text("Semester");
							} */
							
							$('#classType').val(data.classToReturn.classType);
							
							/*
							* for professorsclass Info
							*/
							if(data.professorClassToReturn.contactEmail!="false"){
								$('#contactemail').val(data.professorClassToReturn.contactEmail);
								$('#contactcellNumber').val(data.professorClassToReturn.contactCellNumber);
								$('#contactofficeHours').val(data.professorClassToReturn.contactOfficeHours);
								$('#contactdays').val(data.professorClassToReturn.contactDays);
								$('#contactdays').val(data.professorClassToReturn.contactDays);
								$('#classAccess').val(data.professorClassToReturn.classInfo);
								$('#gradedfor').val(data.professorClassToReturn.grade);
								$('#gradedfor').val(data.professorClassToReturn.grade);
								$('#resourcetitle').val(data.professorClassToReturn.studyResource[0]);
								$('#resourcelink').val(data.professorClassToReturn.studyResource[1]);
								
								$('#testresourcetitle').val(data.professorClassToReturn.test[0]);
								
								$('#assignment').val(data.professorClassToReturn.test[1]);
								
								$('#testdate').val(data.professorClassToReturn.test[2]);
								$('#attendance').val(data.professorClassToReturn.attendance);
							}
						},

						/**
						 * display all other fields of selected class code
						 */
						displayFiledsForCode : function(id, data) {
							var weekdayslength=data.classToReturn.weekDays.length
							for(var i=0;i<weekdayslength;i++) {
        						if(data.classToReturn.weekDays[i]==0){
        							$("div#classDays #" + 0).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==1){
        							$("div#classDays #" + 1).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==2){
        							$("div#classDays #" + 2).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==3){
        							$("div#classDays #" + 3).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==4){
        							$("div#classDays #" + 4).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==5){
        							$("div#classDays #" + 5).toggleClass( "activedays" );
        						}
        						if(data.classToReturn.weekDays[i]==6){
        							$("div#classDays #" + 6).toggleClass( "activedays" );
        						}
    						}
							$('#className').val(data.classToReturn.className);
							$('#startingDate').val(data.classToReturn.startingDate);
							$('#classType').val(data.classToReturn.classTime);
							$('#newClassTime').val(data.classToReturn.classTime.substr(0, 5));
							$('#time span.filter-option').text(data.classToReturn.classTime.substr(5, 7));
							
							$('#classType').val(data.classToReturn.classType);
							
							/*
							* for professorsclass Info
							*/
							if(data.professorClassToReturn.contactEmail!="false"){
								$('#contactemail').val(data.professorClassToReturn.contactEmail);
								$('#contactcellNumber').val(data.professorClassToReturn.contactCellNumber);
								$('#contactofficeHours').val(data.professorClassToReturn.contactOfficeHours);
								$('#contactdays').val(data.professorClassToReturn.contactDays);
								$('#contactdays').val(data.professorClassToReturn.contactDays);
								$('#classAccess').val(data.professorClassToReturn.classInfo);
								$('#gradedfor').val(data.professorClassToReturn.grade);
								$('#gradedfor').val(data.professorClassToReturn.grade);
								$('#resourcetitle').val(data.professorClassToReturn.studyResource[0]);
								$('#resourcelink').val(data.professorClassToReturn.studyResource[1]);
								
								$('#testresourcetitle').val(data.professorClassToReturn.test[0]);
								
								$('#assignment').val(data.professorClassToReturn.test[1]);
								
								$('#testdate').val(data.professorClassToReturn.test[2]);
								$('#attendance').val(data.professorClassToReturn.attendance);
							}
						},

						/**
						 * clear all class details when we select a school
						 */
						clearAllClasses : function() {
							this.classNames = [];
							$('#className').val("");
							$('#classCode').val("");
							$('#newClassTime').val("");
							$('#classType option').text("Semester");
						},

						/**
						 * create or join streams
						 */
						createOrJoinStream : function(e) {
							e.preventDefault();
							// this.data.models[0].set({'schoolId' :
							// $('#schoolId').val()});
							this.data.models[0].set({
								'schoolId' : $('#associatedSchoolId').val()
							});

							if ($('#newClassTime').val()) {
								var classTime = $('#newClassTime').val();
								this.data.models[0].set({
									'classTime' : classTime
								});
							}
							
							
							
							//var lngt = $("div.days-of-week").length;
							
							var arrclickedDays=[];
							$("div.days-of-week").each(function(index){
								
								var a = $(this).attr("class")
								if(a=="btn btn-small days-of-week activedays"){
									var clickedDays =$(this).attr('id');
									arrclickedDays.push(clickedDays);
								}
								console.log("start")
								console.log(a)
							});
							console.log(arrclickedDays)
							this.data.models[0].set({
								'weekDays' :arrclickedDays
							});
							
							// Contact Info for professor
							this.data.models[0].set({
								'contactEmail' : $('#contactemail').val(),
								'contactcellNumber': $('#contactcellNumber').val(),
								'contactofficeHours': $('#contactofficeHours').val(),
								'contactdays': $('#contactdays').val(),
							});
							
							// Syllabus Info for professor
							this.data.models[0].set({
								'classInfo' : $('#classAccess').val(),
								'grade': $('#gradedfor').val(),
								'studyResource': [$('#resourcetitle').val(),$('#resourcelink').val()],
								'test': [$('#testresourcetitle').val(),$('#assignment').val(),$('#testdate').val()],
								'attendance':$('#attendance').val()
							});
							
							this.data.url = "/class";
							this.saveForm();
						},

						/**
						 * class form success and redirect to stream page
						 */
						success : function(model, data) {
							var self = this;
							if (data.resultToSend.status == "Success") {
								$("#selectNextStep").modal('show');

								/* update stream list when we add/join a stream */
								streamView = this.getViewById('sidebar');
								streamView.add(model, data);
								streamView.fetch();

								$('#add-new-school').hide();
								this.data.models[0].set({
									'schoolId' : $('#associatedSchoolId').val()
								});
								this.data.models[0].removeAttr('stream');
								this.data.models[0].removeAttr('resultToSend');
								/* 
								*add attachment(Study Resorces Attachment) in userMedia for professor class
								*/
								$('#msg-area').css('margin','-1px 0 -5px 14px');
								$('#msg-area').css('padding','5px 6px 4px 6px');
								$('.ask-outer').css('height', '0px');
								$('a.ask-button').css('visibility', 'hidden');
								$('div.loadingImage').css('display','block');
								$('#uploded-file-area').hide();
								var self = this;
								var streamId = data.stream.id.id;
								var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
								var message = $('#msg-area').val();
								// if(message){
								// get message access private ? / public ?
								var messageAccess, googleDoc = false;
								var msgAccess = $('#private-to').attr('checked');
								var privateTo = $('#select-privateTo')
										.attr('value');
								if (msgAccess == "checked") {	
									messageAccess = privateTo;
								} else {
									messageAccess = "Public";
								}

								var trueUrl = '';
								if (streamId) {

									/* if there is any files for uploading */
									if (this.file) {
										var attachdata;
										attachdata = new FormData();
										attachdata.append('docDescription', message);
										attachdata.append('docAccess', messageAccess);
										attachdata.append('docData', self.file);
										attachdata.append('streamId', streamId);
										attachdata.append('uploadedFrom', "discussion");
										attachdata.append('docURL', self.docurlAmazon);
										/* post profile page details */
										$.ajax({
												type : 'POST',
												data : attachdata,
												url : "/postSyllabusFromDisk",
												cache : false,
												contentType : false,
												processData : false,
												dataType : "json",
												success : function(attachdata) {
														// set progress bar as
														// 100 %
														$('#msg-area').val("");
														$('#uploded-file').hide();

														self.file = "";

														$('#file-upload-loader').css("display","none");

														var datVal = formatDateVal(data.message.timeCreated);

														var datas = {
															"data" : attachdata,
															"datVal" : datVal
														}

														// set the response data
														// to model
														if(self.attachdata.models[0]) {
															self.attachdata.models[0].set({
																message : attachdata.message,
																docName : attachdata.docName,
																docDescription : attachdata.docDescription,
																profilePic : attachdata.profilePic
															})
															

															/* Pubnub auto push */
															PUBNUB.publish({
																channel : "stream",
																message : {
																	pagePushUid : self.pagePushUid,
																	streamId : streamId,
																	data : self.attachdata.models[0],
																}

															})
														}

														// show the uploaded
														// file on message llist
														var messageItemView = new MessageItemView({
															model : self.attachdata.models[0]
														})
														$('#messageListView div.content').prepend(messageItemView.render().el);
														$('.loadingImage').css('display','none');

														self.selected_medias = [];
														$('#share-discussions li.active').removeClass('active');

														$('a.ask-button').css('visibility','hidden');
														$('.ask-outer').css('height','0px');
												}
										});
									} 

								}
								/*
								*end attachment
								*/

								/*
								 * PUBNUB auto push for updating the no.of users
								 * in the stream
								 */
								if (data.resultToSend.message == "Joined Stream Successfully") {
									PUBNUB.publish({
										channel : "classMembers",
										message : {
											pagePushUid : self.pagePushUid,
											data : data
										}
									})
								}

							} else {
								alert(data.resultToSend.message);
								location.reload();
							}

							/* clear all form fields */
							this.data.models[0].removeAttr('message');
							this.data.models[0].removeAttr('status');

							$('#class-form').find("input[type=text], input[type=password]").val("");
							$('#classTime span.filter-option').text("Class Time");
							$('#classType span.filter-option').text("Semester");

							/* set default model values */
							this.data.models[0].set({
								schoolId : '',
								classCode : '',
								className : '',
								classTime : '',
								startingDate : '',
								weekDays :'',
								classType:''
							});
							$('span.error').remove();
							$.ajax({
								type : 'GET',
								url : "/registrationComplete"
							});
						},

						serverError : function(model, data) {
						},

						/**
						 * set active class to selected class access
						 */
						activateClassAccess : function(e) {
							e.preventDefault();
						},

						/**
						 * stay on class page to add more classes
						 */
						addMoreClasses : function(e) {
							e.preventDefault();
							$("#selectNextStep").modal('hide');
						},

						/**
						 * go to stream page
						 */
						startBeamstream : function(e) {
							e.preventDefault();
							window.location = "/stream";
						},
						
						selectdaysofweek : function(e) {
							var clickedDays = $(e.target).attr('id');
							$("div#classDays #" + clickedDays).toggleClass( "activedays" );
						},
						
						uploadFiles : function(eventName) {
							eventName.preventDefault();
							$('#upload-files-area').click();
						},
						
						/**
						 * get files data to be upload
						 */
						getUploadedData : function(e) {
							$('a.ask-button').css('visibility', 'hidden');
							var self = this;
							file = e.target.files[0];
							var reader = new FileReader();
							
							reader.onload = (function(f) {
								self.file = file;
								
								clearInterval(self.progress);
								$('.fileUploadMsg').css('visibility', 'visible');
								$('.fileUploadMsg').css('display', 'block');
								$('div#fileUploadingImage #floatingCirclesG').css('visibility', 'visible');
								$('div#fileUploadingImage #floatingCirclesG').css('display', 'block');
								
								var studyAttachment = "<div class=\"embed\" style=\"height:30px;\">"+
													"<span>"+f.name+"</span>"+
													"<span class=\"action\"><a href=\"javascript:void(0)\" id=\"studyResourceAttachment\" class=\"nothumb\" style=\"float:right;display:none;\">✕</a></span>"+
													"</div>";	
								$('#file-name').html(studyAttachment);
								$('#uploded-file-area').show();
								
								$('.ask-outer').height(function(index, height) {
									return (height + 70);
								});
								$("ul#uploded-file-area").css('height','70px');
							})(file);

							reader.readAsDataURL(file);
							
							var message = $('#msg-area').val();
							var msgAccess = $('#private-to').attr('checked');
							var privateTo = $('#select-privateTo')
									.attr('value');
							if (msgAccess == "checked") {
								messageAccess = privateTo;
							} else {
								messageAccess = "Public";
							}
							var streamId = $('.sortable li.active').attr('id');
							
							var data;
							data = new FormData();
							data.append('docDescription', message);
							data.append('docAccess', messageAccess);
							data.append('docData', self.file);
							data.append('streamId', streamId);
							data.append('uploadedFrom', "discussion");

							/* post profile page details */
							$.ajax({
								type : 'POST',
								data : data,
								url : "/uploadDocumentFromDisk",
								cache : false,
								contentType : false,
								processData : false,
								dataType : "json",
								success : function(data) {
									$('.fileUploadMsg').css('visibility', 'hidden');
									$('.fileUploadMsg').css('display', 'none');
									$('div#fileUploadingImage #floatingCirclesG').css('visibility', 'hidden');
									$('div#fileUploadingImage #floatingCirclesG').css('display', 'none');
									self.docurlAmazon = data[0];
								}
							});
						},
						/**
						 * post messages
						 */
						postMessage : function() {
							$('#msg-area').css('margin','-1px 0 -5px 14px');
							$('#msg-area').css('padding','5px 6px 4px 6px');
							$('.ask-outer').css('height', '0px');
							$('a.ask-button').css('visibility', 'hidden');
							$('div.loadingImage').css('display','block');
							$('#uploded-file-area').hide();
							var self = this;
							var streamId = $('.sortable li.active').attr('id');
							var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
							var message = $('#msg-area').val();
							// if(message){
							// get message access private ? / public ?
							var messageAccess, googleDoc = false;
							var msgAccess = $('#private-to').attr('checked');
							var privateTo = $('#select-privateTo')
									.attr('value');
							if (msgAccess == "checked") {	
								messageAccess = privateTo;
							} else {
								messageAccess = "Public";
							}

							var trueUrl = '';
							if (streamId) {
								/* if there is any files for uploading */
								if (this.file) {
									var data;
									data = new FormData();
									data.append('docDescription', message);
									data.append('docAccess', messageAccess);
									data.append('docData', self.file);
									data.append('streamId', streamId);
									data.append('uploadedFrom', "discussion");
									data.append('docURL', self.docurlAmazon);
									/* post profile page details */
									$.ajax({
										type : 'POST',
										data : data,
										url : "/postDocumentFromDisk",
										cache : false,
										contentType : false,
										processData : false,
										dataType : "json",
										success : function(data) {
												$('#msg-area').val("");
												$('#uploded-file').hide();
												self.file = "";
												$('#file-upload-loader').css("display","none");
												var datVal = formatDateVal(data.message.timeCreated);
												var datas = {
													"data" : data,
													"datVal" : datVal
												}
												// set the response data to model
												if(self.data.models[0]) {
													self.data.models[0].set({
														message : data.message,
														docName : data.docName,
														docDescription : data.docDescription,
														profilePic : data.profilePic
													})
													/* Pubnub auto push */
													PUBNUB.publish({
														channel : "stream",
														message : {
															pagePushUid : self.pagePushUid,
															streamId : streamId,
															data : self.data.models[0],
														}
	
													})
												}

												// show the uploaded
												// file on message llist
												var messageItemView = new MessageItemView({
													model : self.data.models[0]
												})
												$('#messageListView div.content').prepend(messageItemView.render().el);
												$('.loadingImage').css('display','none');
												self.selected_medias = [];
												$('#share-discussions li.active').removeClass('active');
												$('a.ask-button').css('visibility','hidden');
												$('.ask-outer').css('height','0px');
										}
									});

								} else {

									if (message.match(/^[\s]*$/))
										return;
									// find link part from the message
									message = $.trim(message);
									var link = message.match(self.urlReg);

									if (!link)
										link = message.match(self.website);

									if (link) {
										if (!self.urlRegex2.test(link[0])) {
											urlLink = "http://" + link[0];
										} else {
											urlLink = link[0];
										}

										var msgBody = message, link = msgBody.match(self.urlReg);

										if (!link)
											link = msgBody.match(self.website);

										var msgUrl = msgBody.replace(
											self.urlRegex1, function(msgUrlw) {
												trueurl = msgUrlw;
												return msgUrlw;
										});

										// To check whether it is google docs or
										// not
										if (!urlLink.match(/^(https:\/\/docs.google.com\/)/)) {
											// check the url is already in bitly
											// state or not
											if (!urlLink.match(/^(http:\/\/bstre.am\/)/)) {
												/* post url information */
												$.ajax({
													type : 'POST',
													url : 'bitly',
													data : {
														link : urlLink
													},
													dataType : "json",
													success : function(data) {
														message = message.replace(link[0],data.data.url);
														self.postMessageToServer(
															message,
															streamId,
															messageAccess,
															googleDoc
														);
													}
												});
											} else {
												self.postMessageToServer(
														message, streamId,
														messageAccess,
														googleDoc
												);
											}
										} // doc
										else // case: for doc upload
										{
											googleDoc = true;
											self.postMessageToServer(message,streamId, messageAccess,googleDoc);
										}
									}
									// case: link is not present in message
									else {
										self.postMessageToServer(message,streamId, messageAccess,googleDoc);
									}

								}

							}
						},
						
						
						uploadSyllabusFiles : function(eventName) {
							
							eventName.preventDefault();
							$('#upload-syllabus-files-area').click();
				
						},
						/**
						 * get syllabus files data to be upload
						 */
						getSyllabusUploadedData : function(e) {
							var self = this;
							file = e.target.files[0];
							var reader = new FileReader();
							
							reader.onload = (function(f) {
								self.file = file;
								
								clearInterval(self.progress);
								$('.syllabusFileUploadMsg').css('visibility', 'visible');
								$('.syllabusFileUploadMsg').css('display', 'block');
								$('div#SyllabusFileUploadingImage #floatingCirclesG').css('visibility', 'visible');
								$('div#SyllabusFileUploadingImage #floatingCirclesG').css('display', 'block');
								var syllabusAttachment = "<div class=\"embed\" style=\"height:30px;\">"+
								"<span>"+f.name+"</span>"+
								"<span class=\"action\"><a href=\"javascript:void(0)\" id=\"syllabusAttachment\" class=\"nothumb\" style=\"float:right;display:none;\">✕</a></span>"+
								"</div>";	
								$('#syllabus-file-name').html(syllabusAttachment);
								$('#uploded-syllabus-file-area').show();
								
								$('.ask-outer').height(function(index, height) {
									return (height + 70);
								});
								$("ul#uploded-syllabus-file-area").css('height','70px');
							})(file);

							reader.readAsDataURL(file);
							
							var message = $('#msg-area').val();
							var msgAccess = $('#private-to').attr('checked');
							var privateTo = $('#select-privateTo')
									.attr('value');
							if (msgAccess == "checked") {
								messageAccess = privateTo;
							} else {
								messageAccess = "Public";
							}
							var streamId = $('.sortable li.active').attr('id');
							
							var data;
							data = new FormData();
							data.append('docDescription', message);
							data.append('docAccess', messageAccess);
							data.append('docData', self.file);
							data.append('streamId', streamId);
							data.append('uploadedFrom', "discussion");

							/* post profile page details */
							$
									.ajax({
										type : 'POST',
										data : data,
										url : "/uploadDocumentFromDisk",
										cache : false,
										contentType : false,
										processData : false,
										dataType : "json",
										success : function(data) {
											$('.syllabusFileUploadMsg').css('visibility', 'hidden');
											$('.syllabusFileUploadMsg').css('display', 'none');
											$('div#SyllabusFileUploadingImage #floatingCirclesG').css('visibility', 'hidden');
											$('div#SyllabusFileUploadingImage #floatingCirclesG').css('display', 'none');
											self.docurlAmazon = data[0];
										}
									});

							

						},
						
						
						/**
						 * set message data to model and posted to server
						 */
						AddLinkPreview : function(e) {
							var code=e.which;
							if(code == 32){
							$('div#LinkPreview #floatingCirclesG').css('visibility', 'visible');
							$('div#LinkPreview #floatingCirclesG').css('display', 'block');
							$('#link-preview-area').show();
							var link=$("#resourcelink").val();
							$.ajax({
								type : 'GET',
								url : "http://api.embed.ly/1/oembed?url="+link+"",
								dataType : "json",
								success: function(data) {
									console.log(data);
									$('#link-preview-area').hide();
									$('div#LinkPreview #floatingCirclesG').css('visibility', 'hidden');
									$('div#LinkPreview #floatingCirclesG').css('display', 'none');
									
									if(data.thumbnail_url){
										var sendData =   "<div class=\"embed\" style=\"width:95%;margin-left:6px;\">" +
										"<div class=\"action\" ><a href=\"javascript:void(0)\" id=\"Hidepreview\" class=\"nothumb\" style=\" float:right;display:none;\">✕</a></div>"+
										"<div><img src=\""+data.thumbnail_url+"\" class=\"thumb\" style=\"max-width: 100%;max-height:100px\"></div>" +
										"<div><a href=\""+data.url+"\" target=\"_blank\">"+data.title+"</a></div>" +
										"<div class=\"preview-description\">"+data.description+"</div> " +
										"<div><a href=\""+data.url+"\" class=\"provider\" target=\"_blank\">"+data.url+"</a></div></div>";	
									}else{
										var sendData =   "<div class=\"embed\">" +
										"<div class=\"action\" ><a href=\"javascript:void(0)\" id=\"Hidepreview\" class=\"nothumb\" style=\" float:right;display:none;\">✕</a></div>"+
										"<div><a href=\""+data.url+"\" target=\"_blank\">"+data.title+"</a></div>" +
										"<div class=\"preview-description\">"+data.description+"</div> " +
										"<div><a href=\""+data.url+"\" class=\"provider\" target=\"_blank\">"+data.url+"</a></div></div>" ;	
									}
									
									$('#selector-wrapper').html(sendData);
					              },
					              error: function(data){
					            	  $('#link-preview-area').hide();
					            	  $('div#LinkPreview #floatingCirclesG').css('visibility', 'hidden');
									  $('div#LinkPreview #floatingCirclesG').css('display', 'none');
									  $('#selector-wrapper').html(" ");
					              }
							});
							}
						},
						
						
						ContactcellNumber : function(e) {
							$("#contactcellNumber").setMask('(999) 999-9999');
						},
						
						Contactemail : function(e){
							$( "body" ).mouseup(function() {
								var emailID = $("#contactemail").val();
								var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
						        var status = pattern.test(emailID);
								if(status){
									$("#email-error").html(' ');
								}else{
									$("#email-error").html('<span >* Please enter valid emailId</span>');
								}
							});
						},
						
						selectcontactdays : function(e) {
							var clickedDays = $(e.target).attr('id');
							$(".p" + clickedDays).toggleClass( "activedays" );
						},
						
						collapseOneHeadingFunc : function(e){
							$("#classAccess").show();
					        var isVisibleOneHeading = $( "#classAccess" ).is( ":visible" );
							if(isVisibleOneHeading){
								$("#classAccess").focus();
						        $("#classAccess").blur(function(event) {
						        	var data=$("#classAccess").val();
						        	 if(!data){
						        		
						        		 $("#classAccess").attr("style", "display: none;");
						        	 }
						    	 });	
							}
						},
						
						collapseTwoHeadingFunc : function(e){
							$("#gradedfor").show();
					        var isVisibleTwoHeading = $("#gradedfor").is( ":visible" );
							if(isVisibleTwoHeading){
								$("#gradedfor").focus();
						        $("#gradedfor").blur(function(event) {
						        	var gradedfordata=$("#gradedfor").val();
						        	 if(!gradedfordata){
						        		 $("#gradedfor").attr("style", "display: none;");
						        	 }
						    	});
							}
						},
						
						collapseSyllabusHeadingFunc : function(e){
							$("#add-syllabus-attachment").toggle();
							
							/*var isVisibleSyllabusHeading = $( "#add-syllabus-attachment" ).is( ":visible" );
							if(isVisibleSyllabusHeading){
						        //$("body").click(function(event) {
						        	var dataAttachment=$("#syllabus-file-name").text();
						        	 if(dataAttachment){
						        		 $("#add-syllabus-attachment").attr("style", "display: inline-block;");
						        	 }else{
						        		 setTimeout(function () {
						        			 var dataAttachmentLater=$("#syllabus-file-name").text();
						        			 if(!dataAttachmentLater){
							        			 $("#add-syllabus-attachment").fadeToggle();
						        			 }
						        		 }, 10000);
						        	 }
						    	 //});
							}*/
						},
						
						collapseThreeHeadingFunc : function(e){
							$("#resourcetitle").show();
					        $("#add-attachment").show();
					        $("#resourcelink").show();
					        $("#insterlinkTitle").show();
					        var isVisibleThreeHeading = $("#resourcetitle").is( ":visible" );
					        if(isVisibleThreeHeading){
					        	 $("#resourcetitle").focus();
						        $("#resourcetitle").blur(function(event) {
						        	setTimeout(function() {
									  var focused =$("#resourcelink").is(":focus");
									  if(!focused){
										  var dataAddAttachment=$("#file-name").text();
								        	var dataresourcetitle=$("#resourcetitle").val();
								        	var dataresourcelink=$("#resourcelink").val();
								        	 if(dataAddAttachment || dataresourcetitle || dataresourcelink){
								        		 $("#resourcetitle").attr("style", "display: inline-block;");
								        		 $("#add-attachment").attr("style", "display: inline-block;");
								        		 $("#resourcelink").attr("style", "display: inline-block;");
								        		 $("#insterlinkTitle").attr("style", "display: inline-block;");
								        		 
								        	 }else{
								        		 
								        		 $("#resourcetitle").attr("style", "display: none;");
								        		 $("#add-attachment").attr("style", "display: none;");
								        		 $("#resourcelink").attr("style", "display: none;");
								        		 $("#insterlinkTitle").attr("style", "display: none;");
								        	 }
									  }
						        	}, 10);
						        	
						        	
						    	 });
						        
						        
						        $("#resourcelink").blur(function(event) {
						        	setTimeout(function() {
									  var focused =$("#resourcetitle").is(":focus");
									  if(!focused){
										  var dataAddAttachment=$("#file-name").text();
								        	var dataresourcetitle=$("#resourcetitle").val();
								        	var dataresourcelink=$("#resourcelink").val();
								        	 if(dataAddAttachment || dataresourcetitle || dataresourcelink){
								        		 $("#resourcetitle").attr("style", "display: inline-block;");
								        		 $("#add-attachment").attr("style", "display: inline-block;");
								        		 $("#resourcelink").attr("style", "display: inline-block;");
								        		 $("#insterlinkTitle").attr("style", "display: inline-block;");
								        		 
								        	 }else{
								        		 
								        		 $("#resourcetitle").attr("style", "display: none;");
								        		 $("#add-attachment").attr("style", "display: none;");
								        		 $("#resourcelink").attr("style", "display: none;");
								        		 $("#insterlinkTitle").attr("style", "display: none;");
								        	 }
									  }
						        				  
						        	}, 10);
						        	
						        	
						    	 });
						        
							}
						},
						
						collapseFourHeadingFunc : function(e){
							$("#testresourcetitle").toggle();
					        $("#assignment").toggle();
					        $("#testdate").toggle();

					        var isVisibleFourHeading = $("#testresourcetitle").is( ":visible" );
					        if(isVisibleFourHeading){
					        	$("#testresourcetitle").focus();
						        $("#testresourcetitle").blur(function(event) {
						        	setTimeout(function() {
										  var focused =$("#testdate").is(":focus");
										  if(!focused){
											  var datatestresourcetitle=$("#testresourcetitle").val();
									        	var datatestdate=$("#testdate").val();
									        	 if(datatestresourcetitle || datatestdate){
									        		 $("#testresourcetitle").attr("style", "display: inline-block;");
									        		 $("#assignment").attr("style", "display: inline-block;");
									        		 $("#testdate").attr("style", "display: inline-block;");
									        	 }else{
									        		 $("#testresourcetitle").attr("style", "display: none;");
									        		 $("#assignment").attr("style", "display: none;");
									        		 $("#testdate").attr("style", "display: none;");
									        	 }
										  }
										  
							        				  
							        }, 10);
						    	 });
						        
						        $("#testdate").blur(function(event) {
						        	setTimeout(function() {
										  var focused =$("#testresourcetitle").is(":focus");
										  if(!focused){
											  var datatestresourcetitle=$("#testresourcetitle").val();
									        	var datatestdate=$("#testdate").val();
									        	 if(datatestresourcetitle || datatestdate){
									        		 $("#testresourcetitle").attr("style", "display: inline-block;");
									        		 $("#assignment").attr("style", "display: inline-block;");
									        		 $("#testdate").attr("style", "display: inline-block;");
									        	 }else{
									        		 $("#testresourcetitle").attr("style", "display: none;");
									        		 $("#assignment").attr("style", "display: none;");
									        		 $("#testdate").attr("style", "display: none;");
									        	 }
										  }
							        				  
							        }, 10);
						    	 });
							}
						},
						
						collapseFiveHeadingFunc : function(e){
							$("#attendance").toggle();
					    	var isVisibleFiveHeading = $( "#attendance" ).is( ":visible" );
							if(isVisibleFiveHeading){
								$("#attendance").focus();
						        $("#attendance").blur(function(event) {
						        	var dataattendance=$("#attendance").val();
						        	 if(dataattendance){
						        		 $("#attendance").attr("style", "display: inline-block;");
						        	 }else{
						        		 $("#attendance").attr("style", "display: none;");
						        	 }
						    	 });
							}
						},
						
						contactofficeHoursSetTime : function(e){
							$('#contactofficeHours').timepicker();
						},
						
						HidepreviewFunc : function(e){
							$(".embed").hide();
						},
						
						HidestudyResourceAttachment : function(e){
							$("#file-name").html("");
						},
						
						HidesyllabusAttachment : function(e){
							$("#syllabus-file-name").html("");
						},
						
						
						TestDate : function(e){
							 $( "#testdate" ).datepicker();
						},

						/**
						 * PUBNUB real time push
						 */
						setupPushConnection : function() {
							var self = this;
							self.pagePushUid = Math.floor(
									Math.random() * 16777215).toString(16);

							/* for updating user count of stream */
							/*PUBNUB
									.subscribe({

										channel : "classMembers",
										restore : false,
										callback : function(message) {

											if (message.pagePushUid != self.pagePushUid) {
												$(
														'span#'
																+ message.data.stream.id.id
																+ '-users')
														.html(
																message.data.stream.usersOfStream.length);

											}
										}
									})*/

						}

					})
			return classView;
		});