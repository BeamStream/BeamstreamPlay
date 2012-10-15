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
        
        authenticate: function() {
        	 
        	 $.ajax({
			    	type : 'GET',
			    	url : BS.loggedInUserJson,
			    	dataType : "json",
			    	success : function(data) {
			    		     
				    		if(data == "Session Has Been Expired") 
				    		{
				    			
				    			BS.user.set('loggedin', false);
				    		}
				    		else 
				    		{
				    			BS.user.set('loggedin', true);
				    		 
				    		}
				    		console.log("888" + BS.user.get('loggedin'));
				    		 
			    	 },
			    	 error : function(error){
			    			 console.log("error");
			    	 }
			    });
    	}
 
        
       
});
 
 
