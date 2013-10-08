define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/SuperChemistry.html',
    'view/subtest/RangeGroup',
    'view/animation/Chemistry'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestRangeGroup,
    ViewAnimation
) {
    return ViewTestBase.extend({
        title: 'CHEMISTRY',

        templateContent: Handlebars.compile(Template),

        _viewSubtestRangeGroup: null,

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: '{{{patient.name}}}’s body chemistry is unique - like a fingerprint - and remains relatively constant over time.',
                moreTemplate: 'A chemistry panel gives us this fingerprint, showing us how all {{{patient.name}}}’s systems work together, so we know {{{patient.name}}}’s expected numbers and can easily identify changes.',
                viewAnimation: new ViewAnimation()
            });
            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            this._viewSubtestRangeGroup = new ViewSubtestRangeGroup({
                models: this.model.getAllTestCodes(),
                patient: this.model.getReport().getDataPatient()
            });

            this._viewSubtestRangeGroup.render(this.$elContent.find('.subtest-container'));
        },

        refresh: function() {
            ViewTestBase.prototype.refresh.apply(this, arguments);
            this._viewSubtestRangeGroup.refresh();
        }
    });
});
