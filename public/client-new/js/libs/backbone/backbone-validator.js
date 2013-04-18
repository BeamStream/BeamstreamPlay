Backbone.Validate = (function() {

	var patterns = {
		string: /^([a-z])$/,
		digits: /^\d+$/,
		number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
		email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,				
		url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
		/* country code + 7 or 10 digit number, with extensions */
		//phone: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/
		/* country code + 7 or 10 digit number, w/o extensions */
		//phone: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-‌​9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})$/
		/* country code + 10 digit phone numbers (not 7 digit like 843-1212) w/o extentions */
		//phone: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})$/
		/* country code + 10 digit phone numbers (not 7 digit like 843-1212) with extentions */
		//phoneExt: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/
		/* country code + 10 digit accepts () around area code */
		//phone: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$ ^\d?(?:(?:[\+]?(?:[\d]{1,3}(?:[ ]+|[\-.])))?[(]?(?:[\d]{3})[\-/)]?(?:[ ]+)?)?(?:[a-zA-Z2-9][a-zA-Z0-9 \-.]{6,})(?:(?:[ ]+|[xX]|(i:ext[\.]?)){1,2}(?:[\d]{1,5}))?$/
		/*123-456-7890 or 123.456.7890 or 1234567890 or 123 456 7890 or (123) 456-7890 */
		phone: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
		//Only allow letters, numbers, underscore
		//password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/; 
		//Allow letters, numbers, special characters, at least lowercase, capital, number
		password: /(?=.*\d)(?=.*[a-z]).{8,}/,
		
		//Added by Aswathy
		website : /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&amp;?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/,
		time: /^([0]?[1-9]|[1][0-2]):([0-5][0-9]|[1-9])([AP]M)?$/
	};
	var format = function() {
		var text = arguments[0],
			args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : []
		return text.replace(/\{(\d+)\}/g, function(match, number) {
			return typeof args[number] !== 'undefined' ? args[number] : match;
		});
	};
	var isNumber = function(value){
		return _.isNumber(value) || (_.isString(value) && value.match(patterns.number));
	};
	var hasValue = function(value) {
		return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === ''));
	};
	var trim = String.prototype.trim ?
		function(text) {return text === null ? '' : String.prototype.trim.call(text);} :
		function(text) {var trimLeft = /^\s+/, trimRight = /\s+$/;return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');};
	

	function Validate(model, changedAttributes, forceUpdate) {

		var errors = {},
			attributes = {};

		model = model || {};

		var isPlaceHolder = function(field){
			if (typeof attributes[field] === 'undefined') return true;
			if (model.view){
				var ph = model.view.$('[data-name="' + model.objName.toLowerCase() + '.' + field + '"]').attr('placeholder');
				return ph && ph == attributes[field];
			}
			return false;
		};
		var addError = function(field, message) {
			if (_.isUndefined(errors[field])) { 
				errors[field] = {};
			}
			errors[field] = message;
		};
		var removeError = function(field) {
			if (_.isUndefined(errors[field])) return;
			delete errors[field];
		};

		var validators = {
			required: function(field) {
				if ( !( hasValue(attributes[field]) || isPlaceHolder(field) )) {						 
//					addError(field, I18n.t('errors.'+ field + '.required'));
					
					// Added by Aswathy 
					addError(field,"This filed is required");
				}
			},
			acceptance: function(field) {
				if (!attributes[field]) {						 
					addError(field, I18n.t('errors.'+ field + '.acceptance'));
				}
			},
			length: function(field, length) {
				if ( !hasValue(attributes[field]) || trim(attributes[field]).length !== length ) {
					addError(field, I18n.t('errors.'+ field + '.length'));
				}
			},
			pattern: function(field, regex){
				if ( hasValue(attributes[field]) && !attributes[field].toString().match(patterns[regex] || regex) ) {
					addError(field, I18n.t('errors.'+ field + '.pattern' + '.'+regex));
				}
			},
			/*Added by Aswathy */ 
			equalTo: function(field1,field2){
				if( hasValue(attributes[field2]) && attributes[field2].toString() !== attributes[field1].toString()){
					addError(field1, I18n.t("These passwords don't match. Try again"));
				}

			},
			minLength: function(field,minLength) {
	            if (!hasValue(attributes[field]) || trim(attributes[field]).length < minLength) {
	            	addError(field, I18n.t('errors.'+ field + '.minLength'));
	            }
	        }
			
		};
		
		if (!forceUpdate) {
			//fallback hook to reset attributes
			model.currentAttributes = model.currentAttributes || _.clone(model.attributes);
			attributes = _.isEmpty(attributes) ? _.clone(changedAttributes) : _.extend(attributes, changedAttributes);
		}
		else {
			model.currentAttributes = _.extend(model.currentAttributes || {}, changedAttributes);
			attributes = _.clone(model.currentAttributes);
		}
	
		for (attr in model.validation){
			if (attributes.hasOwnProperty(attr) && !errors[attr]){
				var val, param,
					vals = model.validation[attr];

				for (val in vals) {
					param = vals[val];
					validators[val](attr, param)
				}
			}
		}

		return errors;
	};
	return Validate;
})();
