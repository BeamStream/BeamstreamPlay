 BS.School = Backbone.Model.extend({
     
	 idAttribute: "_id",
        defaults: {
        	id: null,
            schoolName: null,
            year: null,
            degreeExpected: null,
            major: null,
            degree: null,
            graduated: null,
            graduationDate: null
            
        }
        
});

 BS.SchoolCollection = Backbone.Collection.extend({
 
    model:BS.School,
    url: BS.schoolJson,
 

});    
 

 
