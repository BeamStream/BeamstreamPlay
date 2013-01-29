/*
 * Author: Viet Doan
 * ClassName: BaseView
 * Extends: Backbone.View
 * Objective: Render view on the from external/string templates
 */
define(['view/container',
        'model/baseModel',
        'collection/baseCollection',
//        'widgets/modal',
        'apps/common/templatemanager'
        ], function(Container, BaseModel, BaseCollection, TemplateManager) {

	var BaseView; 
	BaseView = Container.extend({
		objName: 'BaseView',
		LOADER: 'loader',
		paging: {
			pageSize: null,
			pageNumber: null,
			sortCriteria: null
		},
		_data: new BaseCollection(),
		data: null,
		className: 'baseview',
		animate:{
			time: 300,
			effect: 'blind'
		},
		childs: [],
		events: {},
		isRender: false,
		preloader: '<div class="preloader"><div class="mask"></div><span class="loader">Loading...</span></div>',
		showLoader: false,
		viewOptions: ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'],
		constructor: function(){	
			if (this.constructor.__super__.events) {
				var node = this.constructor.__super__;
				while(node instanceof Backbone.View){
					this.events = _.extend({}, this.events, node.events);
					node=node.constructor.__super__;
				}
				Backbone.View.apply( this, arguments );
			}else{
				this.constructor.__super__.constructor.apply( this, arguments );
			}
		},
		initialize: function(options, callback) {
			console.log(this)
			var that = this;
			_.bindAll(this, 'add', 'remove', 'getTemplate', 'createData', 'getModel', 'fetch', 'set', 'render', 'onAfterRender');

			this._onBeforeInit();

			if(this.showLoader) 
				this.addLoader();
			
			this.setProperty();
			this.createData();


			_.defer(function(){
				that._onAfterInit.apply(that, arguments);
			})


			return this;
		},
		render: function(callback) {

			if(this.tplUrl && !this.tpl) {

				this.getTemplate();
				return this;
			}


			if(this.tpl){
				this._onBeforeRender();
				var compiledTemplate;
				this.empty();
				
				this.$('.content')[0] || this.$el.append('<div class="content"></div>');

				if ((this.data.models.length === 0 || (this.data.models[0].attributes.content && this.data.models[0].attributes.content.length === 0 ))) 
					this.displayNoResult();
				else
					this.displayPage();
					
				this.isRender = true;
				callback && callback();
				this._onAfterRender();
				
			}
			this.removeLoader();
			return this; 
		},
		add: function(model, options) {
			try{
				this.data.add(model, options);
			}catch(e){
				debug.log("Data is not Collection Type");
			}
			return this;
		},
		addLoader: function(){
			if(this.showLoader) this.$el.append(this.preloader);
			return this;
		},
		bind: function(el, ev){
			if(_.isObject(el)){
				_.each(el, function(event){
					for (var key in event) 
						$(that.el).delegate(event[key], key);
				})
			}else
				$(this.el).delegate(el, ev);
		},
		close: function(){
			if (this.beforeClose) {
				this.beforeClose();
			}
			if(this.childs){
				_.each(this.childs, function(view){
					view.close();
				})
			}

			this.destroy();
			this.unbind();
		},
		createData: function(){
			var that=this;
			this.data = this.options.collection ? new this.options.collection() : new BaseCollection();	
			this.data.view = this;
			this.data.url = this.data.baseURL = this.url;
			this.data.modelURL = $(this.el).data('model') ? $(this.el).data('model') : 'baseModel';

			if(this.data.modelURL && this.data.url)
				this.getModel(this.fetch);
			else if(this.data.modelURL)
				this.getModel();

			this.data.bind('add', function(){}, this);

			this.data.bind('reset', function(){
				that.update();
				_.defer(that.render); 
			}, this)

		},
		destroy: function(){
			this.undelegateEvents();

			$(this.el).removeData().unbind(); 

			this.remove();  
			Backbone.View.prototype.remove.call(this);

		},
		displayNoResult: function(callback){
			this.animate.effect='fade';
			this.$(".content").html("<span class='no-data'>No Result</div>");
			
		},
		displayPage: function(callback){
			var compiledTemplate = Handlebars.compile(this.tpl);
			this.$(".content").html( compiledTemplate(this.data.toJSON()[0]));
			
		},
		empty: function(){
			this.$('.content').empty();
		},
		fetch: function(){
			var that = this;
			if(!this.$('.preloader')[0])
				this.addLoader();
			
			if(this.data.url){
				that.data.fetch({
					success: function(data){
						//console.log('fetch success', that);
						that._onAfterFetch.apply(that, arguments);
					},
					error: function(resp, status, xhr){
						//manually firing reset for error handler to catch if url response has error, then show user "No Data" rather than loader icon
						that.data.trigger('reset')
					}
				});
			}
		},
		getAttributs: function(){
			return this;
		},
		getModel: function(callback){
			this.modelURL = $(this.el).data('model') ? $(this.el).data('model') : 'baseModel';
			var that=this;
			require(['model/' +  this.modelURL], function(Model){
				that.data.model = Model;
				callback && callback();

				if(!that.url && _.isEmpty(that.data.models)){
					that.set({}, {silent: true});
					that.data.models[0]._previousAttributes = {};
				}
				return this;
			});

		},
		getTemplate: function(callback){
			this.tplUrl = this.options.tplUrl ? this.options.tplUrl : $(this.el).data('tpl');
			var that = this;
			TemplateManager.get(this.tplUrl, function(template){
				that.tpl = template;
				that.render();
				callback && callback();
			})

			return this;
		},
		hide: function(){
			this.$('.content').hide();
		},
		hideAll: function(){
			this.$el.hide();
		},
		isNode: function(o){
			return (
					typeof Node === "object" ? o instanceof Node : 
						o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
			);
		},
		isElement:function(o){
			return (
					typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
						o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		},
		_onAfterFetch: function(){
			this.onAfterFetch();
			return this;
		},
		onAfterFetch: function(){
			return this;
		},
		_onAfterInit: function(){
			this.onAfterInit();
			return this;
		},
		onAfterInit: function(){
			return this;
		},
		_onAfterRender: function(){
			this.onAfterRender();
			return this;
		},
		onAfterRender: function(){
			if (this.filterSortView) this.filterSortView.sortRender();
			return this;
		},
		_onBeforeInit: function(){
			this.onBeforeInit();
			return this;
		},
		onBeforeInit: function(){
			return this;
		},
		_onBeforeRender: function(){
			this.onBeforeRender();
			return this;
		},
		onBeforeRender: function(){
			return this;
		},
		onDestroyWidget: function(list, destination){
			var obj = {};
			delete obj;
		},
		onWidgetEvent: function(e, widget){},
		onRender: function(){
			if(this.tplUrl)
				this.getTemplate();
		},
		remove: function(callback) {
			callback && callback();
			return this;
		},
		removeLoader: function(){
			var that=this;
			this.$('.preloader').hide('fade', 1000, function(){$(this).remove();});
			return this;
		},
		set: function(data, options){
			var that = this;
			options=options?options:{silent:false};
			
			if(that.data instanceof Backbone.Collection){
				that.data.reset(data, options);
			}else
				that.data.set(data, options);
			
			return this;
		},
		setModel: function(){
			var that=this;
			this.data = new BaseCollection();	
			this.data.view = this;
			this.data.url = this.data.baseURL = this.url;
			this.modelURL = $(this.el).data('model') ? $(this.el).data('model') : 'baseModel';
			this.data.bind('reset', function(){
				that.update();
				_.defer(that.render); 
			}, this);
			
			require(['model/' +  this.modelURL], function(Model){
				that.data.model = Model;
				
				if(that.data.url && _.isEmpty(that.options.data))
					that.fetch();
				else
					that.data.reset(that.options.data);
					
				
				return this;
			});
			
		},
		setProperty: function(){
			
			var that = this;
		    for (var key in this.options) {
		      if (!_.include(this.viewOptions, key))
		      	this[key]=this.options[key];
		    }
			 
			this.url= (this.options.url)? this.options.url: $(this.el).data('url');
			this.tplUrl = $(this.el).data('tpl');
		},
		setURL: function(url){
			this.url = url;
			this.data.url = url;
			return this;
		},
		show: function(selector, view) {
			if (this.currentView)
				this.currentView.close();
			$(selector).html(view.render().el);
			this.currentView = view;
			return view;
		},
		toString: function(){
			return this.objName;
		},
		unBind: function(el, ev){
			var that=this;
			if(_.isObject(el)){
				_.each(el, function(event){
					for (var key in event) 
						$(that.el).undelegate(event[key], key);
				})
			}else
				$(this.el).undelegate(el, ev);
		},
		update: function(){
			return this;
		}
	});

	return BaseView;
});
