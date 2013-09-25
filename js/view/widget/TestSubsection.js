define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/widget/TestSubsection.html'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            var self = this;

            this.setElement($(this.template({
                title: this.options.title,
                text: this.options.text
            })));

            // append to parent
            this.$el.appendTo(parent);

            this.$elHeader = this.$el.find('.header');
            this.$elBody = this.$el.find('.body');
            this.$elContent = this.$el.find('.content');

            this.$elHeader.bind('click', function() {
                if (self.isExpanded()) {
                    self.collapse();
                } else {
                    self.expand();
                }
            });
        },

        expand: function() {
            this.$el.addClass('expanded');
            this.$elHeader.find('.widget-arrow').addClass('down');
            this.trigger('expanded');
        },

        collapse: function() {
            this.$el.removeClass('expanded');
            this.$elHeader.find('.widget-arrow').removeClass('down');
            this.trigger('collapsed');
        },

        isExpanded: function() {
            return this.$el.hasClass('expanded');
        },

        setContent: function(content) {
            return this.$elContent.append(content);
        },

        getContent: function() {
            return this.$elContent.children();
        }
    });
});
