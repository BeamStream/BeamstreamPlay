define(['libs/backbone/backbone-validator'], function() {
	var BaseModel = Backbone.Model.extend({ 
		objName: 'BaseModel',
		_valid: true,
		options: {
			validate: true
		},
		errors: {},
		validation: {},
		_changed: {},
		initialize: function(){
			var that = this;

			this.bind('add', function(){})



			this.init.apply(this, arguments);

			return this;
		},
		init: function(){},
		addAttr: function(attr){
			this.set(attr);
			this.trigger('change');
			return this;
		},
		copyData : function() {
			this._attributes = _.clone(this.attributes);
		},
		removeAttr: function(attr, removeNested){
			var that=this;
			for (key in this.attributes){
				delete that.attributes[attr];
				if(that.get(key) instanceof Backbone.Model && removeNested){
					that.get(key).removeAttr(attr, removeNested);
				}
			}
			return this;
		},
		setView: function(){
			for (prop in this.attributes){
				if(this.attributes[prop] instanceof Backbone.Model){
					this.attributes[prop].view = this.view;
					this.attributes[prop].setView();
				}
			}
		},
		bindChild: function(obj){
			var that = this, i;
			for (key in this.attributes){
				if(_.isArray(that.attributes[key]))
					for(i=0; i<that.attributes[key].length; i++)
						that.bindChild(that.attributes[key][i])
						else if(_.isObject(that.attributes[key])){
							//that.attributes[key].bind("refresh", function(){ that.trigger("refresh:"+key)});
							that.attributes[key].bind('change', function(){
								that.trigger('change')
							})

						}

			}
		},
		isValid: function(full) {
			var that=this, prop = this.attributes;
			this.validate(this.attributes, {}, full);
			for (attr in prop){
				if(prop[attr] instanceof Backbone.Model){
					if (!prop[attr].isValid(full)){
						return false;
					}
				}
			}
			return this._valid;

		},

		validate: function(attrs, options, full){
			var that = this;

			attrs = attrs || {};
			options = options || {};
			attrs = full ? _.clone(this.attributes) : this.getDelta(attrs) //attrs;
			this.errors = Backbone.Validate(this, attrs, true);
		
			if (this.view) {
				if (_.isEmpty(this.errors)) {
					this._valid = true;
					for (attr in attrs) this.showValid(attr);
				}
				else {
					this._valid = false;

					for (attr in attrs) {
						if (this.errors[attr]) this.showError(attr);
						else this.showValid(attr);
					}
				}
			}
		},

		getDelta: function(attrs) {
			var src, item,
				delta = {};

			for (attr in attrs) {
				src = this.attributes[attr];
				item = attrs[attr];

				if (!_.isEqual(src, item) && !_.isEqual(this._changed[attr], item)) {
					delta[attr] = this._changed[attr] = item;
				}
			}
			return delta;
		},
		showError: function(attr) {
			try{
				var field = this.view.$('[data-name="' + this.objName.toLowerCase() + '.' + attr + '"]'),
				eDiv = this.view.$('.' + attr + '-error')[0],
				custom = $(field).parents('.ui-custom')[0],
				el = custom ? custom : field;
				span = document.createElement('span');
				span.className = 'error';
				span.innerHTML = '* ' + this.errors[attr];
				
				if(eDiv){
					eDiv.innerHTML='';
					eDiv.appendChild(span);
				}else{
					if (field.length>0) {
						var pNode;
						if(el instanceof Array && field.lengh>1)
							pNode=$(el[0]).parents('.field')[0];
						else
							pNode=$(el).parents('.field')[0]
							eDiv = document.createElement('div');
							eDiv.className = attr + '-error field-error';
							eDiv.appendChild(span);
							pNode.appendChild(eDiv);
						
						
					}else{ 
						
					}
				}
				$(el).addClass(this.view.INVALID);
			}catch(e){debug.log(e)}
		},
		showValid: function(attr){
			try{
				var field = this.view.$('[data-name="' + this.objName.toLowerCase() + '.' + attr + '"]')[0],
				error_el = this.view.$('.' + attr + '-error')[0];
				
	
				if (error_el) {
					var custom = $(field).parents('.ui-custom')[0], el = custom ? custom : field,
					pNode=$(field).parents('.field')[0];
					if(error_el.isEqualNode($(pNode).children().last()[0]))
						pNode.removeChild(error_el);
					else{
						error_el.innerHTML='';
					}
					$(el).removeClass(this.view.INVALID);
	
				}
			}catch(e){debug.log(e)}
		},
		intersectionObjects:  function(array) {
			var slice = Array.prototype.slice; // added this line as a utility
			var rest = slice.call(arguments, 1);
			return _.filter(_.uniq(array), function(item) {
				return _.every(rest, function(other) {
					return _.any(other, function(element) { return _.isEqual(element, item); });
				});
			});
		},
		toString: function(){
			return this.objName;
		}

	});
	return BaseModel;
});
