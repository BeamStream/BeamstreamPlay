window.Profile = Backbone.Model.extend({
     
        defaults: {
        	imageData:null,
        	imageName:null,
        	videoData:null,
        	videoName:null,
            mobile:null,
            upload:null
        },
        
        url:"http://localhost:9000/getMediafromPost"
       
});

 

 

