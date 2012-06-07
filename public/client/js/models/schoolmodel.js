 window.School = Backbone.Model.extend({
     
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

window.SchoolCollection = Backbone.Collection.extend({
	
    model:School,
    url: "http://localhost:9000/schoolJson"
//    url: "http://localhost/BeamstreamPlay/public/client/api.php"

});    
 

 
