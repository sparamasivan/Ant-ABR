define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/TypesOfCell2.html',
    'model/test/CompleteBloodCount'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelTestCbc
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelTestCbc)) {
                throw new Error('model not an instanceof CompleteBloodCount');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            
            // render template
            this.setElement($(this.template({
                species: this.model.getReport().getPatientSpecies(),
                fighter: {
                    percentage: this.model.getWbcCellPercentageByGroupType('fighter'),
                    isBad: false
                },
                defender: {
                    percentage: this.model.getWbcCellPercentageByGroupType('defender'),
                    isBad: false
                },
                watcher: {
                    percentage: this.model.getWbcCellPercentageByGroupType('watcher'),
                    isBad: false
                }
            })));

            this.$el.appendTo(parent);
        }
    });
});

