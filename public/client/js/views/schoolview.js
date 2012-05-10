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
    		
    		var school = new School();
    		school.set({schoolName: $('#school-name-'+i).val(), major: $('#major-'+i).val(), year: $('#year-'+i).val(), degreeExpected: $('#degree-expected-'+i).val(), degree: $('#degreeprogram-'+i).val()});
            schools.add(school);
    	}

    	var schoolinfo = JSON.stringify(schools);

    	$.ajax({
            type: 'POST',
            url:"http://localhost/client/api.php",
            data:{data:schoolinfo},
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
