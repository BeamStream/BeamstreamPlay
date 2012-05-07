window.School = Backbone.Model.extend({
     
        defaults: {
            schoolname :null,
            major:null,
            year:null,
            exoedtedDegree:null,
            degreeProgram:null,
        },        
        url:"api.php"
});

window.SchoolCollection = Backbone.Collection.extend({

    model:School, 
	

});