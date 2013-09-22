define([
    'jquery',
    'backbone',
    'handlebars',
    'view/subtest/pod/Select',
    'model/subtest/Boolean'
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    ModelSubtestBoolean
) {
    return ViewBase.extend({
        constructor: function(config) {
            if (!config || !(config.model instanceof ModelSubtestBoolean)) {
                throw new Error('model not an instanceof ModelSubtestBoolean');
            }

            ViewBase.apply(this, arguments);
        },

        render: function(parent) {
            var opLabel = this.model.getValueText().split(' ')[0],
                // TODO: not sure what this logic is for
                isParasite = (this.model.getLabel()).toLowerCase().match(/parasite #/);

            $.extend(this.options, {
                title: (!isParasite) ? this.model.getLabel() : opLabel,
                message: (!isParasite) ? this.model.getMessage() : opLabel,
                description: this.model.getDescription(),
                options: [
                    'Clear',
                    'Detected'
                ],
                selectedIndex: (this.model.getValue()) ? 1 : 0,
                selectedIsBad: (this.model.getValue()) ? true : false
            });

            return ViewBase.prototype.render.apply(this, arguments);
        }
    });
});
