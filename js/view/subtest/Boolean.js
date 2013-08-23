define([
    'jquery',
    'backbone',
    'handlebars',
    'model/subtest/Boolean',
    'text!template/subtest/Boolean.html',
    'text!template/subtest/BooleanParasite.html',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ModelSubtestBoolean,
    Template,
    TemplateParasite
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        templateParasite: Handlebars.compile(TemplateParasite),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelSubtestBoolean)) {
                throw new Error('model not an instanceof ModelSubtestBoolean');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
          var opLabel=this.model.getValueText().split(' ')[0];
          if((this.model.getLabel()).toLowerCase().match(/parasite #/)){
            // render template
            this.setElement($(this.template({
                label: opLabel,
                detected: this.model.getValue()
            })));

            this.$el.appendTo(parent);


            var self = this;
            this.$el2 = $(self.templateParasite({
                title: opLabel,
                description: this.model.getDescription()
            })),
            elDetails = this.$el2.find('.details');


            this.$el.tooltip({
                content: {
                    text: elDetails
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    target: this.$el.find('.icon')
                }
            });

          }else{
            // render template
            this.setElement($(this.template({
                label: this.model.getLabel(),
                detected: this.model.getValue(),
                message: this.model.getMessage(),
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

        }
    });
});
