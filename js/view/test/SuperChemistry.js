define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/SuperChemistry.html',
    'view/subtest/RangeGroup'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestRangeGroup
) {
    return ViewTestBase.extend({
        title: 'CHEMISTRY',

        templateContent: Handlebars.compile(Template),

        _viewSubtestRangeGroup: null,

        render: function(parent) {
            var self = this,
                view;

            $.extend(this._overview, {
                descriptionTemplate: '{{patient.name}}’s body chemistry is unique - like a fingerprint - and remains relatively constant over time.'
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
