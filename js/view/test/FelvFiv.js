define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/FelvFiv.html',
    'view/subtest/pod/Boolean'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestPodBoolean
) {
    return ViewTestBase.extend({
        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                view;

            this._overview.descriptionTemplate = this._getDescriptionTemplate();

            ViewTestBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent());

            // render all tests
            $.each(this.model.getAllTestCodes(), function(i, subtestModel) {
                view = new ViewSubtestPodBoolean({
                    model: subtestModel
                });

                view.render(self.$elContent.find('.boolean-container').eq(i));
            });
        },

        _getDescriptionTemplate: function() {
            var text;

            if (this.model.hasFelvTest() && this.model.hasFivTest()) {
                // both tests present
                text = 'We tested {{patient.name}} for the presence of FeLV and FIV viruses.';
            } else if (this.model.hasFelvTest()) {
                text = 'We tested {{patient.name}} for the presence of FeLV viruse.';
            } else {
                text = 'We tested {{patient.name}} for the presence of FIV viruse.';
            }

            return text;
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
