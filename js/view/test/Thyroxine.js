define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/Thyroxine.html',
    'view/widget/TestOverview',
    'view/subtest/Range'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewWidgetTestOverview,
    ViewSubtestRange
) {
    return ViewTestBase.extend({
        title: 'T4',

        templateContent: Handlebars.compile(Template),

        _viewTestOverview: null,

        render: function(parent) {
            var view;

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render test overview
            this._viewTestOverview = new ViewWidgetTestOverview({
                model: this.model,
                heading: Handlebars.compile('T4 measures how much of the hormone thyroxine is in {{patient.name}}.'),
                text: Handlebars.compile('This hormone is produced in the thyroid gland and helps regulate {{patient.name}}’s growth and metabolism. It circulates through the body and tells the organs and systems how to use energy and how fast to work.')
            });

            this._viewTestOverview.render(this.$elContent.find('.test-overview'));

            // render range
            view = new ViewSubtestRange({
                model: this.model.getModelRange(),
                name: this.model.getReport().getDataPatient().name,
                skin: 'orange',
                //unitOfMeasure: 'G/DL'  //orig
                //unitOfMeasure: 'ug/dL'
                unitOfMeasure: this.model.getReport().getDataTests().unitOfMeasure
            });

            view.render(this.$elContent.find('.subtest-container'));
        },

        refresh: function() {
            this._viewTestOverview.refresh();
        }
    });
});
