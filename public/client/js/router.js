
BS.AppRouter = Backbone.Router.extend({

    routes:{
    	
        "":"home",
        "login":"login",
        "recoverAccount" : "recoverAccount",
        "emailVerification": "emailVerification",
        "school":"schoolReg",
        "editschool":"editSchool",
        "class":"classReg",
        "editclass":"editClass",
        "profile":"profileReg",
        "streams":"mainStream",
        "basicRegistration/token/:token/iam/:iam/emailId/:email":"basicRegistration",
        "basicRegistration":"basicRegistrationViaJanRain",
        "classStream":"classStream",
        "projectStream" : "projectStream",
        "studyStream": "studyStream",
        "groupStream": "groupStream",
        "peerStream" : "peerStream",
        "friendStream" :"friendStream",
        "filesMedia" : "filesMedia",
        "googledocs" : "googleDocs",
        "docs" : "docsFromComputer", 
        "imagelist" : "imageList",
        "videos" : "videoList",
        "audioview": "audioList",
        "presentationview": "presentationList",
        "pdflistview":"pdflistview",
        "settings" : "settings"
//        "profile/view/id/:id/name/:name" : "publicProfile"

    },
    
    initialize :function() {
    	
  		BS.user = new BS.SingleUser();
    	BS.user.authenticate();
		console.log("Success Testing");
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
		//			$("#school-name-1").attr("disabled", "disabled"); 
					
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
     * Edit school information
     */
    editSchool:function(){
        console.log("edit school");
         localStorage["schoolInfo"] = ''; 
			         BS.editschoolview = new BS.EditSchoolView();
			         BS.editschoolview.render();
			         
			         $('#school-popup').html(BS.editschoolview.el);
			         
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
                                    
                                    $(".modal select:visible").selectBox();
                                    $("#school-form").validate();
			         
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
						 console.log("c_schoolId" + c_schoolId);
						 //selected the schoolName from list
						 $('#school-'+sClasses+' option[value="'+c_schoolId+'"]').attr('selected', 'selected');
						 var schoolName = $('#school-'+sClasses+' option[value="'+c_schoolId+'"]').val();
						 console.log("schoolName -- " + schoolName);
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
		//           if (!BS.classView) {
			           BS.classView = new BS.ClassView();
			           BS.classView.render();
		//           }
		           
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
  
    editClass: function(){
    
        console.log("edit class");
    		    		
        $('#school-popup').children().detach(); 
//           if (!BS.classView) {
        BS.editclassview = new BS.EditClassView();
        BS.editclassview.render();
//           }

        $('#school-popup').html(BS.editclassview.el);
        $(".modal select:visible").selectBox();
        $('.modal .datepicker').datepicker();
        $("#class-form").validate();

    },
   /**
    * display Profile Info screen
    */
   profileReg:function () {
	 
	   BS.user.fetch({ success:function(e) {
		   if(e.get('loggedin') == true) {  
	     
			   $("#dialog").dialog('close');
		       BS.profileView = new BS.ProfileView();
		       BS.profileView.render();
		       $('#school-popup').html(BS.profileView.el); 
		       
		       // initial call to image resize function  
		//       BS.profileView.resize(self,95,90 ,document.getElementById("profile-image"),document.getElementById("img"));
		       
		       //set mobile number format  -validation 
		       $("#mobile").mask("(999) 999-9999",{placeholder:"  "});
		       
		       $('.progress-container').hide();
		       $(".modal select:visible").selectBox();
		       $(".radio").dgStyle();
		        
		       $('.modal .datepicker').datepicker();
		       $("#profile-form").validate();
		       
		       //Render Janrain Invite model
           showJanrainShareWidget();
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
    	  
			if(e.get('loggedin') == true) {	
	   
	   
				   $("#dialog").dialog('close');
				   BS.mainImageUrl = $('#right-photo').attr('src');
				  
				   $('#middle-content').children().detach();
				   $('nav li.active').removeClass('active');
				   $('nav li a#streamsGroups').parents('li').addClass('active');
				  
				  
			           
					   $('#school-popup').children().detach(); 
					   $('#content').children().detach();
					   
					   $('.modal').css('display','none');
					   BS.user.fetch({ success:function(e) {
						  
						   //store logged user details
					       BS.loggedUserInfo  = e;
					       localStorage["loggedUserInfo"] = e.attributes.id.id;
					       
						   BS.streamView = new BS.StreamView({ model: BS.user });
						   BS.streamView.render();
						   BS.schoolBack = false;
						   BS.regBack = false;
						   BS.classBack = false;
						   self.onstream = true; 
						   localStorage["regInfo"] ='';
					       localStorage["schoolInfo"] ='';
					       localStorage["classInfo"] ='';
					       localStorage["schoolFromPrev"] = '';
					       localStorage["newSchoolId"] = '';
			          	   localStorage["newSchool"] ='';
					       
					       localStorage["editSchool"] = "true";
					       localStorage["editClass"] = "true";
					       localStorage["editProfile"] = "true";
				   	   
						   //get main menu
						   this.navView = new BS.NavView({ model: BS.user });
						    
						   $('.nav-collapse').html(this.navView.render().el);
						   $('nav li.active').removeClass('active');
						   $('#streamsGroups').addClass('active');
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
					    					  
					    					 BS.profileImageUrl = "images/unknown.jpeg";
							    	        	 
					    				 }
					    				 else
					    				 {   
					    					 // show primary profile image 
					    					 if(data.contentType.name == "Image")
					    					 {
					    						 BS.profileImageUrl = data.mediaUrl;
					    						  
			                                     BS.primaryImage = data.mediaUrl;
			                                     BS.primaryVideo = '';
			                                     
					    						 var primaryImage = '<div class="gallery clearfix"><div class="gallery clearfix">'
					    							                 +'<a href="'+data.mediaUrl+'" rel="prettyPhoto"  ><img class="p-profile" src="'+data.mediaUrl+'"  width="100%" height="100%"  /></a></div>';
					    						 $('#profile-images').html(primaryImage);
					    					 }
					    					 else
					    					 {
					    						// show primary profile video
					    						 BS.profileImageUrl = data.frameURL;
					    						 
					    						 BS.primaryVideo = data.frameURL;
					    						 BS.primaryImage = '';
					    						 
					    						 var primaryProfile = '<div class="gallery clearfix">'
					    							                  +'</div><div class="gallery clearfix">'
					    							                  +'<a  rel="prettyPhoto" href="'+data.mediaUrl+'">'
					    							                  +'<img class="p-profile" src="'+data.frameURL+'" width="100%" height="100%" /></a></div>';
					    						 $('#profile-images').html(primaryProfile);
					    						  
					    					 }
					    					 
					    					 $("area[rel^='prettyPhoto']").prettyPhoto();
				    		 				 $(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'normal',theme:'light_square',slideshow:3000, autoplay_slideshow: true});
				    		 				 $(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
				    		 					    				 }
					    				 $('#main-photo').attr("src",BS.profileImageUrl);
						    	         $('#right-photo').attr("src",BS.profileImageUrl);
						    	         $('#msg-photo').attr("src",BS.profileImageUrl);
					    	        	
					    			}
					    	   });
					          
					          // list all schools under profile pic
					          $.ajax({
					   			url : BS.schoolJson,
					   			dataType : "json",
					   			success : function(datas) {
					   				  var mySchools = '';
					   				  
						   			 _.each(datas, function(data) {
			//			   				 mySchools+= data.schoolName+' ,';
						   				mySchools+='<li>'+data.schoolName+'</i></li>'; 
									 });
						   			 var orgName = mySchools.substring(0, mySchools.length - 1);
			
						   			$('#myschool-list').html(mySchools);
					   			 }
					   		    });
					          
					    
				   	   $('.modal-backdrop').hide();
				       $('#content').html(BS.streamView.el);
				      
				       $('.page-loader').hide();
			      	
				       $(".checkbox").dgStyle();
				        
				       $('.with-tooltips a, .with-tooltip').each(function() {
				           var $this = $(this);
				           var placement = $this.parent().hasClass('tooltips-bottom') ? 'bottom' : 'top';
				           $(this).tooltip({placement: placement});
				       });
			//            // slider for streamlist at home view (with timer),up and down scrolling button in template 
			//            setTimeout(function() {
			//	       $("#streams-list").mb_vSlider({easing:"swing",slideTimer:1000,nextEl:".vSdown",prevEl:".vSup ",height:200,width:160});
			//                                              
			//           }, 500);                  
			               
				        
					 }});
					   
					   
						 
			}
			else {
				console.log("From Stream => login");
				BS.AppRouter.navigate("login", {trigger: true});
			}
			
       }});
  
	    
   },
   
  
    /**
    * registration after email verification
    */
    basicRegistration: function(token,iam,email) {
//	    BS.user.fetch({ success:function(e) {
//		  	   if(e.get('loggedin') == false) {  
			       $("#dialog").dialog('close');  
			       BS.token = token;
			       BS.iam = iam;
			       BS.email = email;
			       if(localStorage["regInfo"])
				   {
					  
				       var regDetails =JSON.parse(localStorage["regInfo"]);
				       BS.registrationView = new BS.RegistrationView();
				       
				       _.each(regDetails, function(data) {
				    	   
				    	   var datas = {
									"data" : data
						   }
					       BS.registrationView.render(datas);
					       $('#school-popup').html(BS.registrationView.el);
					       $('#registration-form fieldset').html('');
					       
					       var source = $("#basic-profile").html();
						   var template = Handlebars.compile(source);
						   $('#registration-form fieldset').html(template(datas));
						   $(".checkbox").dgStyle();
			//		       $("#registration-form").validate();
					       $("#registration-form").validate({
									rules: {
										password1: "required",
										password_again: {
									      equalTo: "#password1"
									    }
									  }
								});
						  
						});
				
				   }
			       else
			       {
			    	   
			    	   BS.user.fetch({ success:function(e) {
							if(e.get('loggedin') == false) {  
			        	// verify the token
					  		   $.ajax({
					  				type : 'POST',
					  				url : BS.verifyToken,
					  				data : {
					  					token : token
					  	                 },
					  				dataType : "json",
					  				success : function(data) {
					  						if (data.status == "Success") {
					  	
					//  							if (!BS.registrationView) {
					  								BS.registrationView = new BS.RegistrationView();
					  								var mailInfo = {
					  										iam : iam,
					  										mail : email
					  								};
					  								BS.registrationView.render(mailInfo);
					//  							}
					  	
					  							$('#school-popup').html(BS.registrationView.el);
					  							localStorage["regInfo"] ='';
					  							$('#jan-iam').hide();
					  							$(".checkbox").dgStyle();
					//  							$("#registration-form").validate();
					  							 $("#registration-form").validate({
					  								rules: {
					  									password1: "required",
					  									password_again: {
					  								      equalTo: "#password1"
					  								    }
					  								  }
					  							});
					  					     }
					  						 else 
					  						 {
					  							alert("Token Expiredd");
					  						  }
					  	
					  					}
					  				});
							}
							else {
								console.log("From Stream => login");
								BS.AppRouter.navigate("login", {trigger: true});
							}
						
				      }});
					  		   
			         }
//		  	    }
//				else {
//					console.log("From Stream => login");
//					BS.AppRouter.navigate("login", {trigger: true});
//				}
//			
//	      }});
	       

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
										
					//					if (!BS.mediaRegistrationView) {
											BS.mediaRegistrationView = new BS.MediaRegistrationView();
											BS.mediaRegistrationView.render();
					//					}
						                
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
//					  $('#load-janRain').css("display","none");
				    
					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});								
			},

			/**
			 * display class stream screen
			 */
			classStream : function() {
				
				 BS.user.fetch({ success:function(e) {
						if(e.get('loggedin') == true) {  
 
							$("#dialog").dialog('close');
							$('#school-popup').children().detach();
							BS.classStreamView = new BS.ClassStreamView();
							BS.classStreamView.render();
							$('#school-popup').html(BS.classStreamView.el);
							$("#dialog" ).dialog('close');
			                $('#for-new-school').hide();
							/* get all schoolIds under a class */
							$
									.ajax({
										type : 'GET',
										url : BS.schoolJson,
										dataType : "json",
										success : function(datas) {
			
											var sSelect = '<select id="schools" class="small selectBox">';
											_.each(datas, function(data) {
												sSelect += '<option value ="' + data.assosiatedSchoolId.id
														+ '" > ' + data.schoolName
														+ '</option>';
											});
											sSelect += '</select>';
			//								sSelect += '<option value ="add-school" > Add School</option></select>';
											$('#sShool').html(sSelect);
											$(".modal select:visible").selectBox();
										}
									});
			
							
							$(".radio").dgStyle();
							$(".modal select:visible").selectBox();
							$('.modal .datepicker').datepicker();
				
						}
						else {
							console.log("From Stream => login");
							BS.AppRouter.navigate("login", {trigger: true});
						}
					
		           }});		
			},

			/**
			 * display project stream screen
			 */
			projectStream : function() {
				$("#dialog").dialog('close');
				if (!BS.projectStreamView) {
					BS.projectStreamView = new BS.ProjectStreamView();
					BS.projectStreamView.render();
				}
				$('#school-popup').html(BS.projectStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display study stream screen
			 */
			studyStream : function() {
				$("#dialog").dialog('close');
				if (!BS.studyStreamView) {
					BS.studyStreamView = new BS.StudyStreamView();
					BS.studyStreamView.render();
				}
				$('#school-popup').html(BS.studyStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();

			},

			/**
			 * display group stream screen
			 */
			groupStream : function() {
				$("#dialog").dialog('close');
				if (!BS.groupStreamView) {
					BS.groupStreamView = new BS.GroupStreamView();
					BS.groupStreamView.render();
				}
				$('#school-popup').html(BS.groupStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();

			},

			/**
			 * display peer stream screen
			 */
			peerStream : function() {
				$("#dialog").dialog('close');
				if (!BS.peerStreamView) {
					BS.peerStreamView = new BS.PeerStreamView();
					BS.peerStreamView.render();
				}
				$('#school-popup').html(BS.peerStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display friend stream screen
			 */
			friendStream : function() {
				$("#dialog").dialog('close');
				if (!BS.friendStreamView) {
					BS.friendStreamView = new BS.FriendStreamView();
					BS.friendStreamView.render();
				}

				$('#school-popup').html(BS.friendStreamView.el);
				$(".radio").dgStyle();
				$(".modal select:visible").selectBox();
				$('.modal .datepicker').datepicker();
			},

			/**
			 * display Files & Media page
			 */
			// TODO
			filesMedia : function() {
				 var self = this;
				 BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  

						$("#dialog").dialog('close');
						$('#content').children().detach();
						$('#school-popup').children().detach();
						
						
						// $('#right-photo').attr("src",BS.profileImageUrl);
						 BS.user.fetch({ success:function(e) {
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('.nav-collapse').html(this.navView.render().el);
							   $('nav li.active').removeClass('active');
							   $('#file-media').addClass('active');
							   $('#right-photo').attr("src",BS.profileImageUrl);
					       
						 }});
						 
						BS.filesMediaView = new BS.FilesMediaView({
							model : BS.user
						});
		                                
						BS.filesMediaView.render();
						$('#content').html(BS.filesMediaView.el);
						
						//get profile videos
						var profileView = new BS.ProfileView();
		//		     	profileView.getProfileVideos();
		//		     	var type = "files";
		//		     	profileView.getProfileImages(type);
						$('.file-type').hide();
						$(".checkbox").dgStyle();
		                      
						
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
			 * settings page
		     */
			settings : function(){
				var self = this;
				BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  
						 
						$("#dialog").dialog('close');
						$('#content').children().detach();
						$('#school-popup').children().detach();
						
		                 
						 BS.user.fetch({ success:function(e) {
						   
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('.nav-collapse').html(this.navView.render().el);
							   $('nav li.active').removeClass('active');
							   
							   $('#right-photo').attr("src",BS.profileImageUrl);
					       
						 }});
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

            	BS.user.fetch({ success:function(e) {
					if(e.get('loggedin') == true) {  
            	
		                  $('#content').children().detach();
		                  console.log("befor nav View");
		                  BS.user.fetch({ success:function(e){
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('.nav-collapse').html(this.navView.render().el);
							   $('nav li.active').removeClass('active');
							   $('#file-media').addClass('active');					   
							   $('#right-photo').attr("src",BS.profileImageUrl);			       
					       }});                             
		                    BS.googledocsview = new BS.GoogleDocsView({
		                         model : BS.user
						   });
		                   BS.googledocsview.render();  
		                   $('#content').html(BS.googledocsview.el);
		                   $('.file-type').hide();
		  //               BS.googledocsview.test();
						   $(".checkbox").dgStyle();                                
		                   // instantiate the shuffle plugin
		                   $('#grid').shuffle({
		                         itemWidth : 200,
		                         marginTop : 15,
		                         marginRight: 20,
		                         key : 'all',
		                         speed : 800,
		                         easing : 'ease-out'
		                    });                               
		                    // Set up button clicks
		                    $('.filter-options li').on('click', function() {
		                         var $this = $(this),
		                         $grid = $('#grid');
		                         // Hide current label, show current label in title
		                         $('.filter-options .active').removeClass('active');
		                         $this.addClass('active');
			                     // Filter elements
			                     $grid.shuffle($this.attr('data-key'));
		                    });     
                    
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
            	 BS.user.fetch({ success:function(e) {
 					if(e.get('loggedin') == true) {  
 						
	                  $('#content').children().detach();
	                  console.log("befor nav View");
	                  BS.user.fetch({ success:function(e){
						   //get main menu
						   this.navView = new BS.NavView({ model: BS.user });
						   this.navView.showProfilePic();
						   $('.nav-collapse').html(this.navView.render().el);
						   $('nav li.active').removeClass('active');
						   $('#file-media').addClass('active');					   
						   $('#right-photo').attr("src",BS.profileImageUrl);			       
				       }}); 
	                  BS.doclistview = new BS.DocListView();
	                  BS.doclistview.render();
	                  $('#content').html(BS.doclistview.el); 
	                  $('.file-type').hide();   //to hide the filetype menu
	                  
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
            	 
            	 BS.user.fetch({ success:function(e) {
  					if(e.get('loggedin') == true) {  
  						
	                   $('#content').children().detach();
	                   BS.user.fetch({ success:function(e){
						   //get main menu
						   this.navView = new BS.NavView({ model: BS.user });
						   this.navView.showProfilePic();
						   $('.nav-collapse').html(this.navView.render().el);
						   $('nav li.active').removeClass('active');
						   $('#file-media').addClass('active');					   
						   $('#right-photo').attr("src",BS.profileImageUrl);			       
	                   }});   
	                   BS.imagelistview = new BS.ImageListView({})
	                   BS.imagelistview.render();  
	                   $('#content').html(BS.imagelistview.el); 
	                   $('.file-type').hide();   //to hide the filetype menu
	             
  					}
					else {
						console.log("From Stream => login");
						BS.AppRouter.navigate("login", {trigger: true});
					}
				
	           }});		
             }, 
                        
             /*
             *display Videos in another view
             *
             */
             videoList :function(){
            	 
            	 BS.user.fetch({ success:function(e) {
   					if(e.get('loggedin') == true) {  
   						
		                 $('#content').children().detach();                 
		                 BS.user.fetch({ success:function(e){
							   //get main menu
							   this.navView = new BS.NavView({ model: BS.user });
							   this.navView.showProfilePic();
							   $('.nav-collapse').html(this.navView.render().el);
							   $('nav li.active').removeClass('active');
							   $('#file-media').addClass('active');					   
							   $('#right-photo').attr("src",BS.profileImageUrl);			       
						 }});
		                 BS.videolistview = new BS.VideoListView();
		                 BS.videolistview.render();
		                 $('#content').html(BS.videolistview.el); 
		                 $('.file-type').hide();   //to hide the filetype menu
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
            	 BS.user.fetch({ success:function(e) {
    					if(e.get('loggedin') == true) {  
			                 $('#content').children().detach();
			                 console.log("audioList");
			                 BS.user.fetch({ success:function(e){
								   //get main menu
								   this.navView = new BS.NavView({ model: BS.user });
								   this.navView.showProfilePic();
								   $('.nav-collapse').html(this.navView.render().el);
								   $('nav li.active').removeClass('active');
								   $('#file-media').addClass('active');					   
								   $('#right-photo').attr("src",BS.profileImageUrl);			       
							 }});
			                 BS.audiolistview=new BS.AudioListView();
			                 BS.audiolistview.render();
			                 $('#content').html(BS.audiolistview.el); 
			                 $('.file-type').hide();   //to hide the filetype menu
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
                	BS.user.fetch({ success:function(e) {
     					if(e.get('loggedin') == true) { 
     						
		                    $('#content').children().detach();
		                    console.log("presentationList");   
		                    BS.user.fetch({ success:function(e){
								   //get main menu
								   this.navView = new BS.NavView({ model: BS.user });
								   this.navView.showProfilePic();
								   $('.nav-collapse').html(this.navView.render().el);
								   $('nav li.active').removeClass('active');
								   $('#file-media').addClass('active');					   
								   $('#right-photo').attr("src",BS.profileImageUrl);			       
						    }});
		                    BS.presentationview =new BS.PresentationView();
		                    BS.presentationview.render();
		                    $('#content').html(BS.presentationview.el); 
		                    $('.file-type').hide();   //to hide the filetype menu
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
                	BS.user.fetch({ success:function(e) {
     					if(e.get('loggedin') == true) { 
		                     $('#content').children().detach();
		                     console.log("presentationList"); 
		                     BS.user.fetch({ success:function(e){
								   //get main menu
								   this.navView = new BS.NavView({ model: BS.user });
								   this.navView.showProfilePic();
								   $('.nav-collapse').html(this.navView.render().el);
								   $('nav li.active').removeClass('active');
								   $('#file-media').addClass('active');					   
								   $('#right-photo').attr("src",BS.profileImageUrl);			       
		                     }});  
		                    BS.pdflistview =new BS.PdfListView();
		                    BS.pdflistview.render();
		                    $('#content').html(BS.pdflistview.el); 
		                    $('.file-type').hide();   //to hide the filetype menu
     					}
    					else {
    						console.log("From Stream => login");
    						BS.AppRouter.navigate("login", {trigger: true});
    					}
    				
    	           }});	
              },

			/**
			 * public profile view
			 */
			
			publicProfile :function(userId ,userName){
				console.log("userId" + userId);
				console.log("userName" + userName);
			}
		});
