BS.Class = Backbone.Model.extend({
	
	
        defaults: {
        	
        	schoolId:null,
        	id:null,
            classCode:null,
            classTime:null,
            className:null,
            startingDate:null,
            classType:null,
//            streams :null

        },
        
});

BS.ClassCollection = Backbone.Collection.extend({

    model:BS.Class, 
	
});