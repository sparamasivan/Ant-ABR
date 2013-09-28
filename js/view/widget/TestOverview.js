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
                more: Handlebars.compile(this.options.moreTemplate)({
                    patient: this.model.getReport().getDataPatient()
                }),
                type: this.model.getType(),
                diagramFilename: this._getDiagramFilename()
            })));

            // append to parent
            this.$el.appendTo(parent);

            // group sections
            this.$elSections = this.$el.find('.section .yui3-u-c');

            // make height of heading boxes the same so that we can nicely vertically align elements
            this.$el.waitForImages(function() {
                self.$elSections.equalHeights({
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
            this.$elSections.equalHeights('refresh');
        },

        _getDiagramFilename: function() {
            return this.options.diagramFilename || 'diagram-2x.png';
        }
    });
});
