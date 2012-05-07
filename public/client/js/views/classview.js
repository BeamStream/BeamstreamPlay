window.ClassView = Backbone.View.extend({

	events: {
	      "click #save": "saveclass",
	      "click #continue": "toprofile"
	      
	 },
	
    initialize:function () {
    	this.classes = new Class();  
        console.log('Initializing School View');
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
 	
    	console.log("to profile");
    	eventName.preventDefault();        
    	app.navigate("profile", {trigger: true, replace: true});
    	
          
    }
    

});