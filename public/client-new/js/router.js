 /***
	 * BeamStream
	 *
	 * Author                : Aswathy .P.R (aswathy@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 12/August/2012
	 * Description           : Backbone router containing root for all pages
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */

	BS.AppRouter = Backbone.Router.extend({
	
	    routes:{
	    	
	        "":"home",
	        "login":"login",
	        "recoverAccount" : "recoverAccount",
	        "emailVerification": "emailVerification",
	        "school":"schoolReg",
	        "class":"classReg",
	        "profile":"profileReg",
	        "streams":"mainStream",
            "signup":"signup",
            "registration":"registration",
//	        "basicRegistration/token/:token/iam/:iam/emailId/:email":"",
//	        "basicRegistration":"basicRegistrationViaJanRain",
	        "classStream":"classStream",
	        "filesMedia" : "filesMedia",
	        "googledocs" : "googleDocs",
	        "docs" : "docsFromComputer", 
	        "imagelist" : "imageList",
	        "videos" : "videoList",
	        "audioview": "audioList",
	        "presentationview": "presentationList",
	        "pdflistview":"pdflistview",
	        "settings" : "settings"
	        
	       
	
	    },
	    
	    initialize :function() {
	    	
	  		BS.user = new BS.SingleUser();
	    	BS.user.authenticate();
	    	var self = this;
	    	BS.idLogin = '';
	        BS.mySchools = '';
	    	/* calculate time from 12:00AM to 11:45PM */
	    	var timeValues = new Array;
	  		var hours, minutes, ampm;
	  		for(var i = 0; i <= 1425; i += 15){
	  		        hours = Math.floor(i / 60);
	  		        minutes = i % 60;
	  		        if (minutes < 10){
	  		            minutes = '0' + minutes; // adding leading zero
	  		        }
	  		        ampm = hours % 24 < 12 ? 'AM' : 'PM';
	  		        hours = hours % 12;
	  		        if (hours === 0){
	  		            hours = 12;
	  		        }
	  		        var time = hours+':'+minutes+''+ampm ;
	  		        timeValues.push({"time" : time});
	  		 }
	  		BS.times = jQuery.parseJSON(JSON.stringify(timeValues));
	
	    	
	    },
	 
	    home: function() {
	    	console.log('Here');
	    	
	    },
	
	    /**
	     * display login form
	     */
	    login: function() {
	    	 var self =this;
	    	  
	    	 BS.user.fetch({ success:function(e) {
	    		 
				if(e.get('loggedin') == false) {
					 
			    	 localStorage.clear();
			    	 localStorage["idLogin"]= '';
			    	 $('#school-popup').children().detach(); 
			    	 BS.loginView = new BS.LoginView();
			    	 BS.loginView.render();
			     
			    	 localStorage["idLogin"] = "login";
			         $('#school-popup').html(BS.loginView.el);  
			         
			         $(".modal select:visible").selectBox();
			     	 $("#login-form").validate();
			         localStorage["regInfo"] ='';
			         localStorage["schoolInfo"] ='';
			         localStorage["classInfo"] ='';
			         
			         $(".checkbox").dgStyle();
			         $(".signin_check").dgStyle();
			         
			         //get cookies
			         var username= $.cookie('userName');
			         var password = $.cookie('password');
			         
			         if(username != null && username != "" && password !=null && password != "") 
			         {
			        	 $('#email').val(username);
			        	 $('#password').val(password);
			         }
			         
			         /* display janRain component */
	             showJanrainSigninWidget();
			 
				}
				else {
					console.log("Login page => Stream page");
					BS.AppRouter.navigate("streams", {trigger: true});
				}
				
			}});
	  
	    },
	   
	    /**
	     * recover password/Account
	     */
	    recoverAccount: function() {
	    	
	    	 BS.user.fetch({ success:function(e) {
	    		 
	 			if(e.get('loggedin') == false) {
	 				
			    	 $("#dialog").dialog('close');
			    	 $('#school-popup').children().detach(); 
			    	  
			    	 BS.forgotPasswordView = new BS.ForgotPasswordView();
			    	 BS.forgotPasswordView.render();
			     
			         $('#school-popup').html(BS.forgotPasswordView.el);  
			         $(".modal select:visible").selectBox();
			         $("#forgot-pass-form").validate();
			         $(".checkbox").dgStyle();
			         $(".signin_check").dgStyle();
	 			}
				else {
					
					BS.AppRouter.navigate("streams", {trigger: true});
				}
				
			}});
	    },
	    /**
	     * display School Info screen
	     */
	    schoolReg:function () {
	    	
	    	  
	   	 BS.user.fetch({ success:function(e) {
			  if(e.get('loggedin') == true) {
		    	
			    	$("#dialog").dialog('close'); 
			        if(localStorage["schoolInfo"])
				    {
			        	 current = 0;
				         BS.schoolView = new BS.SchoolView();
				         BS.schoolView.render();
				         $('#school-popup').html(BS.schoolView.el);
				         var schoolInfo =JSON.parse(localStorage["schoolInfo"]);
				         $('#school-list').html('');	
				         
				        _.each(schoolInfo, function(info) {
				        	current++;
							var datas = {
							"data" : info,
							"number" : current
						    }
							var source = $("#tpl-school").html();
							var template = Handlebars.compile(source);
							$('#school-list').append(template(datas));
							
							if(info.degree != "Other")
							{
								$('#other-degrees-'+current).hide();
							}
							
							$('#year-'+current).val(info.year);
							$('#degreeprogram-'+current).val(info.degree);
							$('#graduated-'+current).val(info.graduated);
							if(info.graduated == "yes")
							{
								$('#degree-exp-'+current).hide();
								$('#calendar-'+current).val(info.graduationDate);
							
							}
							else
							{
								$('#cal-'+current).hide();
								$('#degree-expected-'+current).val(info.degreeExpected);
							
							}
							 
							$(".modal select:visible").selectBox();
							$('.modal .datepicker').datepicker();
							$('.datepicker').css('z-index','99999');
						
				        });
				        
				        if(localStorage["schoolFromPrev"] != '')
				        {
				        	$('#school-name-1').val( localStorage["schoolFromPrev"]);  // transport school name from sign up page to school screen
				         	$('#prev-school').attr("value", localStorage["schoolFromPrev"]);
				         	$('#associatedId-1').attr("value", localStorage["newSchoolId"]);
				         	
				        }
				            
				    }
			        else        
				     {
			        	 localStorage["schoolInfo"] = ''; 
				         BS.schoolView = new BS.SchoolView();
				         BS.schoolView.render();
				         
				         $('#school-popup').html(BS.schoolView.el);
				         
				         current = 1;
				         if(localStorage["schoolFromPrev"] != '')
				         {
				        	$('#school-name-1').val(localStorage["schoolFromPrev"]);  // transport school name from sign up page to school screen
				        	$('#prev-school').attr("value",localStorage["schoolFromPrev"]);
				        	 
				        	 $.ajax({
					        	   type : 'POST',
					 			   url : BS.autoPopulateSchools,
					 			   data : {
					 				   data : localStorage["schoolFromPrev"],
					 			   },
					 			   dataType : "json",
								   success : function(datas) {
										_.each(datas, function(data) {
											 if(data.schoolName == localStorage["schoolFromPrev"])
									    	  {
												 
									    		  var sId = data.id.id;
									    		  $('#school-id-1').attr('value',1);
									    		  $('#associatedId-1').attr('value',sId);
									    		 
									    	  }
								        });
									}
								});
			 
				         }
				        
				            /* hide some fields on page load */
				            $('#degree-exp-1').hide();
				            $('#cal-1').hide();
				            $('#other-degrees-1').hide();
				            
				     }
			        $(".modal select:visible").selectBox();
			        $('.modal .datepicker').datepicker();
			        $('.datepicker').css('z-index','99999');
			        $("#school-form").validate();
		        
			  }
			  else 
			  {
					console.log("Login page => Stream page");
					BS.AppRouter.navigate("streams", {trigger: true});
			  }
			
		 }});
	    },
	    
	   
	    /**
	     * display Class Info screen
	     */
	    classReg:function () {
	 
	      BS.user.fetch({ success:function(e) {
	  		if(e.get('loggedin') == true) {
	  
			    	$("#dialog").dialog('close');
			    	if(localStorage["classInfo"])
			    	{
			    		 BS.classView = new BS.ClassView();
			             BS.classView.render();
			             
			             $('#school-popup').html(BS.classView.el);
			             
			             var classInfo =JSON.parse(localStorage["classInfo"]);
				         $('#class-list').html('');	
				         
				         var totalClasses = classInfo.length;
				         
				         var classPack ;
				         sClasses = 0;
				         var schools = localStorage["schoolList"];
				        
				         while(totalClasses > 0)
				         {
				        	 var i = 0;
				        	 // slice the class array according to their schoolId
				        	 var c_schoolId = classInfo[0].schoolId.id;
				        	 
				        	 for(var j=0 ; j<totalClasses ; j++)
				        	 {
				        		 if(classInfo[j].schoolId.id == c_schoolId)
				        		 {
				        			 i++;
				        		 }
				        		 else
				        		 {
				        			 break;
				        		 }
				        	 }
			
				        	 classPack = classInfo.splice(0,i);
				        	 sClasses++;
				        	 
							 var count = {
										"sCount" : sClasses,
							 }
							 var source = $("#edit-class").html();
							 var template = Handlebars.compile(source);
							 $('#class-list').append(template(count));
							 
							 // add all schools to school list
							 var addSchoolList = '<select id="school-'+sClasses+'" class="large all-schools">'+schools+'</select>'; 
							 $('#school-list-'+sClasses).html(addSchoolList);
							 
							 //selected the schoolName from list
							 $('#school-'+sClasses+' option[value="'+c_schoolId+'"]').attr('selected', 'selected');
							 var schoolName = $('#school-'+sClasses+' option[value="'+c_schoolId+'"]').val();
							 $('#school-list-'+sClasses+' a span.selectBox-label').html(schoolName);
							 
							 $(".modal select:visible").selectBox();
							 
							 var orgLength =  classPack.length;
							 var cInt = 0;
							 for(var k=0;k<3;k++)
							 {
								 var sId = '';
								 if(k <= orgLength-1)
								 {
									 sId = classPack[k].streams[0].id;
									 
								 }
								 else
								 {
									 sId = '';
								 }
								 cInt++;
								 var singleClassInfo ={
										 "data" : classPack[k],
										 "sCount" : sClasses,
										 "times" : BS.times,
										 "cInt" :cInt,
										 "sId" :sId
								 }
								 var source = $("#single-class").html();
								 var template = Handlebars.compile(source);
								 $("#classes_under_a_school-"+sClasses).append(template(singleClassInfo));
								 
								 
								 if(k <= orgLength-1)
								 {
									 //set time 
									 $('#class-time-'+sClasses+'-'+cInt).val(classPack[k].classTime);
									 $('#div-time-'+sClasses+'-'+cInt+' a span.selectBox-label').html(classPack[k].classTime);
									 
									 //set date
									 $('#date-started-'+sClasses+'-'+cInt).val(classPack[k].startingDate);
									 
									 //set class type
									 $('#semester-'+sClasses+'-'+cInt+' option[value="'+classPack[k].classType+'"]').attr('selected', 'selected');
									 if(classPack[k].classType == "quarter")
									 {
										 $('#div-school-type-'+sClasses+'-'+cInt+' a span.selectBox-label').html("Quarter");
									 }
									 else
									 {
										 $('#div-school-type-'+sClasses+'-'+cInt+' a span.selectBox-label').html("Semester");
									 }
								 }
							 }	 
			
							  totalClasses = classInfo.length;
							  
				          }
				        
							$(".modal select:visible").selectBox();
							$('.modal .datepicker').datepicker();
							$('.datepicker').css('z-index','99999');
							
			    	}
			    	else    //edit
			    	{
			    		
			           $('#school-popup').children().detach(); 
			           BS.classView = new BS.ClassView();
			           BS.classView.render();
			           
			           $('#school-popup').html(BS.classView.el);
			           $(".modal select:visible").selectBox();
			           $('.modal .datepicker').datepicker();
			           $("#class-form").validate();
			    	}
	  		 }
			  else 
			  {
					BS.AppRouter.navigate("streams", {trigger: true});
			  }
			
		 }});
	       
	   },
	  
	    
	   /**
	    * display Profile Info screen
	    */
	   profileReg:function () {
		 
		   BS.user.fetch({ success:function(e) {
			   if(e.get('loggedin') == true) {  
		     
//				   $("#dialog").dialog('close');
			       BS.profileView = new BS.ProfileView();
			       BS.profileView.render();
			       $('#school-popup').html(BS.profileView.el); 
			       
			       //set mobile number format  -validation 
			       $("#mobile").mask("(999) 999-9999",{placeholder:"  "});
			       
			       $('.progress-container').hide();
			       $(".modal select:visible").selectBox();
			       $(".radio").dgStyle();
			        
			       $('.modal .datepicker').datepicker();
			       $("#profile-form").validate();
			       
			       // Moved this call to profileview.js - on a click function "ShowJanRainShare"
			       //Render Janrain Invite model  
	//                  showJanrainShareWidget();
			  } 
			 else 
			 {
					BS.AppRouter.navigate("streams", {trigger: true});
			  }
				
		  }});
	   },
 
	   /**
	    * display main stream page
	    */
	   mainStream:function () {
		   var self = this;
	       BS.user.fetch({ success:function(e) {
	    	  
			//	if(e.get('loggedin') == true) {	
		   
		   
				//	   $("#dialog").dialog('close');
				//	   BS.mainImageUrl = $('#right-photo').attr('src');
					  
				//	   $('#middle-content').children().detach();
				//	   $('nav li.active').removeClass('active');
				//	   $('nav li a#streamsGroups').parents('li').addClass('active');
					  
					  
				           
						   $('#school-popup').children().detach(); 
						   $('#content').children().detach();
						   
				//		   $('.modal').css('display','none');
//						   BS.user.fetch({ success:function(e) {
							  
							   //store logged user details
						       BS.loggedUserInfo  = e;
						       localStorage["loggedUserInfo"] = e.attributes.id.id;
						       
							   BS.streamView = new BS.StreamView({ model: BS.user });
							   BS.streamView.render();
					//		   BS.schoolBack = false;
					//		   BS.regBack = false;
					//		   BS.classBack = false;
					//		   self.onstream = true; 
					//		   localStorage["regInfo"] ='';
					//	       localStorage["schoolInfo"] ='';
					//	       localStorage["classInfo"] ='';
					//	       localStorage["schoolFromPrev"] = '';
					//	       localStorage["newSchoolId"] = '';
				      //    	   localStorage["newSchool"] ='';
						       
				//		       localStorage["editSchool"] = "true";
				//		       localStorage["editClass"] = "true";
				//		       localStorage["editProfile"] = "true";
					   	   
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							    
							   $('#topheader').html(this.navView.render().el);
							   $('#body-content').html(BS.streamView.el);
				
							   
						       /* get profile images for user */
					           $.ajax({
					    			type : 'POST',
					    			url : BS.profileImage,
					    			dataType : "json",
					    			data : {
						    				 userId :  e.attributes.id.id
						    	    },
					    			success : function(data) {
					    				 
					    				 // default profile image
					    				 if(data.status)
					    				 {
					    					  
					    					 BS.profileImageUrl = "images/profile-img.png";
							    	        	 
					    				 }
					    				 else
					    				 {   
					    					 // show primary profile image 
					    					 if(data.contentType.name == "Image")
					    					 {
					    						 BS.profileImageUrl = data.mediaUrl;

					    					 }
					    					 else
					    					 {
					    						// show primary profile video
					    						 BS.profileImageUrl = data.frameURL;
					    										    						  
					    					 }
				    		 			 }
					    				 $('#right-top-photo').attr("src",BS.profileImageUrl);
					    				 $('#main-photo').attr("src",BS.profileImageUrl);
					    	        	
					    			}
					    	     });

					       $('.page-loader').hide();
				      	
					        
//				}});
						   
							 
			//	}
			//	else {
			//		console.log("From Stream => login");
			//		BS.AppRouter.navigate("login", {trigger: true});
			//	}
				
	       }});

		    
	   },
 
	    /**
	    * New  sign up Page  
	    */
	    signup: function(token,iam,email) {
	    	

	    	console.log("registration");
	        var usermodel = new BS.UserModel();
	        BS.signupview = new BS.SignUpView({model:usermodel});
	        
	        BS.signupview.render();
	        $('body').html(BS.signupview.el);
	        

	
	    },
		  
	    /**
	     *  
	     *  New registration pages 
	     */
	    registration: function(){
	    	
			var self = this;
	    	
	    	// render top menu
	    	this.navView = new BS.NavView({ model: BS.user });
	    	$('#topheader').html(this.navView.render().el);
	    	
	    	//render middle content
	    	BS.registrationView = new BS.RegistrationView();
	    	BS.registrationView.render();
	    	$('#body-content').html(BS.registrationView.el);
	    	
	    	// for drop down box style
	    	$('.selectpicker').selectpicker();
	    	$('.selectpicker-info').selectpicker({
	           style: 'register-select'
	    	});
	    	
	    	//for tool tip
//	    	$('.location-toolip').tooltip({template:'<div class="tooltip loactionblue"><div class="tooltip-inner"></div></div>'})
//			$('.register-toolip-outer').tooltip({template:'<div class="tooltip register-right-toolip"><div class="tooltip-inner"></div></div>'})
			
			  
	    },
	
		  /**
		   * basicRegistrationViaJanRain
		   */
		  basicRegistrationViaJanRain : function(event) {
				
//				BS.user.fetch({ success:function(e) {
//					if(e.get('loggedin') == false) {  
							$("#dialog").dialog('close');
							if(localStorage["regInfo"])
							 {
								   
								   $('#school-popup').children().detach();
							       var regDetails =JSON.parse(localStorage["regInfo"]);
							       BS.mediaRegistrationView = new BS.MediaRegistrationView();
							       var student = false ,educator=false ,professional =false;
							       _.each(regDetails, function(data) {
							    	   if(data.userType.name == "Student")
							           {
							    		   student = true;
							           }
							    	   else if(data.userType.name == "Educator")
							    	   {
							    		   educator= true;
						    	   }
						    	   else if(data.userType.name == "Professional")
						    	   {
						    		   professional = true;
						    	   }
						    	   else
						    	   {
						    		   console.log("invalid User type;")
						    	   }
						    	   var datas = {
											"data" : data,
											"student":student,
											"educator" :educator,
											"professional": professional
								   }
							       BS.mediaRegistrationView.render();
							       $('#school-popup').html(BS.mediaRegistrationView.el);
							       $('#social-media-signup fieldset').html('');
							       
							       var source = $("#profile-socialmedia").html();
								   var template = Handlebars.compile(source);
								   $('#social-media-signup fieldset').html(template(datas));
								   $(".checkbox").dgStyle();
								   $(".modal select:visible").selectBox();
								   $("#social-media-signup").validate();
							       $('#school-record').hide();
								});
						 }
						else
						{
							BS.user.fetch({ success:function(e) {
								if(e.get('loggedin') == false) {  
										$('#school-popup').children().detach();
										
										BS.mediaRegistrationView = new BS.MediaRegistrationView();
										BS.mediaRegistrationView.render();
						                
										$('#school-popup').html(BS.mediaRegistrationView.el);
										localStorage["regInfo"] ='';
										$('#school-record').hide();
										$(".modal select:visible").selectBox();
										$(".checkbox").dgStyle();
										$("#social-media-signup").validate();
						 
										var datas = BS.JsonFromSocialSite;
						 
											if(localStorage["first-name"])
												$('#first-name').val(localStorage["first-name"]);
											if(localStorage["last-name"] != "")
											    $('#last-name').val(localStorage["last-name"]);
											if(localStorage["location"])
												$('#location').val(localStorage["location"]);
											if(localStorage["providerName"] != "LinkedIn" && localStorage["providerName"] != "Google")
											{
												if(localStorage["preferredUsername"])
													$('#alias').val(localStorage["preferredUsername"]);
											}
											
									}
								else {
									
									console.log("From Stream => login");
									BS.AppRouter.navigate("login", {trigger: true});
								}
						     }});
								
						}

//					}
//					else {
//						console.log("From Stream => login");
//						BS.AppRouter.navigate("login", {trigger: true});
//					}
				
//		      }});
 
			},

			/**
			 * for email verification
			 */
			emailVerification : function() {
				var self = this;
			    BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == false) {  
						$("#dialog").dialog('close');
						localStorage["idLogin"]= '';
						$('#school-popup').children().detach();
						
						
						BS.emailView = new BS.verifyEmailView();
						BS.emailView.render();
						
						localStorage["idLogin"] = "register";
						$('#school-popup').html(BS.emailView.el);
//						$('#load-janRain').css("display","block");
						$(".modal select:visible").selectBox();
						$(".checkbox").dgStyle();
						 
						$('.forgot-pass').hide();
						$("#email-verify").validate();
						 
						$('.janrainContent').remove();
						
						/* disaplay janRain component */
						showJanrainSigninWidget();
//					 	 $('#load-janRain').css("display","none");
				    
					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});								
			},

			/**
			 *  NEW THEME - display class stream screen
			 */
			classStream : function() {
				
				BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  
                        
//							$("#dialog").dialog('close');
//							$('#school-popup').children().detach();
						BS.classStreamView = new BS.ClassStreamView();
						BS.classStreamView.render();
						$('#beam-popups').html(BS.classStreamView.el);
						$('#class-stream-popup').modal('show');
//							$("#dialog" ).dialog('close');
//			                $('#for-new-school').hide();
						/* get all schoolIds under a class */
//							$.ajax({
//								type : 'GET',
//								url : BS.schoolJson,
//								dataType : "json",
//								success : function(datas) {
//	
//									var sSelect = '<select id="schools" class="small selectBox">';
//									_.each(datas, function(data) {
//										sSelect += '<option value ="' + data.assosiatedSchoolId.id
//												+ '" > ' + data.schoolName
//												+ '</option>';
//									});
//									sSelect += '</select>';
//	//								sSelect += '<option value ="add-school" > Add School</option></select>';
//									$('#sShool').html(sSelect);
//									$(".modal select:visible").selectBox();
//								}
//							});
//								
//							$(".radio").dgStyle();
//							$(".modal select:visible").selectBox();
//							$('.modal .datepicker').datepicker();
				
					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
					
	            }});		
		    },


			/**
			 * display Files & Media page
			 */
			// TODO
			filesMedia : function() {
				 var self = this;
				 BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  

		//				$("#dialog").dialog('close');
		//				$('#body-content').children().detach();
		//				$('#school-popup').children().detach();
						
				
						// $('#right-photo').attr("src",BS.profileImageUrl);
//							 BS.user.fetch({ success:function(e) {
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('#topheader').html(this.navView.render().el);
							   $('li a.active').removeClass('active');
							   $('#menu-browsemedia').addClass('active');
							   $('#right-top-photo').attr("src",BS.profileImageUrl);
					       
//							 }});
						 
						BS.filesMediaView = new BS.FilesMediaView({
							model : BS.user
						});
		                                
						BS.filesMediaView.render();
						$('#body-content').html(BS.filesMediaView.el);
                                                
                                                BS.uploadmediaview =new BS.UploadmediaView({});
                                                BS.uploadmediaview.render();
                                                $('#upload_media').html(BS.uploadmediaview.el);
						
						self.getAllClasses();
						
						 $('.selectpicker').selectpicker();

					        $('.selectpicker-info').selectpicker({
					          style: 'btn-success'
					        });
						
						
						//get profile videos
		//				var profileView = new BS.ProfileView();
//					     	profileView.getProfileVideos();
//					     	var type = "files";
//					     	profileView.getProfileImages(type);
		//				$('.file-type').hide();
		//				$(".checkbox").dgStyle();
		                      
						
						// Call common Shuffling function         
		                shufflingOnSorting(); 
                                
					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
                         

			},
			
			/**
			 * NEW THEME - get all classes 
			 */
			getAllClasses: function(){
				/* get all streams  */
				 $.ajax({
						type : 'GET',
						url : BS.allStreamsForAUser,
						dataType : "json",
						success : function(datas) {
							 
							 var myClasses = '';
							 var classStreams ='';
							 _.each(datas, function(data) {
								 
								 myClasses+= '<li><a id ="'+data._1.id.id+'" href="#">'+data._1.streamName+'</a></li>';
								    
							 });
							 myClasses+= '<li><a href="#">Degree Program</a></li>'
								 			+'<li><a href="#">My Graduating Year </a></li>'
								 			+'<li><a href="#">My School</a></li>'
								 			+'<li><a href="#">All Classes & Schools</a></li>' 
                                                                                            +'<li><a href="#">Public</a></li>'; 
							 
							 $('#by-class-list').html(myClasses);
						}
				 });
			},
			
			/**
			 * settings page
		     */
			settings : function(){
				var self = this;
				BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  
						 
						$("#dialog").dialog('close');
						$('#content').children().detach();
						$('#school-popup').children().detach();
						
		                 
//							 BS.user.fetch({ success:function(e) {
						   
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('.nav-collapse').html(this.navView.render().el);
							   $('nav li.active').removeClass('active');
							   
							   $('#right-top-photo').attr("src",BS.profileImageUrl);
					       
//							 }});
		//				 if(!BS.settingsView)
		//				 {
							 BS.settingsView = new BS.SettingsView();
							 BS.settingsView.render();
		//				 }
						 BS.settingsView.getStreams();
						 $('#content').html(BS.settingsView.el);
				 
					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
				 
			},
                        
                       /**
			* display Google docs list in another view
			*/
            googleDocs : function(){
            	
            	var self= this;
            	BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  
            	
		                  $('#body-content').children().detach();
		                  console.log("befor nav View");
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('#topheader').html(this.navView.render().el);
							   $('li a.active').removeClass('active');
							   $('#menu-browsemedia').addClass('active');					   
							   $('#right-top-photo').attr("src",BS.profileImageUrl);			       					                                 
		                    BS.googledocsview = new BS.GoogleDocsView({});
		                   BS.googledocsview.render();  
		                   $('#body-content').html(BS.googledocsview.el);
                                    BS.uploadmediaview =new BS.UploadmediaView({});
                                    BS.uploadmediaview.render();
                                    $('#upload_media').html(BS.uploadmediaview.el);
		                   self.getAllClasses();
		   //                $('.file-type').hide();
		      //           BS.googledocsview.test();
		//				   $(".checkbox").dgStyle();                                
                    
					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
             },

            /**
			* display docs list in another view
			*/       
             docsFromComputer : function(){
            	 
            	 var self=this;
            	 BS.user.fetch({ success:function(e) {
 					if(e.get('loggedin') == true) {  
 						
	                  $('#body-content').children().detach();
						   //get main menu
						   this.navView = new BS.NavView({ model: BS.user });
						   this.navView.showProfilePic();
						   $('#topheader').html(this.navView.render().el);
						   $('li a.active').removeClass('active');
						   $('#menu-browsemedia').addClass('active');					   
						   $('#right-top-photo').attr("src",BS.profileImageUrl);			       			
	                  BS.doclistview = new BS.DocListView();
	                  BS.doclistview.render();
	                  $('#body-content').html(BS.doclistview.el);
                        BS.uploadmediaview =new BS.UploadmediaView({});
                        BS.uploadmediaview.render();
                        $('#upload_media').html(BS.uploadmediaview.el);
	                  self.getAllClasses();
	//                  $('.file-type').hide();   //to hide the filetype menu
	                  
 					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
             },
             /**
             *display Images in another view
             *
             */

             imageList: function(){
            	 var self = this;
            	 BS.user.fetch({ success:function(e) {
  					if(e.get('loggedin') == true) {  
  						
	                   $('#body-content').children().detach();
                            $('#upload_media').children().detach();
						   //get main menu
						   this.navView = new BS.NavView({ model: BS.user });
						   this.navView.showProfilePic();
						   $('#topheader').html(this.navView.render().el);
						   $('li a.active').removeClass('active');
						   $('#menu-browsemedia').addClass('active');					   
						   $('#right-top-photo').attr("src",BS.profileImageUrl);			        
	                   BS.imagelistview = new BS.ImageListView({})
	                   BS.imagelistview.render();  
	                   $('#body-content').html(BS.imagelistview.el); 
                            BS.uploadmediaview =new BS.UploadmediaView({});
                            BS.uploadmediaview.render();
                            $('#upload_media').html(BS.uploadmediaview.el);
                           
	                   self.getAllClasses();
	                   
	//                   $('.file-type').hide();   //to hide the filetype menu
	             
  					}
					else {
		//				console.log("From Stream => login");
		//				BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
             }, 
                        
             /*
             *display Videos in another view
             *
             */
             videoList :function(){
            	 
            	 var self=this;
            	 BS.user.fetch({ success:function(e) {
   					if(e.get('loggedin') == true) {    						
		                 $('#body-content').children().detach();                 
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('#topheader').html(this.navView.render().el);
							   $('li a.active').removeClass('active');
							   $('#menu-browsemedia').addClass('active');					   
							   $('#right-top-photo').attr("src",BS.profileImageUrl);			       						
		                 BS.videolistview = new BS.VideoListView();
		                 BS.videolistview.render();
		                 $('#body-content').html(BS.videolistview.el); 
                                BS.uploadmediaview =new BS.UploadmediaView({});
                                BS.uploadmediaview.render();
                                $('#upload_media').html(BS.uploadmediaview.el);
		                 self.getAllClasses();
	//	                 $('.file-type').hide();   //to hide the filetype menu
   					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
             },
                        
             /*
             *display Audios in another view
             *
             */
             audioList:function(){
            	 
            	 var self= this;
            	 BS.user.fetch({ success:function(e) {
    					if(e.get('loggedin') == true) {  
			                 $('#body-content').children().detach();
			                 console.log("audioList");
								   //get main menu
								   this.navView = new BS.NavView({ model: BS.user });
								   this.navView.showProfilePic();
								   $('#topheader').html(this.navView.render().el);
								   $('li a.active').removeClass('active');
								   $('#menu-browsemedia').addClass('active');					   
								   $('#right-top-photo').attr("src",BS.profileImageUrl);			       
			                 BS.audiolistview=new BS.AudioListView();
			                 BS.audiolistview.render();
			                 $('#body-content').html(BS.audiolistview.el); 
                                        BS.uploadmediaview =new BS.UploadmediaView({});
                                        BS.uploadmediaview.render();
                                        $('#upload_media').html(BS.uploadmediaview.el);
			                 self.getAllClasses();
	//		                 $('.file-type').hide();   //to hide the filetype menu
    					}
    					else {
    						console.log("From Stream => login");
    						BS.AppRouter.navigate("login", {trigger: true});
    					}
    				
    	           }});	
               },
                        
	            /*
	             *display presentation in another view
	             *
	             */
                presentationList:function(){
                	
                	var self=this;
                	BS.user.fetch({ success:function(e) {
     					if(e.get('loggedin') == true) { 
     						
		                    $('#body-content').children().detach();
		                    console.log("presentationList");   
								   //get main menu
								   this.navView = new BS.NavView({ model: BS.user });
								   this.navView.showProfilePic();
								   $('#topheader').html(this.navView.render().el);
								   $('li a.active').removeClass('active');
								   $('#menu-browsemedia').addClass('active');					   
								   $('#right-top-photo').attr("src",BS.profileImageUrl);			       
		                    BS.presentationview =new BS.PresentationView();
		                    BS.presentationview.render();
		                    $('#body-content').html(BS.presentationview.el); 
                                    BS.uploadmediaview =new BS.UploadmediaView({});
                                    BS.uploadmediaview.render();
                                    $('#upload_media').html(BS.uploadmediaview.el);
		                    self.getAllClasses();
	//	                    $('.file-type').hide();   //to hide the filetype menu
     					}
    					else {
    						console.log("From Stream => login");
    						BS.AppRouter.navigate("login", {trigger: true});
    					}
    				
    	           }});	
                },
                        
                /*
                 *display presentation in another view
                 *
                 */
                pdflistview: function(){
                	
                	var self =this;
                	BS.user.fetch({ success:function(e) {
     					if(e.get('loggedin') == true) { 
		                     $('#body-content').children().detach();
		                     console.log("presentationList"); 
								   //get main menu
								   this.navView = new BS.NavView({ model: BS.user });
								   this.navView.showProfilePic();
								   $('#topheader').html(this.navView.render().el);
								   $('li a.active').removeClass('active');
								   $('#menu-browsemedia').addClass('active');					   
								   $('#right-top-photo').attr("src",BS.profileImageUrl);			       
		               
		                    BS.pdflistview =new BS.PdfListView();
		                    BS.pdflistview.render();
		                    $('#body-content').html(BS.pdflistview.el); 
                                    BS.uploadmediaview =new BS.UploadmediaView({});
                                    BS.uploadmediaview.render();
                                    $('#upload_media').html(BS.uploadmediaview.el);
		                    self.getAllClasses();
	//	                    $('.file-type').hide();   //to hide the filetype menu
     					}
    					else {
    						console.log("From Stream => login");
    						BS.AppRouter.navigate("login", {trigger: true});
    					}
    				
    	           }});	
              }
	                
			});
