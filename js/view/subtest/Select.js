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
                message: this._getMessage(),
                description: this._getDescription()
            }));
            
            // IE8 doesn't support :last-child, so we'll add "last" class to last element
            this.$el.find('.options .option').last().addClass('last');

            this._select(this.options.selectedIndex || 0, !!this.options.selectedIsBad);

            this.$el.appendTo(parent);

            this.$el.tooltip({
                content: {
                    text: this.$el.find('.description')
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    target: this.$el.find('.selected .widget-indicator')
                },
                style: {
                    classes: 'message-tooltip'
                }
            });
        },

        _select: function(selectedIndex, isBad) {
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
        },

        _getMessage: function() {
            switch(typeof this.options.message) {
                case 'string':
                    return this.options.message;

                case 'object':
                    return this.options.message[(this.options.selectedIsBad) ? 'bad' : 'good'];

                default:
                    return null;
            }
        },

        _getDescription: function() {
            switch(typeof this.options.description) {
                case 'string':
                    return this.options.description;

                case 'object':
                    return this.options.description[(this.options.selectedIsBad) ? 'bad' : 'good'];

                default:
                    return null;
            }
        }
    });
});
