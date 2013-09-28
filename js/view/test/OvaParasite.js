define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/OvaParasite.html',
    'view/subtest/pod/Boolean'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestBoolean
) {
    var giardiaExist = 0;

    return ViewTestBase.extend({
        title: 'OVA & PARASITES',

        templateContent: Handlebars.compile(Template),

        templateBooleanContainer: Handlebars.compile(
            '<div class="yui3-u-1-3 yui3-u-1-2-small-tablet yui3-u-1-2-phone">' +
                '<div class="yui3-u-c">' +
                    '<div class="boolean-container"></div>' +
                '</div>' +
            '</div>'
        ),

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: 'We checked {{{patient.name}}}’s stool for young parasites and eggs.',
                moreTemplate: 'These parasites are found in the intestine and are the most common and preventable form of infectious disease in dogs and cats.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent());

            //v
            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                if(subtestModel.getLabel().toLowerCase().match(/giardia*/) && subtestModel.getValueText().toLowerCase().match(/pos*/)){giardiaExist=1}
            });

            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                if(subtestModel.getLabel().toLowerCase().match(/giardia*/) && subtestModel.getValueText().toLowerCase().match(/neg*/) ){}
                else if(subtestModel.getLabel().toLowerCase().match(/giardia*/) && subtestModel.getValueText().toLowerCase().match(/pos*/)){
                    view = new ViewSubtestBoolean({
                      model: subtestModel
                     });

                     view.render(self._generateBooleanContainer());
                }
                else if(subtestModel.getValueText().toLowerCase() == 'positive'){}
                else if(giardiaExist == 0){
                    view = new ViewSubtestBoolean({
                      model: subtestModel
                     });

                     view.render(self._generateBooleanContainer());
                } else{}

            });
        },

        _generateBooleanContainer: function() {
            var el = $(this.templateBooleanContainer());

            this.$elContent.find('.results-container').append(el);

            return el.find('.boolean-container');
        }
    });
});
