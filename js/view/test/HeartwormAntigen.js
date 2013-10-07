define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/HeartwormAntigen.html',
    'view/subtest/pod/Boolean',
    'view/animation/Heartworm'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestBoolean,
    ViewAnimation
) {
    return ViewTestBase.extend({
        title: 'HEARTWORM',

        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: 'We tested {{{patient.name}}} for heartworm, a parasitic worm transmitted by mosquitos.',
                moreTemplate: 'Heartworm is one of the most common infectious diseases – anywhere there are mosquitoes there is a risk of heartworm disease. It lives in the heart and surrounding arteries.',
                viewAnimation: new ViewAnimation()
            });

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render all tests
            view = new ViewSubtestBoolean({
                model: this.model.getModelHeartwormBoolean()
            });

            view.render(self.$elContent.find('.boolean-container'));
        }
    });
});

