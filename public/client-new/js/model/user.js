define(['model/baseModel'], function(BaseModel) {
	var User = BaseModel.extend({ 
		objName: 'User',
//		validation: {
//			firstName: {
//				required: true
//			},
//			lastName: {
//				required: true
//			},
//			age: {
//				required: true
//			}
//		}

	});
	return User;
});