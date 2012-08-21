BS.NewSchoolView = Backbone.View.extend({

	events: {
		"change select.graduated" : "showFields",
		"change select.degreepgm" : "addOtherDegree",
		"click #close-screen" : "closeScreen"
	 },
	
    initialize:function () {
    	
        console.log('Initializing New School View');
		this.source = $("#one-new-school").html();
		this.template = Handlebars.compile(this.source);
    },

     
    
    /**
     * render school Info screen
     */
    render:function (eventName) {
    	$(this.el).html(this.template);
        return this;
//        $('#new-school-view').html(this.template);
        
    },

    
    /**
     * to display 'degree expected' or 'date' field
     */
     showFields:function (eventName) {
       
   	      var id = eventName.target.id;
   	      var dat='#'+id;
		  var value = $('#graduated').val();
		  if(value == "attending" || value == "no")
		  {
				$('#cal').hide();
				$('#degree-exp').show();
				$(".modal select:visible").selectBox();
		  }
		  else if(value == "yes")
		  {
				$('#degree-exp').hide();
				
				$('.datepicker').css('z-index','99999');
				$('#cal').show();
				$('.modal .datepicker:visible').datepicker();
		  }
		  else
		  {
				$('#degree-exp').hide();
				$('#cal').hide();
		  }
		  
   	     
     },
	      
     /**
      * add text box field a enter degree when we choose 'Other' from  Degre Program  
      */
     addOtherDegree:function(eventName){
   	  var id = eventName.target.id;
   	  if($('#'+id).val()== "Other")
   	  {
   		  $('#other-degrees').show();
   	  }
   	  else
   	  {
   		  $('#other-degrees').hide();
   	  }
   	  
   	  
     },
     closeScreen :function(eventName){
    	 eventName.preventDefault(); 
    	 $('#new-school-view').children().detach(); 
     }

});
