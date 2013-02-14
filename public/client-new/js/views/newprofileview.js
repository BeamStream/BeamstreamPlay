BS.NewProfileView = Backbone.View.extend({ 
             initialize:function(){  
                 console.log("test for new profile")                 
                this.source = $("#newprofileview-tpl").html();
                this.template = Handlebars.compile(this.source);
//                this.pdflisting();       
                },
             
            render:function (eventName) {          	
                $(this.el).html(this.template);
                return this;
                }
})


