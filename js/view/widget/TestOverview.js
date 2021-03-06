define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/TestOverview.html',
    'modernizr',
    'model/MediaQuery'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    Modernizr,
    ModelMediaQuery
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            var self = this,
                subtestContainer;

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

            this.$elDiagram = this.$el.find('.diagram');
            this.$elAnimation = this.$el.find('.animation');

            // trigger read more section
            this.$el.find('.widget-arrow').bind('click', function() {
                self.$el.find('.more').slideToggle();
                $(this).toggleClass('down');
            });

            // show animation or static diagram depending on browser support
            if (this._supportsAnimation()) {
                this._getViewAnimation().render(this.$elAnimation);
                this._showAnimation();
            } else {
                this._showDiagram();
            }
        },

        refresh: function() {
        },

        _getDiagramFilename: function() {
            return this.options.diagramFilename || 'diagram-2x.png';
        },

        _showDiagram: function() {
            this.$elAnimation.hide();
            this.$elDiagram.show();
        },

        _showAnimation: function() {
            this.$elAnimation.show();
            this.$elDiagram.hide();
        },

        _getViewAnimation: function() {
            return this.options.viewAnimation;
        },

        _supportsAnimation: function() {
            return (this._getViewAnimation() && Modernizr.csstransforms);
        }
    });
});
