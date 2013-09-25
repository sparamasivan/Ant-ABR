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
    var GROUP_TYPES = {
        fighter: {
            min: 60,
            max: 70
        },
        defender: {
            min: 30,
            max: 40
        },
        watcher: {
            min: 0.5,
            max: 2
        }
    };

    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelTestCbc)) {
                throw new Error('model not an instanceof CompleteBloodCount');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var self = this,
                templateConfig = {
                    species: this.model.getReport().getPatientSpecies()
                };

            $.each(GROUP_TYPES, function(type, config) {
                var percentage = self.model.getWbcCellPercentageByGroupType(type),
                    isBad = (percentage < config.min || percentage > config.max) ? true : false;

                templateConfig[type] = {
                    percentage: percentage,
                    min: config.min,
                    max: config.max,
                    isBad: isBad
                }
            })
            
            // render template
            this.setElement($(this.template(templateConfig)));

            this.$el.appendTo(parent);
        }
    });
});

