define([
    'jquery',
    'backbone',
    'handlebars',
    'view/subtest/pod/Base',
    'text!template/subtest/pod/Color.html'
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    Template
) {
    return ViewBase.extend({
        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var content,
                viewSelect;

            ViewBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
            	label: this.options.label,
            	isBad: this.options.isBad,
                message: this.options.message,
                description: this.options.description
            }));
        }
    });
});
