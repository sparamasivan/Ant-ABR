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

            this.$el.bind('click', function() {
                self.run();
            });
        },

        reset: function() {
            this._getStickerEl().removeClass('active');
        },

        run: function() {
            var self = this;

            this.reset();

            // activate animation in next cycle
            setTimeout(function() {
                self._getStickerEl().addClass('active');
            }, 0);
            
        },

        _getContent: function() {
            return this.templateContent();
        },

        _getStickerEl: function() {
            return this.$elContent.find('.sticker');
        }
    });
});
