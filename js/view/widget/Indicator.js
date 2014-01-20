define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/Indicator.html'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            this.setElement($(this.template({
                isBad: this.options.isBad,
                isBig: this.options.isBig,
                isPrintSmall: this.options.isPrintSmall
            })));

            // append to parent
            this.$el.appendTo(parent);
        },

        setIsBad: function(isBad) {
            this.options.isBad = isBad;
            this.$el.toggleClass('bad', isBad);
        }
    });
});
