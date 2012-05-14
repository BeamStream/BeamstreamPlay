var AppRouter = Backbone.Router.extend({

    routes:{
    	
        "":"home",
        "school":"schoolreg",
        "class":"classreg",
        "profile":"profilereg"
        
    },

    initialize:function () {
       
    },

    home: function() {
    	console.log('Here');
    },

   
    // School registration
    schoolreg:function () {
    	
    	 if (!this.schoolView) {
             this.schoolView = new SchoolView();
             this.schoolView.render();
             
         }
         $('#register-step-school').html(this.schoolView.el);  
         
         // hide some fields on page load
         $('#degree-exp-'+current).hide();
     	 $('#cal-'+current).hide();
//         $("#register-step-school").modal();
         
//         $(".modal select:visible").selectBox();
//         $('.modal .datepicker:visible').datepicker();
         
    },

    
    
    classreg:function () {
    
   	 if (!this.classView) {
            this.classView = new ClassView();
            this.classView.render();
            
        }
        $('#register-step-school').html(this.classView.el);   
        
   },
    
    
   profilereg:function () {
    	 
   	 if (!this.profileView) {
            this.profileView = new ProfileView();
            this.profileView.render();
            
        }
        $('#register-step-school').html(this.profileView.el);   
   }
  
});
 app = new AppRouter();
Backbone.history.start();

/*tpl.loadTemplates(['home', 'contact', 'header', 'employee-full', 'employee-details', 'employee-list-item','school'],
    function () {
        app = new AppRouter();
        Backbone.history.start();
    });*/