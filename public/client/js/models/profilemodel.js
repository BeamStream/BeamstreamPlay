window.Profile = Backbone.Model.extend({
     
        defaults: {
            photoUrl:null,
            videoUrl:null,
            mobile:null,
            upload:null
        },
        
        url:"api.php"
       
});

//window.ProfileCollection = Backbone.Collection.extend({
//
//    model:Class, 
// 
//}); 

 
