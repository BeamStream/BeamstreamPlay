define(['view/baseView'], function(BaseView){
	var TestView;
	TestView = BaseView.extend({
		objName: 'TestView',
		
		onAfterInit: function(){
			this.data.reset({'firstName':'John', 'lastName': 'Doe'})
		},
		
		events:{
			'click #registeration': 'signUp'
		},
		
		render:function(){
			alert(656);
		},
		
		signUp: function(e){
			e.preventDefault();
			 
		}
		
		
	})
	return TestView;
});

