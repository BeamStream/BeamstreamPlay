BS.Class = Backbone.Model.extend({
	
	
        defaults: {
        	
        	schoolId:null,
        	id:null,
            classCode:null,
            classTime:null,
            className:null,
            startingDate:null,
            classType:null,
            streamId :null

        },
        
});

BS.ClassCollection = Backbone.Collection.extend({

    model:BS.Class, 
	
});