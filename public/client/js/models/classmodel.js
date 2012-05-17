window.Class = Backbone.Model.extend({
	
	
        defaults: {
        	
        	id:null,
            classCode:null,
            classTime:null,
            className:null,
            startDate:null,
            semster:null

        },
        
});

window.ClassCollection = Backbone.Collection.extend({

    model:Class, 
	
});