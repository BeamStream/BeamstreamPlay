ShareButtonView = Backbone.View.extend({
    tagName: 'ul',
    id: 'social_buttons',

    events: {
        "click a": "clicked"
    },

    initialize: function() {
        this.source = $('#share_button').html();
        this.template = Handlebars.compile(this.source);
        this.render();
    },

    clicked: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget);
        var id = target.data('id');
        var model = this.collection.get(id);
        var name = model.get('name');
        target.toggleClass('active');
        model.toggleActive();
    },

    render: function() {
        var el = $(this.el);
        var template = this.template;
        this.collection.each(function(model) {
            var html = template({
                'id': model.get('id'),
                'name': model.get('name')
            });
            el.append(html);
        });
        return this;
    },

    getActiveButtonNames: function() {
        var actives = [];
        this.collection.each(function(model) {
            if (model.get('active')) {
                actives.push(model.get('name'));
            }
        });
        return actives;
    }
});

var SocialButtons = new ShareButtonCollection([
  {id: 1, name: 'facebook'},
  {id: 2, name: 'twitter'},
  {id: 3, name: 'linkedin'},
  {id: 4, name: 'google'}]);

var SocialButtonView = new ShareButtonView({collection: SocialButtons});

$('#social_buttons').html(SocialButtonView.el);


// Template
/*
<script type="text/x-handlebars-template" id="share_button">
  <li>
      <a id="{{name}}" class="btn btn-flat" href="#{{name}}" data-original-title="" data-id="{{id}}">
    <i class="icon-middle-{{name}}">{{name}}</i>
    </a>
    </li>
</script>
<div id="social_buttons"></div>
*/
