window.Class = Backbone.Model.extend({
	
	
        defaults: {
        	
        	schoolId:null,
        	classId:null,
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