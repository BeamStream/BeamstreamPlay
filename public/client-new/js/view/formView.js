define(
		[ "baseView" ],
		function(BaseView, SelectBox, Errors) {
			var FormView;
			FormView = BaseView
					.extend({
						objName : "FormView",
						FIELD_CHANGE : "field-change",
						INVALID : "invalid",
						animate : {
							time : 500,
							effect : "fade"
						},
						className : "formview",
						regEx : {
							number : /[1234567890]/g,
							integer : /[0-9\.]/g,
							alpha : /[A-Z]/g
						},
						events : {
							"change .field input" : "_onChange",
							"change .field textarea" : "_onChange",
							"change .field select" : "_onChange",
							"change .ui-custom select" : "_onChange",
							"keyup .ui-custom select" : "_onKeyUp",
							"click .btn-icon-save" : "saveForm",
							"keyup .field input" : "_onKeyUp",
							"focus .field input, .field select" : "_onFocus",
							"blur .field input, .field select" : "_onBlur"
						},
						afterSubmitError : function() {
							return this
						},
						afterSubmitSuccess : function() {
							return this
						},
						checkRestriction : function(e) {
							var keyType = e.target.getAttribute("data-type");
							if (!e)
								var e = window.event;
							if (e.keyCode)
								code = e.keyCode;
							else if (e.which)
								code = e.which;
							var character = String.fromCharCode(code);
							if (code == 27) {
								e.target.blur();
								return false
							}
							if (!e.ctrlKey
									&& code != 9
									&& code != 8
									&& code != 36
									&& code != 37
									&& code != 38
									&& (code != 39 || code == 39
											&& character == "'") && code != 40) {
								if (character.match(this.regEx[keyType])) {
									return true
								} else {
									return false
								}
							}
						},
						error : function() {
							debug.log("error");
							return false
						},
						_onBlur : function(e) {
							this.onBlur(e)
						},
						onBlur : function(e) {
							var pNode = $(e.target).parents(".ui-custom")[0] ? $(
									e.target).parents(".ui-custom")[0]
									: e.target.parentNode, eDiv = $(pNode)
									.find(".field-error")[0];
							if ($(e.target).parents(".ui-custom")[0])
								$($(e.target).parents(".ui-custom")[0])
										.removeClass("focus")
						},
						_onFocus : function(e) {
							this.onFocus(e)
						},
						onFocus : function(e) {
							var pNode = $(e.target).parents(".ui-custom")[0] ? $(
									e.target).parents(".ui-custom")[0]
									: e.target.parentNode, eDiv = $(pNode)
									.find(".field-error")[0];
							if ($(e.target).parents(".ui-custom")[0])
								$($(e.target).parents(".ui-custom")[0])
										.addClass("focus")
						},
						_onKeyPress : function(e) {
							this.onKeyPress(e)
						},
						onKeyPress : function(e) {
							if (!e)
								var e = window.event;
							if (e.keyCode)
								code = e.keyCode;
							else if (e.which)
								code = e.which;
							if (code == 13)
								this.saveForm();
							else
								return this.checkRestriction(e)
						},
						_onKeyUp : function(e) {
							var pNode = $(e.target).parents(".ui-custom")[0], txt = $(
									pNode).find(".select-txt")[0];
							if (txt)
								txt.innerHTML = $(e.target).find(
										"option:selected").text();
							this.onKeyUp(e)
						},
						onKeyUp : function(e) {
							if (e.target.getAttribute("data-format") == "phone") {
							}
						},
						_onChange : function(e) {
							var pNode = $(e.target).parents(".ui-custom")[0], txt = $(
									pNode).find(".select-txt")[0];
							if (txt)
								txt.innerHTML = $(e.target).find(
										"option:selected").text();
							this.onChange(e)
						},
						onChange : function(e) {
							var that = this, i = 0, attr = {}, ptr = attr, name = e.target
									.getAttribute("name"), form = this
									.$(".content")[0], value;
							if (e.target.getAttribute("data-format") == "phone")
								value = e.target.value.replace(/[^\d.]/g, "");
							else
								value = e.target.value == "true" ? true
										: e.target.value == "false" ? false
												: e.target.value;
							this.setValue(this.data.models[0], name.split("."),
									value, _.indexOf(this.$('[name="' + name
											+ '"]'), e.target));
							if (e.target.nodeName == "INPUT"
									&& e.target.getAttribute("type")
											.toLowerCase() == "radio") {
							} else {
								$(e.target).addClass(this.FIELD_CHANGE)
							}
						},
						
						_onSave : function(e) {
							this.onSave(e)
						},
						
						onSave : function(e) {
						},
						
						saveForm : function(e, callback) {
							_.bindAll(this,
									"afterSubmitError", "afterSubmitSuccess",
									"success", "error", "serverError");
							var that = this, attribute;
							var dataToSave = this.data instanceof Backbone.Collection ? this.data.models[0]
									: this.data;
							
							if (!dataToSave.isValid(true))
								return false;
							this._onSave();
							dataToSave.save(dataToSave.attributes, {
								success : this.success,
								error : this.error,
								validate : false
							})
						},
						
						setValue : function(model, p, v, i) {
							var key, value, child;
							if (_.isEmpty(_.pick(model.attributes, p[0]))) {
								model.set(p[0], v)
							} else {
								for (attr in model.attributes) {
									child = model.attributes[attr];
									if (attr == p[0]) {
										if (child instanceof Backbone.Model) {
											p.shift();
											this.setValue(
													model.attributes[attr], p,
													v)
										} else if (child instanceof Object) {
											if (_.isArray(child)) {
												if (_.isArray(child[i])) {
													child[i][p[1]] = v
												} else {
													v = v.replace(/^,+/, "")
															.split(/,|, /);
													for ( var j = 0; j < v.length; j++) {
														v[j] = v[j].replace(
																/^\s+/, "")
																.replace(
																		/\s+$/,
																		"");
														if (v[j] === "")
															v.splice(j, 1)
													}
													model.set(p[0], v)
												}
											} else {
												var elem = child;
												for ( var i = 1; i < p.length - 1; i++) {
													elem = elem[p[i]]
												}
												elem[p[p.length - 1]] = v
											}
											model.trigger("change")
										} else
											model.set(p[0], v)
									}
								}
							}
						},
						serverError : function(model, data) {
							var that = this;
							if (_.isObject(data)) {
								this.data.models[0].showError()
							} else {
								var error_msg = this.$(".error_msg_area")[0];
								if (error_msg)
									error_msg.innerHTML = data.response;
								else
									error_msg = this.$(".content").append(
											'<div class="error_msg_area">'
													+ data.response + "</div>");
								$(error_msg).css({
									display : "block"
								})
							}
							return false
						},
						success : function(model, data) {
							this.afterSubmitSuccess()
						}
					});
			return FormView
		});