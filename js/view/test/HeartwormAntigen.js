define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/HeartwormAntigen.html',
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
        title: 'HEARTWORM',

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
                heading: Handlebars.compile('We tested {{patient.name}} for heartworm, a parasitic worm transmitted by mosquitos.'),
                text: Handlebars.compile('Heartworm is one of the most common infectious diseases – anywhere there are mosquitoes there is a risk of heartworm disease. It lives in the heart and surrounding arteries.')
            });

            this._viewTestOverview.render(this.$elContent.find('.test-overview'));

            // render all tests
            view = new ViewSubtestBoolean({
                model: this.model.getAllTestCodes()[0]
            });

            view.render(self.$elContent.find('.boolean-container'));
        },

        refresh: function() {
            this._viewTestOverview.refresh();
        }
    });
});

