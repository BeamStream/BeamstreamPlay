window.Class = Backbone.Model.extend({
     
        defaults: {
        	schoolid:null,
        	classid:null,
            classcode:null,
            classtime:null,
            classname:null,
            startdate:null,
            semster:null

        },           
      url: "api.php"
});

window.ClassCollection = Backbone.Collection.extend({

    model:Class, 
	
});