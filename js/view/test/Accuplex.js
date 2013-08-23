define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/Accuplex.html',
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
    return ViewTestBase.extend({
        title: 'ACCUPLEX',

        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                view;

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render test overview
            view = new ViewWidgetTestOverview({
                model: this.model,
                heading: Handlebars.compile('Some diseases are spread by ticks. We tested {{patient.name}} for signs of exposure to these.'),
                text: Handlebars.compile('Contrary to popular belief, ticks don’t just live in certain geographic areas – ticks are found all over the world and can be easily transported on clothing and other animals.')
            });

            view.render(this.$elContent.find('.test-overview'));

            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                view = new ViewSubtestBoolean({
                    model: subtestModel
                });

                view.render(self.$elContent.find('.boolean-container').eq(i));
            });
        }
    });
});
