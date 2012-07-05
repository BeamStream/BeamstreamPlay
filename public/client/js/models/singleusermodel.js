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
        url :BS.loggedInUserJson,
        
//        authenticate: function() {
//        	
//        	 $.ajax({
//			    	type : 'POST',
//			    	url : BS.login,
//			    	data : {
//			    		data :  null,
//			    	},
//			    	dataType : "json",
//			    	success : function(data) {
//				    		if(data.status == "success") 
//				    		{
//				    			BS.singleUser.set('loggedin', true);
//				    		}
//				    		else 
//				    		{
//				    			BS.singleUser.set('loggedin', false);
//				    		 
//				    		}
//				    		 
//			    	 },
//			    	 error : function(error){
//			    			 console.log("Error");
//			    	 }
//			    });
//    	}
 
        
       
});
 
 
