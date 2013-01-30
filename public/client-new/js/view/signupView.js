define(['view/baseView'], function(BaseView){
	var signupView;
	signupView = BaseView.extend({
		objName: 'signupView',
//		events:{
//			'click .headline': 'clickRow'
//		},
//		clickRow: function(e){
//			$(e.target).css({'color':'red'});
//		}
                onAfterInit: function(){
			this.data.reset({})
		}


		
	})
	return signupView;
});