define([
    'jquery',
    'backbone',
    'handlebars',
    'view/subtest/pod/Base',
    'text!template/subtest/pod/Select.html',
    'view/subtest/Select'
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    Template,
    ViewSelect
) {
    return ViewBase.extend({
        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var content,
                viewSelect;

            ViewBase.prototype.render.apply(this, arguments);

            content = $(this.templateContent());
            this.$elContent.append(content);

            viewSelect = new ViewSelect({
                options: this.options.options,
                message: this.options.message,
                description: this.options.description,
                selectedIndex: this.options.selectedIndex,
                selectedIsBad: this.options.selectedIsBad
            });

            viewSelect.render(content);
        }
    });
});
