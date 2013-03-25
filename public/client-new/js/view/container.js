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
		children: [],
		widgets: [],
		preloader: '<div class="preloader"><div class="mask"></div><span class="loader">Loading...</span></div>',
		showLoader: false,
		viewOptions: ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'],
		/** @constructor */
		constructor: function(){	
			if (this.constructor.__super__.events) {
				var node = this.constructor.__super__;
				while(node instanceof Backbone.View){
					this.events = _.extend({}, this.events, node.events);
					node=node.constructor.__super__;
				}
				//this.events = _.extend( {}, this.constructor.__super__.events, this.events );
				Backbone.View.apply( this, arguments );
			}else{
				this.constructor.__super__.constructor.apply( this, arguments );
			}
		},
		addView: function(view, options){
			view.parent = this;
			this.children.push(view);
			return this;
		},
		disable: function(){
			
		},
		enable: function(){
			
		},
		getViewById: function(id){
			return _.find(this.children, function(child){if(id==child.$el[0].id) return child;});
		},
		getViewByIndex: function(index){
			return this.children[index];
		},
		getViewByName: function(name){
			return _.find(this.children, function(child){if(name==child.$el[0].className) return child;});
		},
		getWidgetById: function(id) {
			return _.find(this.widgets, function(widget){if(id == widget.$el[0].id) return widget;});
		},
		hide: function(){},
		isNode: function(o){
			return (
					typeof Node === "object" ? o instanceof Node : 
						o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
			);
		},

		//Returns true if it is a DOM element    
		isElement:function(o){
			return (
					typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
						o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		},
		show: function(){},
		stringToObject: function(str, type) {
		    type = type || "object";  // can pass "function"
		    var arr = str.split(".");

		    var fn = (window || this);
		    for (var i = 0, len = arr.length; i < len; i++) {
		        fn = fn[arr[i]];
		    }
		    if (typeof fn !== type) {
		        throw new Error(type +" not found: " + str);
		    }

		    return  fn;
		},
		tabHandler: function(e){},
		toString: function(){
			return this.objName;
		}
		
	});

	return Container;
});
