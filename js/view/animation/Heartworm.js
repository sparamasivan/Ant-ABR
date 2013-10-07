define([
    'jquery',
    'backbone',
    'handlebars',
    'view/animation/Base',
    'text!template/animation/Heartworm.html',
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
            
            this.$elContent.append(this.templateContent());
        }
    });
});
