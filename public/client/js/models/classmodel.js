window.Class = Backbone.Model.extend({
	
	
        defaults: {
        	
        	schoolId:null,
        	id:null,
            classCode:null,
            classTime:null,
            className:null,
            startingDate:null,
            classType:null

        },
        
});

window.ClassCollection = Backbone.Collection.extend({

    model:Class, 
	
});