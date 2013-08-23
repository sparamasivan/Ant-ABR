define([
    'jquery',
    'backbone',
    'handlebars',
    'model/MediaQuery'
], function(
    $,
    Backbone,
    Handlebars,
    ModelMediaQuery
) {
    return Backbone.View.extend({
        template: Handlebars.compile(
            '<div class="view-widget-window-width-height" style="position:fixed; top: 0; left: 0; z-index: 10000; background-color:#ffebaf; border: 1px solid #f1bc21; padding: 2px; font-family: Arial, sans-serif;">' +
                '<div>' +
                    '<span class="width"></span>' +
                    '<span>x</span>' +
                    '<span class="height"></span>' +
                '</div>' +
                '<div>' +
                    '<span class="yui3-visible-desktop">desktop</span>' +
                    '<span class="yui3-visible-tablet">tablet</span>' +
                    '<span class="yui3-visible-phone">phone</span>' +
                '</div>' +
            '</div>'
        ),

        render: function(parent) {
            this.setElement($(this.template()));

            // append to parent
            this.$el.appendTo(parent);

            this._updateDimensions();

            // update dimensions whenever screen is resized
            ModelMediaQuery.on('change:windowWidth', $.proxy(this._updateDimensions, this));
            ModelMediaQuery.on('change:windowHeight', $.proxy(this._updateDimensions, this));
        },

        _updateDimensions: function() {
            this.$el.find('.width').text($(window).width());
            this.$el.find('.height').text($(window).height());
        }
    });
});
