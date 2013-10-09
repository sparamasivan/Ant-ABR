define([
    'jquery',
    'backbone',
    'handlebars',
    'model/test/Base',
    'text!template/test/Base.html',
    'text!template/test/base/Header.html',
    'event/Dispatcher',
    'model/MediaQuery',
    'model/Report',
    'view/widget/TestOverview',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ModelTestBase,
    Template,
    TemplateHeader,
    EventDispatcher,
    ModelMediaQuery,
    ReportModel,
    ViewWidgetTestOverview
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),
        templateHeader: Handlebars.compile(TemplateHeader),

        _viewTestOverview: null,

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelTestBase)) {
                throw new Error('model not an instanceof ModelTestBase');
            }

            this._overview = {
                descriptionTemplate: null
            };

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

            // test body shown/hidden depending on whether test is expanded/collapsed
            this.$elBody = this.$el.find('.body');

            // test content to be filled by child classes
            this.$elContent = this.$elBody.find('.content');

            this._renderOverview(this.$elBody.find('.overview'));

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

        _renderOverview: function(parent) {
            // render test overview
            this._viewTestOverview = new ViewWidgetTestOverview($.extend({
                model: this.model
            }, this._overview));

            this._viewTestOverview.render(parent);
        },

        getTitle: function() {
            return this.title || this.model.getTitle();
        },

        collapse: function() {
            this.$elBody.addClass('collapsed');
        },

        expand: function() {
            var viewAnimation = this._overview.viewAnimation;
            this.$elBody.removeClass('collapsed');
            this.refresh();

            viewAnimation.reset();

            // wait a little to ensure test is finished expanding before running animation
            setTimeout(function() {
                viewAnimation.run();
            }, 1000);
        },

        isCollapsed: function() {
            return !this.$elBody.is(':visible');
        },

        refresh: function() {
            this._viewTestOverview.refresh();
        },

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
            var elStatus = $(event.currentTarget).find('.status')[0];

            return event.target === elStatus || $.contains(elStatus, event.target);
        }
    });
});
