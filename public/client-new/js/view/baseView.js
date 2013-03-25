/*
 * Author: Viet Doan
 * ClassName: BaseView
 * Extends: Backbone.View
 * Objective: Render view on the from external/string templates
 */
define(['container',
        'baseModel',
        'baseCollection',
        'apps/common/templatemanager',
        ], function(Container, BaseModel, BaseCollection, TemplateManager) {

	/** 
    Inherit from Container.
    @exports BaseView
    @version 1.0
	*/

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
		isRender: false,
		events: {
		},
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
		initialize: function(options, callback) {
			console.log(this)
			var that = this;
			_.bindAll(this, 'add', 'remove', 'getTemplate', 'fetch', 'set', 'render', 'onAfterRender', 'onWidgetEvent');

			this._onBeforeInit();
			
			this.options.data=options.data || {};
			if(this.showLoader) 
				this.addLoader();
			
			this.setProperty();
			this.setModel();
			//this.createData();

			this.getError && this.getError();

			_.defer(function(){
				that._onAfterInit.apply(that, arguments);
			})


			return this;
		},
		render: function(callback) {
			//console.log('render called', this);

			if(this.tplUrl && !this.tpl) {

				this.getTemplate();
				return this;
			}


			if(this.tpl){
				this._onBeforeRender();
				var compiledTemplate;
				this.empty();
				
				this.$('.panel-body')[0] || this.$el.append('<div class="panel-body"></div>');
				this.$('.content')[0] || this.$('.panel-body').append('<div class="content"></div>');

				if ((this.data.models.length === 0 || (this.data.models[0].attributes.content && this.data.models[0].attributes.content.length === 0 ))) 
					this.displayNoResult();
				else
					this.displayPage();
					
				this.isRender = true;
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
			//ToDO: Make sure to run a loop to kill all childViews
			if(this.childs){
				_.each(this.childs, function(view){
					view.close();
				})
			}

			this.destroy();
			this.unbind();
		},
		createChildView: function(){
			Module.execute(this.$('.panel-body'))
		},
		destroy: function(){
			//COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			$(this.el).removeData().unbind(); 

			//Remove view from DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);

		},
		displayNoResult: function(callback){
			this.animate.effect='fade';
			this.$(".content").html("<span class='no-data'>No Data</div>");
			this.$("div.content").data("loaded","true");
			
		},
		displayPage: function(callback){
			compiledTemplate = Handlebars.compile(this.tpl);
			//the stringify/parse strips out Backbone scaffolding. toJSON() still keeps it.
			this.$(".content").html( compiledTemplate(JSON.parse(JSON.stringify(this.data))) );
			this.$("div.content").data("loaded","true");
			
		},
		empty: function(){
			this.$('.content').empty();
		},
		fetch: function(options){
			//console.log('fetching', this)
			var that = this;
			options = options?options:{};
			if(!this.$('.preloader')[0])
				this.addLoader();
			
			if(this.data.url){
				that.data.fetch({
					data: options,
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
			return this;
		},
		getAttributs: function(){
			return this;
		},
		getTemplate: function(callback){
			//debug.log('getTemplate ', this);
			this.tplUrl = this.options.tplUrl ? this.options.tplUrl : $(this.el).data('tpl');
			var that = this;
			TemplateManager.get(this.tplUrl, function(template){
				that.tpl = template;
				//console.log('finish getting template', that, callback)
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
			$("a[data-toggle=popover]").popover({html: true}).click(function(e) { e.preventDefault() });
			$("a[data-toggle=modal]").popover({}).click(function(e) { e.preventDefault() });
			
			this.onAfterRender();
			return this;
		},
		onAfterRender: function(callback){
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
		onWidgetEvent: function(e, widget){
			//debug.log('widget', widget)
		},
		onRender: function(){
			if(this.tplUrl)
				this.getTemplate();
		},
		repaint: function(){
			//this.effect= this.isRender ? 'fade':'blind';
			this.render();
		},
		remove: function(callback) {
			callback && callback();
			return this;
		},
		removeLoader: function(){
			var that=this;
			//setTimeout(function(){ that.$('.preloader').hide('fade', 1000, function(){$(that).remove();}); }, 300);
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
				//that._data = _.deepClone(that.data, true)
				_.defer(that.render); 
			}, this);
			
			require(['model/' +  this.modelURL], function(Model){
				that.data.model = Model;
				
				if(that.data.url && _.isEmpty(that.options.data))
					that.fetch();
				else
					that.data.reset(that.options.data);
					
				
				//callback && callback();
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
			this.tplUrl = this.options.tplUrl ? this.options.tplUrl : $(this.el).data('tpl');
		},
		setURL: function(url){
			this.url = url;
			this.data.url = url;
			return this;
		},
		show: function(selector, view) {
			//ToDo
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
			//Usage: view.unBind([{'click':'.btn-icon-save'},{'click':'.btn-icon-cancel'}])
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
			//ToDo
			return this;
		}
	});

	return BaseView;
});
