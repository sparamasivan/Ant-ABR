define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/Busy.html'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            this.setElement($(this.template()));

            // append to parent
            this.$el.appendTo(parent);
        },

        show: function() {
            this.$el.fadeTo(100, 1);
        },

        hide: function() {
            this.$el.fadeOut();
        }
    });
});
