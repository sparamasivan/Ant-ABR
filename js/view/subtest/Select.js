define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/Select.html',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            this.setElement(this.template({
                options: this.options.options,
                message: this.options.message,
                description: this.options.description
            }));

            // IE8 doesn't support :last-child, so we'll add "last" class to last element
            this.$el.find('.options .option').last().addClass('last');

            this.select(this.options.selectedIndex || 0, !!this.options.selectedIsBad);

            this.$el.appendTo(parent);

            this.$el.tooltip({
                content: {
                    text: this.$el.find('.description')
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    target: this.$el.find('.widget-indicator')
                },
                style: {
                    classes: 'message-tooltip'
                }
            });
        },

        select: function(selectedIndex, isBad) {
            var elOptions = this.$el.find('.options .option'),
                elIndicators = elOptions.find('.widget-indicator');

            elOptions.removeClass('selected');
            elIndicators.removeClass('bad');

            elOptions.eq(selectedIndex)
                .addClass('selected')
                .find('.widget-indicator')
                .addClass(function() {
                    if (isBad) return 'bad';
                });
        }
    });
});
