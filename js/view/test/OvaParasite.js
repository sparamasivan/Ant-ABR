define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/OvaParasite.html',
    'view/subtest/Boolean'
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

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: 'We checked {{patient.name}}’s stool for young parasites and eggs.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent());

            //v
            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                if(subtestModel.getLabel().toLowerCase().match(/giardia*/) && subtestModel.getValueText().toLowerCase().match(/pos*/)){giardiaExist=1}
            });


/*
            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                view = new ViewSubtestBoolean({
                    model: subtestModel
                });

                view.render(self.$elContent.find('.boolean-container').eq(i));
            });
*/
            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                if(subtestModel.getLabel().toLowerCase().match(/giardia*/) && subtestModel.getValueText().toLowerCase().match(/neg*/) ){}
                else if(subtestModel.getLabel().toLowerCase().match(/giardia*/) && subtestModel.getValueText().toLowerCase().match(/pos*/)){
                    view = new ViewSubtestBoolean({
                      model: subtestModel
                     });

                     view.render(self.$elContent.find('.boolean-container').eq(i));
                }
                else if(subtestModel.getValueText().toLowerCase() == 'positive'){}
                else if(giardiaExist == 0){
                    view = new ViewSubtestBoolean({
                      model: subtestModel
                     });

                     view.render(self.$elContent.find('.boolean-container').eq(i));
                } else{}

            });

        }
    });
});
