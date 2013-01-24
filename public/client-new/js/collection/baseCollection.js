define(['model/baseModel'], function(BaseModel) {

	var BaseCollection = Backbone.Collection.extend({
		model: BaseModel,
		_cache: {},
		objName: 'BaseCollection',
		initialize: function(models, options){

			var that = this;
			this.bind('change', function(){
			});

			return this;
			
		},
		onAdd: function(){},
		add: function(models, options){
			Backbone.Collection.prototype.add.call(this, models);
			if(this.models.length){
				this.models[0].view = this.view;
				this.models[0].setView();
			}
			return this;
		},
		fetch: function(options) {
			options || (options = {});
			options.cache = false;
			return Backbone.Collection.prototype.fetch.call(this, options);
		},

		
		create : function(model, options) {
			this.model.url=this.url;
			var coll = this;
			options || (options = {});
			if (!(model instanceof Backbone.Model)) {
				model = new this.model(model, {collection: coll});
			} else {
				model.collection = coll;
			}
			var success = function(nextModel, resp) {
				coll.add(nextModel);
				if (options.success) options.success(nextModel, resp);
			};
			return model.save(null, {success : success, error : options.error});
		},

		cache: function(model) {
			var cacheID = model.id || model._cacheID;

			if (!cacheID) {
				cacheID = btoa((+new Date).toString(16));
				model._cacheID = cacheID;
			}

			this._cache[cacheID] = _.clone(model.attributes);
			return model;
		},

		restore: function(model) {
			var cacheID = model.id || model._cacheID,
				prevAttributes = this._cache[cacheID] || {};

			_.extend(model.attributes, prevAttributes);

			delete this._cache[cacheID];
			return model;
		},

		toString: function(){
			return this.objName;
		}

	});

	return BaseCollection;
});