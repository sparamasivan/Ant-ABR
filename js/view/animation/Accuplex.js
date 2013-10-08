define([
    'jquery',
    'backbone',
    'handlebars',
    'view/animation/Base',
    'text!template/animation/Accuplex.html',
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    Template
) {
    return ViewBase.extend({
        templateContent: Handlebars.compile(Template)
    });
});
