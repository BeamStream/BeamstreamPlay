/*******************************************************************************
 * BeamStream
 */

define([ 'model/user' ], function(User) {
	var UserLogin = User.extend({

		defaults : {
			mailId : '',
			password : '',

		},
		validation : {

			mailId : {
				required : true,
				pattern : 'email'
			},
			password : {
				required : true,
				minLength : 6
			}
		}

	});

	return UserLogin;
});