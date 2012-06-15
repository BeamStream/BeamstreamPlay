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
        url : "http://beamstream-v3.herokuapp.com/loggedInUserJson"
      //  url : "http://localhost:9000/loggedInUserJson",
        
       
});
 
 
