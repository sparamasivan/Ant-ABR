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
        templateHeader: Handlebars.compile(
            '<div class="page-section-wrapper header test-header {{type}}">' +
                '<div class="yui3-g page-section">' +
                    '<div class="yui3-u-1">' +
                        '<span class="title">' +
                            '<span class="icon"></span>' +
                            '<span class="text">{{title}}</span>' +
                        '</span>' +
                        '{{#if requiresFollowUp}}' +
                            '<div title="Please review your Next Steps for the follow up action." class="status bad">' +
                        '{{else}}' +
                            '<div title="{{patient.name}}\'s {{simpleTitle}} result was reviewed and everything looks good." class="status good">' +
                        '{{/if}}' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ),

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
                type: this.model.getType()
            })));

            // append to parent
            this.$el.appendTo(parent);

            // append header
            this.$elHeader = this.generateHeader();
            this.$el.find('.header-container').append(this.$elHeader);

            // test content to be filled by child classes
            this.$elContent = this.$el.find('.content');

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
        },

        generateHeader: function() {
            // render template
            var headerEl = $(this.templateHeader({
                    type: this.model.getType(),
                    title: this.getTitle(),
                    simpleTitle: this.model.getSimpleTitle(),
                    patient: this.model.getReport().getDataPatient(),
                    requiresFollowUp: this.model.requiresFollowUp()
                })),
                statusEl;

            // bind header click
            headerEl.bind('click', $.proxy(this.clickHeader, this));

            // show tooltip on follow-up click
            statusEl = headerEl.find('.status');
            statusEl.tooltip();

            // hide tooltip on scroll
            $(window).bind('scroll', function() {
                statusEl.tooltip('api').hide();
            });

            return headerEl;
        },

        getTitle: function() {
            return this.title || this.model.getTitle();
        },

        collapse: function() {
            this.$elContent.addClass('collapsed');
        },

        expand: function() {
            this.$elContent.removeClass('collapsed');
            this.refresh();
        },

        isCollapsed: function() {
            return !this.$elContent.is(':visible');
        },

        refresh: function() {},

        /**
         * Clicking on header collapses/expands test
         */
        clickHeader: function(event) {
            if (this.isHeaderStatusClickedEvent(event)) {
                // ignore this event
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

        /**
         * Did the user actually click the status icon/button when clicking inside the header
         */
        isHeaderStatusClickedEvent: function(event) {
            return event.target === $(event.currentTarget).find('.status')[0];
        }
    });
});
