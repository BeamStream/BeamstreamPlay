define(['model/baseModel'], function(BaseModel) {
	var Person = BaseModel.extend({ 
		objName: 'Person',
		defaults: {
			firstName: '',
		},
		validation: {
			firstName: {
				required: true
			},
			lastName: {
				required: true
			},
			age: {
				required: true
			}
		}

	});
	return Person;
});