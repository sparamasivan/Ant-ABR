define([
    'jquery',
    'backbone',
    'text!template/animation/Base.html'
], function(
    $,
    Backbone,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            // render template
            this.setElement($(this.template()));

            this.$elContent = this.$el.find('.animation');

            this.$el.appendTo(parent);
        },

        animate: function() {
            this.$elContent.find('.sticker').removeClass('active').addClass('active');
        }
    });
});
