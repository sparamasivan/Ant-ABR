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
            var view;

            $.extend(this._overview, {
                descriptionTemplate: 'T4 measures how much of the hormone thyroxine is in {{patient.name}}.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render range
            view = new ViewSubtestRange({
                model: this.model.getModelRange(),
                name: this.model.getReport().getDataPatient().name,
                skin: 'orange'
            });

            view.render(this.$elContent.find('.subtest-container'));
        }
    });
});
