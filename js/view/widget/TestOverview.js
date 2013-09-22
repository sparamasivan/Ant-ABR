define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/TestOverview.html',
    'jquery-equal-heights',
    'jquery-waitforimages'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                subtestContainer,
                deferred = new $.Deferred();

            this.setElement($(this.template({
                description: Handlebars.compile(this.options.descriptionTemplate)({
                    patient: this.model.getReport().getDataPatient()
                }),
                type: this.model.getType()
            })));

            // append to parent
            this.$el.appendTo(parent);

            // make height of heading boxes the same so that we can nicely vertically align elements
            this._getSectionHeading().waitForImages(function() {
                $(this).equalHeights();
                deferred.resolve();
            });

            return deferred.promise();
        },

        refresh: function() {
            // recalculate heights
            this._getSectionHeading().equalHeights('refresh');
        },

        _getSectionHeading: function() {
            return this.$el.find('.section-heading');
        }
    });
});
