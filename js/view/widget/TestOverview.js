define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/TestOverview.html',
    'modernizr',
    'model/MediaQuery',
    'jquery-waitforimages'
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
                subtestContainer,
                viewAnimation = this._getViewAnimation();

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
                self.$el.find('.more').toggle();
                $(this).toggleClass('down');
            });

            if (viewAnimation) {
                viewAnimation.render(this.$elAnimation);
            }

            this._updateAnimationDisplay();
            ModelMediaQuery.on('change:windowWidth', $.proxy(this._updateAnimationDisplay, this));
        },

        refresh: function() {
        },

        _getDiagramFilename: function() {
            return this.options.diagramFilename || 'diagram-2x.png';
        },

        /**
         * Switch between displaying static diagram image or animation depending on screen size and browser support
         */
        _updateAnimationDisplay: function() {
            if (!this._getViewAnimation() || ModelMediaQuery.isPhoneMedia() || !Modernizr.csstransforms) {
                this._showDiagram();
            } else {
                this._showAnimation();
            }
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
        }
    });
});
