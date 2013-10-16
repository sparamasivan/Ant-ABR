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

        _rendered: false,

        render: function(parent) {
            var self = this;

            // render template
            this.setElement($(this.template()));

            this.$elContent = this.$el.find('.animation-container');

            this.$elContent.append(this._getContent());

            this.$el.appendTo(parent);

            this.$el.bind('click', function() {
                self.run();
            });

            this._rendered = true;
        },

        reset: function() {
            var stickerEl = this._getStickerEl();

            if (!this._rendered) return false;

            stickerEl.removeClass('active');

            // -> triggering reflow /* The actual magic */
            // otherwise if 'active' class is re-added immediately after removing it
            // it will no restart the animation
            // @see http://css-tricks.com/restart-css-animation/
            stickerEl[0].offsetWidth = stickerEl[0].offsetWidth;
        },

        run: function() {
            var self = this;

            if (!this._rendered) return false;

            this.reset();

            self._getStickerEl().addClass('active');
            
        },

        _getContent: function() {
            return this.templateContent();
        },

        _getStickerEl: function() {
            return this.$elContent.find('.sticker');
        }
    });
});
