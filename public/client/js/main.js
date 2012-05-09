var AppRouter = Backbone.Router.extend({

    routes:{
    	
        "":"home",
        "school":"schoolreg",
        "class":"classreg",
        "profile":"profilereg"
        
    },

    initialize:function () {
       /* this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);

        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });*/
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
//         $('#success').html(template);
         
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