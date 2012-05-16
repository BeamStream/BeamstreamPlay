 window.School = Backbone.Model.extend({
     
        defaults: {
        	schoolId: null,
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

});    

 
