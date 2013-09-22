define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/Accuplex.html',
    'view/subtest/Boolean'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestBoolean
) {
    return ViewTestBase.extend({
        title: 'ACCUPLEX',

        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: 'Some diseases are spread by ticks. We tested {{patient.name}} for signs of exposure to these.'
            });
            
            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

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
