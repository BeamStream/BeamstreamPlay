requirejs.config({
	waitSeconds: 0,
	paths: {
		moduleActivator: 'apps/common/module-activator',
		jquery: '/beamstream-new/lib/jquery-1.7.1.min',
		backbone: 'libs/backbone/backbone-min',
		console: 'libs/console/ba-debug.min',
		underscore: 'libs/underscore/underscore-min.1.4.2',
		handlebars: 'libs/handlebars/handlebars',		
		jqueryUI: 'libs/jquery/jquery-ui-1.8.18.custom.min',		
		i18n: 'libs/i18/i18n',
		placeholder: 'apps/common/html5.placeholder',
		json2: 'apps/common/json2',
		text: 'libs/text/text-min',
		phoneformat: 'apps/common/PhoneFormat',
		container: "view/container.min",
		baseView: "view/baseView.min",
		pageView: "view/pageView.min",
		formView: "view/formView",
		baseModel: "model/baseModel.min",
		baseCollection: "collection/baseCollection.min"
	},
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery', 'json2', 'jqueryUI'],
            exports: 'Backbone'
        },
        'baseView': {
    		deps: ['backbone', 'container']
    	},
    	'pageView': {
    		deps: ['backbone', 'container']
    	},
    	'baseCollection': {
    		deps: ['backbone', 'baseModel']
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
