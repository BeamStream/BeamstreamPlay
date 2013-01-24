define([], function() {

	var Constants = {

		// ----------------------
		// JavaScript Language
		// ----------------------

		OBJECT: Object,
		FUNCTION: Function,
		ARRAY: Array,
		STRING: String,
		NUMBER: Number,
		DATE: Date,
		MATH: Math,
		REGEXP: RegExp,
		UNDEFINED: undefined,
		NULL: null,

		PROTOTYPE: "prototype",
		PROTOTYPE_FIELDS: ['constructor', 'hasOwnProperty', 'isPrototypeOf',
				'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'],
		NON_HOST_TYPES: {
			'boolean': 1,
			'number': 1,
			'string': 1,
			'undefined': 1
		},
		VENDOR_PREFIXES: ["Webkit", "Moz", "O", "ms", "Khtml"],

		// ----------------------
		// Types
		// ----------------------

		TYPE_ARRAY: "array",
		TYPE_BOOLEAN: "boolean",
		TYPE_DATE: "date",
		TYPE_FUNCTION: "function",
		TYPE_NUMBER: "number",
		TYPE_OBJECT: "object",
		TYPE_REGEXP: "regexp",
		TYPE_STRING: "string",

		CLASS: "[[Class]]",
		CLASS_ARRAY: "[object Array]",
		CLASS_BOOLEAN: "[object Boolean]",
		CLASS_DATE: "[object Date]",
		CLASS_FUNCTION: "[object Function]",
		CLASS_NUMBER: "[object Number]",
		CLASS_OBJECT: "[object Object]",
		CLASS_REGEXP: "[object RegExp]",
		CLASS_STRING: "[object String]",

		// ----------------------
		// Array
		// ----------------------

		ARR_SLICE: Array.prototype.slice,

		// ----------------------
		// Function
		// ----------------------

		FN_FALSE: function() {
			return false
		},
		FN_IDENTITY: function(x) {
			return x
		},
		/**
		 * An empty function. This function will do nothing if called. It can be
		 * used as a callback when no callback is desired.
		 */
		FN_NOOP: function() {
		},
		FN_TRUE: function() {
			return true
		},

		// -----------------------
		// JSON
		// -----------------------

		JSON_STRINGABLE_TYPES: {
			'boolean': 1,
			'object': 1,
			'number': 1,
			'string': 1
		},

		JSON_PROBLEM_CHARS: {
			'\u0000': '\\u0000',
			'\u00ad': '\\u00ad',
			'\u070f': '\\u070f',
			'\u17b4': '\\u17b4',
			'\u17b5': '\\u17b5',
			'\ufeff': '\\ufeff'
		},

		// ----------------------
		// Math
		// ----------------------

		CEIL: Math.ceil,
		FLOOR: Math.floor,
		MAX: Math.max,
		MIN: Math.min,

		// ----------------------
		// Date/Time
		// ----------------------

		ONE_SECOND: 1000,
		ONE_MINUTE: 60 * Date.ONESECOND,
		ONE_HOUR: 60 * Date.ONEMINUTE,
		ONE_DAY: 24 * Date.ONEHOUR,
		ONE_WEEK: 7 * Date.ONEDAY,
		ONE_MONTH: 30 * Date.ONEDAY,
		ONE_YEAR: 12 * Date.ONEMONTH,
		ISO_FORMAT: "yyyy-MM-dd'T'HH:mm:ss'Z'",
		DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		MILLISECONDS_IN_WEEK: 604800000.0,
		MILLISECONDS_IN_DAY: 86400000,
		MILLISECONDS_IN_HOUR: 3600000,
		THIRTY_TWO_DAYS: 2764800000,

		// ----------------------
		// Query String
		// ----------------------

		QS_DEFAULT_SEP: "&",
		QS_DEFAULT_EQ: "=",

		// ----------------------
		// RegExp Patterns
		// ----------------------

		RE_ESC_AMP: /&amp;/g,
		RE_ESC_LT: /&lt;/g,
		RE_ESC_GT: /&gt;/g,
		RE_UNESC_AMP: /&/g,
		RE_UNESC_LT: /</g,
		RE_UNESC_GT: />/g,
		RE_CAPPED: /([A-Z]+)([A-Z][a-z])/g,
		RE_CAMEL_CASE: /([a-z\d])([A-Z])/g,
		RE_DOUBLE_COLONS: /::/g,
		RE_HYPHENS: /-/g,
		RE_HYPHENATED: /-+(.)?/g,
		RE_UNDERSCORES: /_/g,
		RE_TRIM_LEFT: /^\s\s*/,
		RE_TRIM_RIGHT: /\s\s*$/,

		RE_HTML_COMMENTS: /<!--[^\x00]*?-->/g,
		RE_OPEN_HTML_COMMENTS: /<!--/g,
		RE_SCRIPT: /<script[^>]*>([^\x00]*?)<\/script>/gi,
		RE_OPEN_SCRIPT_TAG: /<script/i,
		RE_QUOTES: /(["'])(?:(?!\1)[^\\]|[^\\]|\\.)+?\1/g,
		RE_REGEXPS: /(\/)(?:(?!\1)[^\\]|[^\\]|\\.)+?\1/g,
		
		RE_JS_COMMENT: /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,

		RE_FUNCTION_NAME: /function ([^\s]+)\(/, // /function (.{1,})\(/

		RE_JSON_FILTER: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
		
		RE_CURRENT_DIR: /^\.\//,
		RE_URI_PARTS: /([^:]+:)\/\/(?:[^:]+(?:\:[^@]+)?@)?([^\/:$]+)(?:\:(\d+))?/,

		RE_ALPHANUM_PATTERN: /[^a-zA-Z0-9]/,
		RE_ALPHA_PATTERN: /[^a-zA-Z]/,
		RE_NUM_PATTERN: /[^0-9]/,
		RE_FILE_PATTERN: /[^a-zA-Z0-9-_\. ]/,
		RE_HEX_PATTERN: /[^a-fA-F0-9]/,

		// Email and URL RegExps contributed by Scott Gonzalez:
		// http://projects.scottsplayground.com/email_address_validation/
		// licensed unter MIT license -
		// http://www.opensource.org/licenses/mit-license.php
		RE_EMAIL_PATTERN: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
		RE_URL_PATTERN: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
		RE_US_PHONE: /^(\+\d)*\s*(\(\d{3}\)\s*)*\d{3}(-{0,1}|\s{0,1})\d{2}(-{0,1}|\s{0,1})\d{2}$/,
		RE_US_POSTAL_CODE: /^[0-9]{5}(-[0-9]{4})?$/,
		RE_CA_POSAL_CODE: /^[ABCEGHJ-NPRSTVXY]{1}[0-9]{1}[ABCEGHJ-NPRSTV-Z]{1}[ ]?[0-9]{1}[ABCEGHJ-NPRSTV-Z]{1}[0-9]{1}$/,
		RE_TEL_URI: /^tel:((?:\+[\d().-]*\d[\d().-]*|[0-9A-F*#().-]*[0-9A-F*#][0-9A-F*#().-]*(?:;[a-z\d-]+(?:=(?:[a-z\d\[\]\/:&+$_!~*'().-]|%[\dA-F]{2})+)?)*;phone-context=(?:\+[\d().-]*\d[\d().-]*|(?:[a-z0-9]\.|[a-z0-9][a-z0-9-]*[a-z0-9]\.)*(?:[a-z]|[a-z][a-z0-9-]*[a-z0-9])))(?:;[a-z\d-]+(?:=(?:[a-z\d\[\]\/:&+$_!~*'().-]|%[\dA-F]{2})+)?)*(?:,(?:\+[\d().-]*\d[\d().-]*|[0-9A-F*#().-]*[0-9A-F*#][0-9A-F*#().-]*(?:;[a-z\d-]+(?:=(?:[a-z\d\[\]\/:&+$_!~*'().-]|%[\dA-F]{2})+)?)*;phone-context=\+[\d().-]*\d[\d().-]*)(?:;[a-z\d-]+(?:=(?:[a-z\d\[\]\/:&+$_!~*'().-]|%[\dA-F]{2})+)?)*)*)$/,

		RE_ISO_FORMAT_PATTERN: "yyyy-MM-dd'T'HH:mm:ssZ",

		// ----------------------
		// Misc
		// ----------------------

		PX: "px"

	};

	
	return Constants;

});
