define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/TestOverview.html',
    'model/MediaQuery',
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
                viewAnimation = this.options.viewAnimation;

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

            // trigger read more section
            this.$el.find('.widget-arrow').bind('click', function() {
                self.$el.find('.more').toggle();
                $(this).toggleClass('down');
            });

            if (viewAnimation) {
                viewAnimation.render(this.$el.find('.animation'));
            }
        },

        refresh: function() {
        },

        _getDiagramFilename: function() {
            return this.options.diagramFilename || 'diagram-2x.png';
        }
    });
});
