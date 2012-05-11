window.ClassView = Backbone.View.extend({

	events: {
	      "click #save": "saveclass",
	      "click #continue": "toprofile",
	      "click #addclass" : "addschool",
	      "change #school": "addschoolfield",
	      "click #add-school": "addclassinfo"
	 },
	
    initialize:function () {
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
     
     /* “ADD CLASS OR SCHOOL” button clicked -  school's section shows up */
     addschool:function (eventName) {
    	 eventName.preventDefault();
    	 $('#addclass').hide();
    	 var template = _.template( $("#add_class_or_school").html());
    	 $('#class-form').append(template)
     },
    
     
     /* add school field when select school as "Different" */
     
     addschoolfield:function (eventName) {
    	var selected = $("#school option:selected").val();
         
        if(selected == "diff")
        {
        	$('#add-schoolname').show();
        	var template1 = _.template( $("#tpl_add_schoolname").html());
        	$('#add-schoolname').html(template1);
        }
        else if(selected == "same")
        {
        	$('#add-schoolname').hide();
        }
    	
     },
     
     
     /* add class details */
     addclassinfo:function (eventName) {
    	 alert(435);
    	 eventName.preventDefault();
    	 

     },
    

});