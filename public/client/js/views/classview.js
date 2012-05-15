window.ClassView = Backbone.View.extend({

	events: {
	      "click #save": "saveClass",
	      "click #continue": "toProfile",
	      "click a.legend-addclass": "addSchool",
	      "click #add-class": "addClasses",
	      "change #school": "addAnotherSchool",
	 },
	
    initialize:function () {
    	
    	this.classes = new Class();  
        console.log('Initializing Class View');
        this.template= _.template($("#tpl-class-reg").html());
        
     },
     

    /**
    * save/post class info details.
    */
    saveClass:function (eventName) {
    	eventName.preventDefault();
    	var classDetails = this.getClassInfo();
        
        /* post data with school and class details */
        $.ajax({
            type: 'POST',
            url:"http://192.168.10.10/client/api.php",
            data:{data:classDetails},
            dataType:"json",
            success:function(data){
                var source   = $("#tpl-success").html();
            	var template = Handlebars.compile(source);
            	$("#success").html(template(data));
            }
         });
        
     },
      
     
     
    /**
     * render class Info screen
     */
     render:function (eventName) {
    	 $(this.el).html(this.template(this.classes.toJSON()));
         return this;
     },
     
     
    /**
     * navigate to profile screen
     */
    toProfile:function (eventName) {
    	
    	console.log("to profile");
    	eventName.preventDefault();  
    	var regDetails = this.getClassInfo();
    	app.navigate("profile", {trigger: true, replace: true});
          
    },
   
    /**
     * add another school/ class
     */
    addSchool:function (eventName) {
    	 
    	eventName.preventDefault();
      	$('a.legend-addclass').hide();
      	var template1 = _.template( $("#add_class_or_school").html());
    	$('#class-form').append(template1);
        $(".modal select:visible").selectBox();
        
        /* set School name as prevois school's name */
        $('#school-name-1').val("Previous Schoolname");
        $('#school-name-1').attr("disabled",true);

     },
     
     
     /**
      *  add classes for same school or for different school
      */
     addClasses:function (eventName) {
    	 
    	 eventName.preventDefault();
    	 var text = $('#add-class').text();
    	 if(text == "Add Class")
    	 {
    		 s1Classes++;
    		 var count = {"count":s1Classes}
         	 var source   = $("#tpl_add_classes").html();
         	 var template = Handlebars.compile(source);
         	 $("#same-school-classes").append(template(count));
    	 }
    	 else if(text == "Add School")
         {
    		 s2Classes++;
    		 var count = {"count":s2Classes}
         	 var source   = $("#tpl_add_classes").html();
        	 var template = Handlebars.compile(source);
        	 $("#diff-school-classes").append(template(count));
         }
    	 else
    	 {
    		 
    	 }
    	 
      },

      
      /**
       * to add another school when select "Different school"
       */
      addAnotherSchool:function () {
      	  
    	  var value = $('#school').val();
    	  if(value == "diff")
	      {
    		  $('#school-name-1').val("");
    		  $('#school-name-1').attr("disabled",false);
	      }
	      else if(value == "same")
	      {
	    	  
	    	  $('#school-name-1').val("Previous Schoolname");
	          $('#school-name-1').attr("disabled",true);
	      }
	      else
	      {
	    	  $('#school-name-1').val("Previous Schoolname");
	          $('#school-name-1').attr("disabled",true);
	      }
       },
       
       
       
       
       /**
        * get class details from the form
        * @return  Class details as JSON string
        */
       
       getClassInfo:function () {
    	   
	      var i;
	      var classes = new ClassCollection();
	      for(i=1; i <= s1Classes; i++)
	      {
		   		var classModel = new Class();
		   		classModel.set({classCode: $('#class-code-'+i).val(),classTime: $('#class-time-'+i).val(), className: $('#class-name-'+i).val(), startDate: $('#date-started-'+i).val(), semster:$('#semester-'+i).val()});
		   		classes.add(classModel);
	      }
	      
	      var classDetails = JSON.stringify(classes);
	      
	  	  /*  get local stored School details  */
	      var localStorageKey = "registration"; 
	 	  var data = localStorage.getItem(localStorageKey);
	 	    
	 	  var regData = jQuery.parseJSON(data);
	 	    
	 	  // add class details to local 
	 	  regData[0].classes = jQuery.parseJSON(classDetails);
	 	  
	 	  // add schoo type ,same / different school
	 	  var schoolType = $('#school').val();
	 	  var schoolName = $('#school-name-1').val();
	 	  var schoolStatus = {"status":schoolType,"name":schoolName}
	 	  regData[0].SchoolType = schoolStatus;
	 	 
	 	  var regDetails = JSON.stringify(regData);
	 	  localStorage.setItem(localStorageKey,classDetails); 
	 	    
	      return regDetails;
        },
    
 
     
});