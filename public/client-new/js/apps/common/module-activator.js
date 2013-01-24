var Module = (typeof module !== "undefined" && module.exports) || {};

(function(exports){
	exports.loadModule= function(domElement) {
		var element = $(domElement),
		moduleName = element.data("module");
		require([moduleName], function(Module) {

			//Instantiating class 
			//module.init(element);
			return new Module(_.extend({}, {el:element}));
		});
	};
	exports.execute= function(element) {
		var element = element || $("html"),
		dataModules = $("[data-module]", element);
		_.each(dataModules, exports.loadModule);
		
	}
})(Module);