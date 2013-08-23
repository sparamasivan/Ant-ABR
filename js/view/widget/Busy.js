define([
    'jquery',
    'backbone',
    'handlebars',
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile('<div class="view-widget-busy"><div class="widget"><img src="images/widget/busy/loader.gif" alt=""><span>Loading test results</span></div></div>'),

        render: function(parent) {
            this.setElement($(this.template()));

            // append to parent
            this.$el.appendTo(parent);
        },

        show: function() {
            this.$el.fadeTo(100, 0.7);
        },

        hide: function() {
            this.$el.fadeOut();
        }
    });
});
