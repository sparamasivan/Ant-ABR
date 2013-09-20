define([
    'jquery',
    'backbone',
    'handlebars',
    'model/subtest/Boolean',
    'text!template/subtest/Boolean.html',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ModelSubtestBoolean,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelSubtestBoolean)) {
                throw new Error('model not an instanceof ModelSubtestBoolean');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var opLabel = this.model.getValueText().split(' ')[0],
                // TODO: not sure what this logic is for
                isParasite = (this.model.getLabel()).toLowerCase().match(/parasite #/);

            // render template
            this.setElement($(this.template({
                label: (!isParasite) ? this.model.getLabel() : opLabel,
                detected: this.model.getValue(),
                message: (!isParasite) ? this.model.getMessage() : opLabel,
                description: this.model.getDescription()
            })));

            this.$el.appendTo(parent);

            this.$el.tooltip({
                content: {
                    text: this.$el.find('.description')
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    target: this.$el.find('.icon')
                },
                style: {
                    classes: 'view-subtest-boolean-tooltip'
                }
            });
        }
    });
});
