 /***
	 * BeamStream
	 *
	 * Author                : Cuckoo Anna (cuckoo@toobler.com)
	 * Company               : Toobler
	 * Email:                : info@toobler.com
	 * Web site              : http://www.toobler.com
	 * Created               : 17/January/2013
	 * Description           : Backbone view for registration
	 * ==============================================================================================
	 * Change History:
	 * ----------------------------------------------------------------------------------------------
	 * Sl.No.  Date   Author   Description
	 * ----------------------------------------------------------------------------------------------
	 *
	 * 
     */
	BS.RegistrationView = Backbone.View.extend({
	
		events : {
			"click #registeration":"register",
                        "click .menu-pic":"getValue",
                        "focusout .home_reg":"valdation"
		},
		initialize : function() {
			
			console.log('Initializing Basic Registration View');
			this.source = $("#tpl-userregistration_home").html();
			this.template = Handlebars.compile(this.source);
	
		},
		
		render : function(eventName) {
			
			 $(this.el).html(this.template);
			 return this;

//			
		},
                register: function(eventName){
                    eventName.preventDefault();
                    console.log("registre");
             

                },
                getValue:function(eventName){
                      eventName.preventDefault();
                      console.log("i am");
//                      console.log(eventName.currentTarget.id);
                      $("#usertype").val(eventName.currentTarget.id);
                      console.log($('input#usertype').val());
                },
                valdation:function(eventName,param){
                     eventName.preventDefault();
                     var id=eventName.currentTarget.id
                     var value=$('#'+id).val();   
//                     console.log(id+":"+value);
                      var map = {};
                        map[id] = value;
                        
                                 this.model.on("error", function(model, error) {                 
//                  console.log(error);
                 
                  _.each(error, function(eror) {
//                      console.log(eror);
                       console.log(eror.error);
                  })
                });
                        this.model.set(map);
//                      console.log($('#'+id).val());
                          var regDetails = JSON.stringify( this.model);
//                console.log("modeo -"+regDetails);
               console.log(  this.model.get("mailid"));
                      
                }
            
                
            
            
            
            
            

	});
