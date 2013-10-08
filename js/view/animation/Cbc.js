define([
    'jquery',
    'backbone',
    'handlebars',
    'view/animation/Base',
    'text!template/animation/Cbc.html',
], function(
    $,
    Backbone,
    Handlebars,
    ViewBase,
    Template
) {
    return ViewBase.extend({
        templateContent: Handlebars.compile(Template),

        _getContent: function() {
            return this.templateContent({
                species: this.options.species
            });
        }
    });
});
