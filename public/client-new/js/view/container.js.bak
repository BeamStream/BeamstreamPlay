/*
 * Author: Viet Doan
 * ClassName: Container
 * Extends: Backbone.View
 * Objective: Container Helper methods
 */
define([], function() {

	var Container; 
	Container = Backbone.View.extend({
		objName: 'Container',
		addView: function(view, options){
			view.parent = this;
			this.childs.push(view);
			return view;
		},
		disable: function(){
			
		},
		enable: function(){
			
		},
		getViewById: function(id){
			return _.find(this.childs, function(child){if(id==child.$el[0].id) return child;});
		},
		getViewByIndex: function(index){
			return this.childs[index];
		},
		getViewByName: function(name){
			return _.find(this.childs, function(child){if(name==child.$el[0].className) return child;});
		},
		hide: function(){
			
		},
		show: function(){
			
		}
	});

	return Container;
});
