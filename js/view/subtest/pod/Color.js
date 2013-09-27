define([
    'jquery',
    'backbone',
    'handlebars',
    'view/subtest/pod/Base',
    'text!template/subtest/pod/Color.html',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    Template
) {
    return ViewBase.extend({
        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var content,
                viewSelect;

            ViewBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
            	label: this.options.label,
            	isBad: this.options.isBad,
                message: this._getMessage(),
                description: this._getDescription()
            }));

            this.$el.find('.marker').tooltip({
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
