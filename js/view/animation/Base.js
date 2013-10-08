define([
    'jquery',
    'backbone',
    'text!template/animation/Base.html'
], function(
    $,
    Backbone,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        // set by the child class
        templateContent: null,

        render: function(parent) {
            var self = this;

            // render template
            this.setElement($(this.template()));

            this.$elContent = this.$el.find('.animation-container');

            this.$elContent.append(this._getContent());

            this.$el.appendTo(parent);
        },

        animate: function() {
            var stickerEl = this.$elContent.find('.sticker');

            stickerEl.removeClass('active');

            // add a bit of delay before activating
            setTimeout(function() {
                stickerEl.addClass('active');
            }, 200);
            
        },

        _getContent: function() {
            return this.templateContent();
        }
    });
});
