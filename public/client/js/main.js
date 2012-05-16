var AppRouter = Backbone.Router.extend({

    routes:{
    	
        "":"home",
        "school":"schoolReg",
        "class":"classReg",
        "profile":"profileReg"
        
    },

    initialize:function () {
       
    },

    home: function() {
    	console.log('Here');
    },

   
    /**
     * display School Info screen
     */
    schoolReg:function () {
    	
    	 if (!this.schoolView) {
             this.schoolView = new SchoolView();
             this.schoolView.render();
             
         }
         $('#register-step-school').html(this.schoolView.el);  
         
         /* hide some fields on page load */
         $('#degree-exp-'+current).hide();
     	 $('#cal-'+current).hide();
     	 
     	 $(".modal select:visible").selectBox();
         $('.modal .datepicker').datepicker();
    },

    
    /**
     * display Class Info screen
     */
    classReg:function () {
    
   	    if (!this.classView) {
            this.classView = new ClassView();
            this.classView.render();
            
        }
        $('#register-step-school').html(this.classView.el);
        
        $(".modal select:visible").selectBox();
        $('.modal .datepicker').datepicker();
       
   },
    
   /**
    * display Profile Info screen
    */
   profileReg:function () {
    	 
   	  if (!this.profileView) {
            this.profileView = new ProfileView();
            this.profileView.render();
            
      }
      $('#register-step-school').html(this.profileView.el);   
   }
  
});


app = new AppRouter();
Backbone.history.start();

