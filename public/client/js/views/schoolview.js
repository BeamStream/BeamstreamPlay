window.SchoolView = Backbone.View.extend({

	events: {
	      "click #save": "saveschool",
	      "click #continue": "continuetoclass",
	      
	    },
	
    initialize:function () {
    	
        console.log('Initializing School View');
        this.template= _.template($("#tpl-school-reg").html());

    },

    render:function (eventName) {

        $(this.el).html(this.template());
        return this;
    },
    
    /* save school info. */ 
    saveschool:function () {
    	var schoolDetails = new Array();
    	var i;
    	
    	var schools = new SchoolCollection();
    	
    	for(i=1; i <= current; i++){
    		
    		schoolDetails.push({"school-name": $('#school-name-'+i).val(),
    							"year": $('#year-'+i).val(),
    							"degree-expected":$('#degree-expected-'+i).val(),
    							"major":$('#major-'+i).val(),
    							"degreeprogram":$('#degreeprogram-'+i).val(),
    							});

    	}

    	
    	$.ajax({
            type: 'POST',
            url:"http://localhost/client/api.php",
            data:{ data:schoolDetails },
            dataType:"json",
            success:function(data){
                var template = _.template( $("#tpl-success").html(), data );
                $('#success').html(template);
            }
         });
    	 
      },
      
      
      continuetoclass:function (eventName) {
    	  eventName.preventDefault();        
    	  app.navigate("class", {trigger: true });
      },
 

});
