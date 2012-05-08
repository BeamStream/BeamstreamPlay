window.ProfileView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Profile View');
       // this.template= _.template($("#home").html());
        this.template= _.template($("#tpl-profile-reg").html());
        //this.render();
//        this.template = _.template(tpl.get('school'));
    },

    render:function (eventName) {
      //  $(this.el).html(this.template());
        $(this.el).html(this.template());
        return this;
    }

});