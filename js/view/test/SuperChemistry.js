define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/SuperChemistry.html',
    'view/widget/TestOverview',
    'view/subtest/RangeGroup'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewWidgetTestOverview,
    ViewSubtestRangeGroup
) {
    return ViewTestBase.extend({
        title: 'CHEMISTRY',

        templateContent: Handlebars.compile(Template),

        _viewSubtestRangeGroup: null,

        _viewTestOverview: null,

        render: function(parent) {
            var self = this,
                view;

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render test overview
            this._viewTestOverview = new ViewWidgetTestOverview({
                model: this.model,
                heading: Handlebars.compile('{{patient.name}}’s body chemistry is unique - like a fingerprint - and remains relatively constant over time.'),
                text: Handlebars.compile('A chemistry panel gives us this fingerprint, showing us how all {{patient.name}}’s systems work together, so we know {{patient.name}}’s expected numbers and can easily identify changes.')
            });

            this._viewTestOverview.render(this.$elContent.find('.test-overview'));

            this._viewSubtestRangeGroup = new ViewSubtestRangeGroup({
                models: this.model.getAllTestCodes(),
                patient: this.model.getReport().getDataPatient()
            });

            this._viewSubtestRangeGroup.render(this.$elContent.find('.subtest-container'));
        },

        refresh: function() {
            this._viewSubtestRangeGroup.refresh();
            this._viewTestOverview.refresh();
        }
    });
});
