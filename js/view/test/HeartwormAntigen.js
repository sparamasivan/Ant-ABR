define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/HeartwormAntigen.html',
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
        title: 'HEARTWORM',

        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: 'We tested {{patient.name}} for heartworm, a parasitic worm transmitted by mosquitos.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render all tests
            view = new ViewSubtestBoolean({
                model: this.model.getAllTestCodes()[0]
            });

            view.render(self.$elContent.find('.boolean-container'));
        }
    });
});

