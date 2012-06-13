BS.ClassStreamView = Backbone.View.extend({

	events : {
       "keyup #class-code" : "populateClasses"
	},

	initialize : function() {
		console.log('Initializing Class Stream View');
		this.source = $("#tpl-class-stream").html();
		this.template = Handlebars.compile(this.source);
		 
	},

	/**
	 * render class Info screen
	 */
	render : function(eventName) {
		 
		var sCount = {
				
				"times" : BS.times
		}
		$(this.el).html(this.template(sCount));
		 
		return this;
	},
	
	/*
	 * populate  List of classes matching that code
	 * 
	 */
	populateClasses :function(){
		var text = $('#class-code').val();
		 $.ajax({
			type : 'POST',
//			url : "http://localhost/Beam2/BeamstreamPlay/public/client/api.php",
			url : "http://localhost:9000/autoPopulateClasses",
			data : {
				data : text
			},
			dataType : "json",
			success : function(data) {
				 console.log($('#class-code').val());
				  
			}
		});
	}
   
	 
});
