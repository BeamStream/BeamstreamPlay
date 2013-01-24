define(['view/baseView'], function(BaseView){
	var TeamView;
	TeamView = BaseView.extend({
		objName: 'TeamView',
		events:{
			'click .headline': 'clickRow'
		},
		clickRow: function(e){
			$(e.target).css({'color':'red'});
		}


		
	})
	return TeamView;
});