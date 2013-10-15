define([
    'jquery',
    'backbone',
    'handlebars',
    'view/subtest/pod/Base',
    'text!template/subtest/pod/Color.html',
    'view/widget/Indicator',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    Template,
    WidgetIndicator
) {
    return ViewBase.extend({
        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var content,
                viewSelect,
                wIndicator;

            ViewBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
            	label: this.options.label,
                message: this._getMessage(),
                description: this._getDescription()
            }));

            wIndicator = new WidgetIndicator({
                isBad: this.options.isBad
            });
            wIndicator.render(this.$elContent.find('.indicator'));

            this.$elContent.find('.indicator').tooltip({
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

        _getMessage: function() {
            switch(typeof this.options.message) {
                case 'string':
                    return this.options.message;

                case 'object':
                    return this.options.message[(this.options.isBad) ? 'bad' : 'good'];

                default:
                    return null;
            }
        },

        _getDescription: function() {
            switch(typeof this.options.description) {
                case 'string':
                    return this.options.description;

                case 'object':
                    return this.options.description[(this.options.isBad) ? 'bad' : 'good'];

                default:
                    return null;
            }
        }
    });
});
