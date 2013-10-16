define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/Survey.html',
    'model/MediaQuery',
    'foundation-reveal'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelMediaQuery
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function() {
            // render template
            this.setElement($(this.template()));

            //this.open();
        },

        open: function() {
            this.$el.foundation('reveal', 'open');

            $('body').foundation('reveal', 'events', {
                bg : $('.reveal-modal-bg')
            });
        },

        close: function() {
            this.$el.foundation('reveal', 'close');
        }
    });
});
