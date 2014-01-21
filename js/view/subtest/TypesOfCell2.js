define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/TypesOfCell2.html',
    'model/test/CompleteBloodCount',
    'view/widget/Indicator',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelTestCbc,
    WidgetIndicator
) {
    var GROUP_TYPES = {
        fighter: {
            canine: {
                min: 60,
                max: 77
            },
            feline: {
                min: 35,
                max: 78
            },
            message: {
                good: '{{{patient.name}}}’s has an expected number of infection fighters.',
                bad: '{{{patient.name}}}’s number of infection fighters are outside the expected range.'
            },
            description: {
                good: 'These cells fight bacterial infection and inflammation at the site – when you see puss form in a cut that is the infection fighters in action!',
                bad: 'While we expect infection fighters to make up the majority of {{{patient.name}}}’s white blood cells, it is important that they stay balanced appropriately with the other cells.'
            }
        },
        defender: {
            canine: {
                min: 15,
                max: 40
            },
            feline: {
                min: 21,
                max: 49
            },
            message: {
                good: '{{{patient.name}}}’s has an expected number of immune defenders.',
                bad: '{{{patient.name}}}’s number of infection fighters are outside the expected range.'
            },
            description: {
                good: 'These cells strengthen the immune system by fighting viral infections and remembering them, so if the virus returns, the cells recognize it and make antibodies to destroy it.',
                bad: 'It is important that immune defenders stay balanced appropriately with the other types of white blood cells.'
            }
        },
        watcher: {
            canine: {
                min: 0,
                max: 11
            },
            feline: {
                min: 0,
                max: 13
            },
            message: {
                good: '{{{patient.name}}}’s has an expected number of allergen watchmen.',
                bad: '{{{patient.name}}}’s number of allergen watchmen are outside the expected range.'
            },
            description: {
                good: 'These cells keep a lookout for any allergens that might enter {{{patient.name}}}’s system. An allergen can be anything, from pollen to parasites, that causes the body to react, becoming irritated or inflamed.',
                bad: 'While we expect allergen watchmen to make up the smallest amount of {{{patient.name}}}’s white blood cells, it is important that they stay balanced appropriately with the other cells.'
            }
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
                species = this.model.getReport().getPatientSpecies(),
                templateConfig = {
                    species: species
                },
                patient = this.model.getReport().getDataPatient();

            $.each(GROUP_TYPES, function(type, config) {
                var percentage = self.model.getWbcCellPercentageByGroupType(type),
                    min = config[species].min,
                    max = config[species].max,
                    isBad = (percentage < min || percentage > max) ? true : false;

                templateConfig[type] = {
                    percentage: percentage,
                    min: min,
                    max: max,
                    isBad: isBad,
                    message: Handlebars.compile(config.message[(isBad) ? 'bad' : 'good'])({patient: patient}),
                    description: Handlebars.compile(config.description[(isBad) ? 'bad' : 'good'])({patient: patient})
                }
            })
            
            // render template
            this.setElement($(this.template(templateConfig)));

            this.$el.appendTo(parent);

            // render indicators
            this.$el.find('.indicator').each(function() {
                var vIndicator = new WidgetIndicator({
                    isBad: $(this).hasClass('bad'),
                    isPrintSmall: true
                });

                vIndicator.render($(this));
            });

            $.each(GROUP_TYPES, function(type, config) {
                var el = self.$el.find('.' + type);

                el.find('.widget-indicator').tooltip({
                    content: {
                        text: el.find('.description')
                    },
                    position: {
                        my: 'top center',
                        at: 'bottom center'
                    },
                    style: {
                        classes: 'message-tooltip'
                    }
                });
            });
        }
    });
});

