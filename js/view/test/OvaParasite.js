define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/OvaParasite.html',
    'view/widget/TestOverview',
    'view/subtest/Boolean'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewWidgetTestOverview,
    ViewSubtestBoolean
) {
    var giardiaExist = 0;

    return ViewTestBase.extend({
        title: 'OVA & PARASITES',

        templateContent: Handlebars.compile(Template),

        _viewTestOverview: null,

        render: function(parent) {
            var self = this,
                view;

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent());

            // render test overview
            this._viewTestOverview = new ViewWidgetTestOverview({
                model: this.model,
                heading: Handlebars.compile('We checked {{patient.name}}’s stool for young parasites and eggs.'),
                text: Handlebars.compile('These parasites are found in the intestine and are the most common and preventable form of infectious disease in dogs and cats.')
            });

            this._viewTestOverview.render(this.$elContent.find('.test-overview'));


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

        },

        refresh: function() {
            this._viewTestOverview.refresh();
        }
    });
});
