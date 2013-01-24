requirejs.config({
	paths: {
		console: 'libs/console/ba-debug.min',
		underscore: 'libs/underscore/underscore.1.4.2',
		handlebars: 'libs/handlebars/handlebars',
		jquery: 'libs/jquery/jquery-1.7.1.min',
		jqueryUI: 'libs/jquery/jquery-ui-1.8.18.custom.min',
		backbone: 'libs/backbone/backbone',
		i18n: 'libs/i18/i18n',
		placeholder: 'apps/common/html5.placeholder',
		json2: 'apps/common/json2',
		moduleActivator: 'apps/common/module-activator',
		text: 'libs/text/text',
		phoneformat: 'apps/common/PhoneFormat',
		baseView: "view/baseView",
		formView: "view/formView",
		baseModel: "model/baseModel",
		baseCollection: "collection/baseCollection"
	},
    shim: {
    	'baseView': {
    		deps: ['backbone']
    	},
        'backbone': {
            deps: ['underscore', 'jquery', 'json2', 'jqueryUI'],
            exports: 'Backbone'
        },
		'placeholder': {
			deps: ['jquery']
		},
		'jqueryUI': {
			deps: ['jquery']
		}
    }
});

require({
	baseDir: '.'
  },
  ['apps/base'],
  function(){
	  Module.execute();
  }
)
