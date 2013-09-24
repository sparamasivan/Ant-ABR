define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/TestOverview.html',
    'model/MediaQuery',
    'jquery-equal-heights',
    'jquery-waitforimages'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelMediaQuery
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
            this._getSections().waitForImages(function() {
                $(this).equalHeights({
                    callback: function(tallestHeight) {
                        return !ModelMediaQuery.isPhoneMedia();
                    }
                });
                deferred.resolve();
            });

            return deferred.promise();
        },

        refresh: function() {
            // recalculate heights
            this._getSections().equalHeights('refresh');
        },

        _getSections: function() {
            return this.$el.find('.section');
        }
    });
});
