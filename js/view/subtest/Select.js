define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/Select.html'
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
        },

        select: function(selectedIndex, isBad) {
            var elOptions = this.$el.find('.options .option');

            elOptions.removeClass('selected bad');

            elOptions.eq(selectedIndex)
                .addClass('selected')
                .addClass(function() {
                    if (isBad) return 'bad';
                });
        }
    });
});
