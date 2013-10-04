define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/Thyroxine.html',
    'view/subtest/Range'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestRange
) {
    return ViewTestBase.extend({
        title: 'T4',

        templateContent: Handlebars.compile(Template),
        
        render: function(parent) {
            var view,
                patient = this.model.getReport().getDataPatient();

            $.extend(this._overview, {
                descriptionTemplate: 'T4 measures how much of the hormone thyroxine is in {{{patient.name}}}.',
                moreTemplate: 'This hormone is produced in the thyroid gland and helps regulate {{{patient.name}}}’s growth and metabolism. It circulates through the body and tells the organs and systems how to use energy and how fast to work.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render range
            view = new ViewSubtestRange({
                model: this.model.getModelRange(),
                name: this.model.getReport().getDataPatient().name,
                classes: 'single-line-label',
                message: {
                    good: Handlebars.compile('{{{patient.name}}}’s T4 level is within expected range.')({patient: patient}),
                    bad: Handlebars.compile('{{{patient.name}}}’s T4 level is outside the expected range.')({patient: patient})
                },
                description: {
                    good: Handlebars.compile('{{{patient.name}}}’s thyroid is functioning correctly.')({patient: patient}),
                    bad: Handlebars.compile('This could be due to a variety of causes, further testing may be required. ')({patient: patient})
                }
            });

            view.render(this.$elContent.find('.subtest-container'));
        }
    });
});
