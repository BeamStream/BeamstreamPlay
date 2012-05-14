window.ClassView = Backbone.View.extend({

	events: {
	      "click #save": "saveclass",
	      "click #continue": "toprofile",
	      "click a.legend-addclass": "addschool",
	      "click #add-class": "addclasses",
	    	  
	      "change #school": "addanotherschool"
	      
	       
	 },
	
    initialize:function () {
    	
    	var s1Classes = 3;
        var s2Classes = 0; 
    	this.classes = new Class();  
        console.log('Initializing Class View');
        this.template= _.template($("#tpl-class-reg").html());
     },

    
    saveclass:function (eventName) {
    	
    	console.log("Saving classes");
    	var source = $("#tpl-success").html();
    	
    	this.template = Handlebars.compile(source);
    	var self = this;	
        this.classes.fetch({success:function(e) {
             self.render();
        }});
     },
      
      
     render:function (eventName) {
    	 $(this.el).html(this.template(this.classes.toJSON()));
         return this;
     },
     
    toprofile:function (eventName) {
    	
    	/* TODO set local storage */
    	localStorage['classcode'] = "class1";
    	localStorage['classtime'] = "10pm"; 
    	var localStorageKey = "notes"; 
	    localStorage.setItem(localStorageKey,localStorage);     
    	
    	/* TODO naviage to profile page */
    	console.log("to profile");
    	eventName.preventDefault();        
    	app.navigate("profile", {trigger: true, replace: true});
          
    },
     
    // add another school/ class
    addschool:function (eventName) {
    	
    	eventName.preventDefault();
      	$('a.legend-addclass').hide();
      	var template1 = _.template( $("#add_class_or_school").html());
    	$('#class-form').append(template1);
        $('#another-school').hide();
        $(".modal select:visible").selectBox();
     },
     
     /* add classes for same school or for different school */
     addclasses:function (eventName) {
    	 
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
    	 $(".modal select:visible").selectBox();
		 $('.modal .datepicker:visible').datepicker();
      },

      /* to add another school when select "Different school" */
      addanotherschool:function () {
      	  
    	  var value = $('#school').val();
    	  if(value == "diff")
	      {
		       $('#another-school').show();
		       $('#add-class').text("Add School");
	      }
	      else if(value == "same")
	      {
		       $('#another-school').hide();
		       $('#add-class').text("Add Class");
	      }
	      else
	      {
	    	   $('#another-school').hide();
	    	   $('#add-class').text("Add Class");
	      }
       },

    

});