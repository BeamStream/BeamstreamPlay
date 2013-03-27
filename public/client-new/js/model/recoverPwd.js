define(['model/user'], function(User) {
	var Recoverpwd = User.extend({
		
		defaults: {
			mailId : ''
        },
		validation: {

			mailId: {
				required: true,
				pattern: 'email'
			} 
		}
		
	});
		        
	return Recoverpwd;
});