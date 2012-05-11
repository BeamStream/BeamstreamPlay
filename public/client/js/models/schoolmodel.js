 window.School = Backbone.Model.extend({
     
        defaults: {
            schoolName :null,
            major:null,
            year:null,
            degreeExpected:null,
            degree:null,
        }
        
        
});

window.SchoolCollection = Backbone.Collection.extend({

    model:School, 

});    

 

