define([
    'jquery',
    'backbone',
    'handlebars',
    'view/subtest/pod/Base',
    'text!template/subtest/pod/Select.html'
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
            ViewBase.prototype.render.apply(this, arguments);
            
            this.$elContent.append(this.templateContent({
                options: this.options.options,
                message: this.options.message,
                description: this.options.description
            }));

            // IE8 doesn't support :last-child, so we'll add "last" class to last element
            this.$elContent.find('.options .option').last().addClass('last');
        }
    });
});
