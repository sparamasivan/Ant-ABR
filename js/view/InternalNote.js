define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/InternalNote.html'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            this.setElement($(this.template({
                notes: this.model.getInternalNotes()
            })));

            this.$el.appendTo(parent);
        }
    });
});
