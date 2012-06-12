BS.SingleUser = Backbone.Model.extend({
     
	 idAttribute: "_id",
        defaults: {
        	
        	id:null,
        	userType:null,
        	email:null,
        	firstName:null,
        	lastName:null,
        	userName:null,
        	alias:null,
        	password:null,
        	orgName:null,
        	location:null,
        	streams:null,
        	schoolId:null,
        	classId:null
        },
//        url : "http://localhost/Beam2/BeamstreamPlay/public/client/api.php",
        url : "http://localhost:9000/loggedInUserJson",
        
       
});
 
 
