define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/Accuplex.html',
    'view/subtest/pod/Boolean',
    'view/animation/Accuplex',
    'jquery-equal-heights'
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
        title: 'ACCUPLEX',

        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                view,
                elPodHeaders = $();

            $.extend(this._overview, {
                descriptionTemplate: 'Some diseases are spread by ticks. We tested {{{patient.name}}} for signs of exposure to these.',
                moreTemplate: 'Contrary to popular belief, ticks don’t just live in certain geographic areas – ticks are found all over the world and can be easily transported on clothing and other animals.',
                viewAnimation: new ViewAnimation()
            });
            
            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                view = new ViewSubtestBoolean({
                    model: subtestModel
                });

                view.render(self.$elContent.find('.boolean-container').eq(i));

                elPodHeaders = elPodHeaders.add(view.getHeaderEl());
            });

            // equalize pod header heights
            elPodHeaders.equalHeights();
        }
    });
});
