define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/pod/Base.html'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            var self = this;

            // render template
            this.setElement($(this.template({
                title: this.options.title,
                classes: this.options.classes
            })));

            // append to parent
            this.$el.appendTo(parent);

            // test content to be filled by child classes
            this.$elContent = this.$el.find('.content');
        }
    });
});
