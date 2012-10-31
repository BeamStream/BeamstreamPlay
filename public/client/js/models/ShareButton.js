ShareButton = Backbone.Model.extend({
    defaults: {
        'active': false
    },
    
    toggleActive: function() {
        this.active = !(this.active);
    }
});
