window.School = Backbone.Model.extend({
     
        defaults: {
            schoolname :null,
            major:null,
            year:null,
            expedteddegree:null,
            degreeprogram:null,
        }
        
        
});

window.SchoolCollection = Backbone.Collection.extend({

    model:School, 
   url:"api.php"

});