define([
    'jquery',
    'backbone',
    'handlebars',
    'model/test/Base',
    'text!template/test/Base.html',
    'event/Dispatcher',
    'model/MediaQuery',
    'model/Report',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ModelTestBase,
    Template,
    EventDispatcher,
    ModelMediaQuery,
    ReportModel
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelTestBase)) {
                throw new Error('model not an instanceof ModelTestBase');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var self = this;

            // render template
            this.setElement($(this.template({
                id: this.model.id,
                type: this.model.getType(),
                title: this.getTitle(),
                name: this.model.getReport().getDataPatient().name,
                requiresFollowUp: this.model.requiresFollowUp()
            })));



            // append to parent
            this.$el.appendTo(parent);

            this.$elHeader = this.$el.find('.header');
            this.$elContent = this.$el.find('.content');

            // bind header click
            this.$elHeader.bind('click', $.proxy(this.clickHeader, this));

            // listen for all test collapse
            EventDispatcher.on('sections.collapse', function() {
                self.collapse();
            });

            // listen for this test collapse
            EventDispatcher.on('section.collapse.' + this.model.id, function() {
                self.collapse();
            });

            // listen for test expand
            EventDispatcher.on('section.expand.' + this.model.id, function() {
                self.expand();
            });

            this._getStatusEl().tooltip();
        },

        getTitle: function() {
            return this.title || this.model.getTitle();
        },

        getHeaderEl: function() {
            return this.$el.find('.header');
        },

        collapse: function() {
            this.$elContent.addClass('collapsed');
        },

        expand: function() {
            this.$elContent.removeClass('collapsed');
        },

        isCollapsed: function() {
            return !this.$elContent.is(':visible');
        },

        /**
         * Clicking on header collapses/expands test
         */
        clickHeader: function(event) {
            if (event.target === this._getStatusEl()[0]) {
                // ignore this event, since the user actually clicked the status icon/button
                return;
            }

            if (!this.isCollapsed()) {
                // just collapse the test
                EventDispatcher.trigger('section.collapse.' + this.model.id);
                EventDispatcher.trigger('section.collapse', this.model.id);
            } else {
                // navigate to section
                Backbone.history.navigate('section/' + this.model.id);

                // process navigation
                Backbone.history.loadUrl();
            }
        },

        _getStatusEl: function() {
            return this.$el.find('.status');
        }
    });
});
