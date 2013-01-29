define(['view/baseView'], function(BaseView){
	var TestView;
	TestView = BaseView.extend({
		objName: 'TestView',
		onAfterInit: function(){
			this.data.reset({'firstName':'John', 'lastName': 'Doe'})
		}
		
	})
	return TestView;
});

