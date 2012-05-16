window.Class = Backbone.Model.extend({
     
        defaults: {
        	
        	schoolId:null,
            classCode:null,
            classTime:null,
            className:null,
            startDate:null,
            semster:null

        }           
//      url: "api.php"
});

window.ClassCollection = Backbone.Collection.extend({

    model:Class, 
	
});