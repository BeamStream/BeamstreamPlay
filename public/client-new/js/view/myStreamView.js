define(['view/baseView'], function(BaseView){
	var MyStreamView;
	TestView = BaseView.extend({
		objName: 'MyStreamView',
		
		onAfterInit: function(){
			this.data.reset({'firstName':'John', 'lastName': 'Doe'})
		},
		
		events:{
//			'click #registeration': 'signUp'
		},
		
		
		
		
	})
	return MyStreamView;
});

