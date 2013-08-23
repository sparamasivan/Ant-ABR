define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/FelvFiv.html',
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
                heading: this.getHeadingTemplate(),
                text: this.getTextTemplate()
            });

            this._viewTestOverview.render(this.$elContent.find('.test-overview'));

            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                view = new ViewSubtestBoolean({
                    model: subtestModel
                });

                view.render(self.$elContent.find('.boolean-container').eq(i));
            });
        },

        refresh: function() {
            this._viewTestOverview.refresh();
        },

        getTextTemplate: function() {
            var heading = [];

            if (this.model.hasFelvTest()) {
                heading.push('FeLV stands for Feline Leukemia Virus.');
            }

            if (this.model.hasFivTest()) {
                heading.push('FIV stands for Feline Immunodeficiency Virus.');
            }

            return Handlebars.compile(heading.join(' '));
        },

        getHeadingTemplate: function() {
            var text;

            if (this.model.hasFelvTest() && this.model.hasFivTest()) {
                // both tests present
                text = 'We tested {{patient.name}} for the presence of FeLV and FIV viruses.';
            } else if (this.model.hasFelvTest()) {
                text = 'We tested {{patient.name}} for the presence of FeLV viruse.';
            } else {
                text = 'We tested {{patient.name}} for the presence of FIV viruse.';
            }

            return Handlebars.compile(text);
        },

        getTitle: function() {
            if (this.model.hasFelvTest() && this.model.hasFivTest()) {
                return 'FeLV & FIV';
            } else if (this.model.hasFivTest()) {
                return 'FIV';
            } else if (this.model.hasFelvTest()) {
                return 'FeLV';
            } else {
                return this.model.getTitle();
            }
        }
    });
});
