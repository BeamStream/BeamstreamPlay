define(function(){
	var TemplateManager = {
			templates: {},
			get: function(id, callback){
				var template = this.templates[id];
				if (template) {
					callback(template);
				} else {
					var that = this;
					require(['text!'+id], function(template){
						var $tmpl = template;
						that.templates[id] = $tmpl;
						callback($tmpl);
					});
				}
			},
			getTemplate: function() {
				// namespace.templatesCache is an object ( {} ) defined inside the main app js file
				var 
				needXHR = false, // for callback function
				templateHTML = ""; //template html

				if(!(templateHTML = namespace.templatesCache[template_name])){ //if template is not cached
					templateHTML = (this.helpers.supportLocalStorage) ? localStorage.getItem(template_name) : ""; //if browser supports local storage, check if I can retrieve it

					if(templateHTML === "" || templateHTML === null){ // if I don't have a template (usually, first time), retrieve it by ajax
						needXHR = true;  

						new Request.HTML({ //or jQuery's $.get( url /*, etc */ ) 

							url: namespace.URLS.BASE+"templates/_"+template_name+".tpl", // url of the template file
							onSuccess : function(t, e, html, js){
								namespace.templatesCache[template_name] = html; //cache it
								if(_this.helpers.supportLocalStorage){ //and store it inside local storage, if available
									localStorage.setItem(template_name,html); 
								}
								//call callback      
							}
						}).get();

					}else{ //retrieved by localStorage, let's cache it
						namespace.templatesCache[template_name] = templateHTML;
					}
				}

				if(!needXHR){ // I retrieved template by cache/localstorage, not by Ajax
					//call callback    
				}
			}
	}
	return TemplateManager;
});	
