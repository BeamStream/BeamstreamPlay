window.Class = Backbone.Model.extend({
	
	
        defaults: {
        	
        	id:null,
        	schoolId:null,
            classCode:null,
            classTime:null,
            className:null,
            startDate:null,
            classType:null

        },
        
});

window.ClassCollection = Backbone.Collection.extend({

    model:Class, 
	
});