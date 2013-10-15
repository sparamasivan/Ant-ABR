define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/Select.html',
    'view/widget/Indicator',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    WidgetIndicator
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        _wIndicators: null,

        render: function(parent) {
            var self = this,
                elOptions;

            this.setElement(this.template({
                options: this.options.options,
                message: this._getMessage(),
                description: this._getDescription()
            }));

            elOptions = this.$el.find('.options .option');

            // render indicators
            this._wIndicators = [];

            elOptions.each(function(i) {
                var wIndicator = new WidgetIndicator();
                wIndicator.render($(this).find('.indicator'));
                self._wIndicators[i] = wIndicator;
            })
            
            // IE8 doesn't support :last-child, so we'll add "last" class to last element
            elOptions.last().addClass('last');

            this._select(this.options.selectedIndex || 0, !!this.options.selectedIsBad);

            this.$el.appendTo(parent);

            this.$el.find('.selected .widget-indicator').tooltip({
                content: {
                    text: this.$el.find('.description')
                },
                position: {
                    my: 'top center',
                    at: 'bottom center'
                },
                style: {
                    classes: 'message-tooltip'
                }
            });
        },

        _select: function(selectedIndex, isBad) {
            var elOptions = this.$el.find('.options .option'),
                elIndicators = elOptions.find('.indicator');

            elOptions
                .removeClass('selected')
                .eq(selectedIndex).addClass('selected');

            this._wIndicators[selectedIndex].setIsBad(isBad);
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
