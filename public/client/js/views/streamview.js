window.StreamView = Backbone.View.extend({

	 events :{
		 "click #create-school" : 'createSchool',
	 },
	
    initialize:function () {
    	
        console.log('Initializing Stream View');
        this.template= _.template($("#tpl-main-stream").html());
        
    },

    render:function (eventName) {
    	
        $(this.el).html(this.template());
        return this;
    },
    
    createSchool:function (eventName) {
    	app.navigate("school", {trigger: true, replace: true});
        
    },
    
     
     
   
    
});