define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'model/Report',
    'view/Overview',
    'view/test/Base',
    'text!template/Report.html',
    'model/MediaQuery',
    'event/Dispatcher'
], function(
    $,
    _,
    Backbone,
    Config,
    ModelReport,
    ViewOverview,
    ViewTestBase,
    Template,
    ModelMediaQuery,
    EventDispatcher
) {
    var Model = Backbone.View.extend({
        template: _.template(Template),
        _testViews: null,

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelReport)) {
                throw new Error('model not an instanceof ModelReport');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var promises = [];

            // render template
            this.setElement($(this.template()));

            this.$el.appendTo(parent);

            promises.push(this._renderOverview(
                this.$el.find('.overview')
            ));

            promises.push(this._renderTests(
                this.$el.find('.tests')
            ));
            
            return $.when.apply($, promises)
                .done($.proxy(function() {
                    // collapse all tests after finished loading them
                    EventDispatcher.trigger('sections.collapse');
                }, this))
                .done($.proxy(this._renderFixedTestHeaders, this));
        },

        _renderOverview: function(parent) {
            var view = new ViewOverview({
                model: this.model
            });

            return view.render(parent);
        },

        _renderTests: function(parent) {
            var self = this;

            this._testViews = [];

            return this.model.fetchAggregatedTestCollection()
                .then(function(collection) {
                    var promises = [];
                    
                    $.each(collection.models, function(i, model) {
                        promises.push(
                            self._renderTest(
                                $('<div />').appendTo(parent),
                                model
                            ).done(function(view) {
                                self._testViews[i] = view;
                            })
                        );
                    });

                    return $.when.apply($, promises);
                });
        },

        _renderTest: function(parent, model) {
            var self = this,
                type = model.getType(),
                viewModulePath = Config.getModelViewModuleByTestType(type),
                deferred = new $.Deferred();

            // load test view module
            require([viewModulePath], function(ViewTest) {
                var view;

                // sanity check
                if (!(ViewTest.prototype instanceof ViewTestBase)) {
                    throw new Error('Loaded module should inherit from ViewTestBase class.');
                }

                // initialize view
                view = new ViewTest({
                    model: model
                });

                // render test
                $.when(view.render(parent)).done(function() {
                    deferred.resolve(view);
                });
            });

            return deferred.promise();
        },

        /**
         * Render fixed headers which will appear at top of page as the user is scrolling.
         */
        _renderFixedTestHeaders: function() {
            var self = this;

            this.$elHeaders = this.$el.find('.test-headers');

            // make a copy of each test header and stuff it in the fixed header container
            $.each(this._testViews, function(i, view) {
                self.$elHeaders.append(
                    view.generateHeader()
                        .bind('click', function(event) {
                            if (view.isHeaderStatusClickedEvent(event)) {
                                // ignore event
                                return;
                            }

                            // go to the top of the test
                            $('html, body').scrollTop(view.$elHeader.offset().top);

                            // hide fixed header, since at the top of the test, we have the normal header showing
                            $(this).hide();
                        }
                    )
                );
            });

            // update what fixed header is showing
            this._repositionHeader();

            // update what fixed header is showing whenever page scrolled or resized
            $(window).bind('scroll', $.proxy(this._repositionHeader, this));
            ModelMediaQuery.on('change:windowWidth', $.proxy(this._repositionHeader, this));
        },

        /**
         * Depending on what test is currently in view, show corresponding fixed header.
         */
        _repositionHeader: function() {
            var self = this,
                testViews = this._testViews,
                windowTop = $(window).scrollTop(),
                headerEls = this.$elHeaders.find('.header'),
                visibleViewIndex = null,
                activeTestId;

            $.each(testViews, function(i, view) {
                // get test boundaries
                var testBoundsMin = Math.floor(view.$el.offset().top) + 1,
                    testBoundsMax = testBoundsMin + view.$el.height() - 1,
                    headerEl = headerEls.eq(i),
                    topOffset;

                if (windowTop >= testBoundsMin && windowTop <= testBoundsMax && !view.isCollapsed()) {
                    // test currently in view, so show corresponding header
                    headerEl.show();

                    // sometimes only a small section of the test is showing near the top of the page,
                    // in that case we need to show only a part of the header
                    topOffset = (headerEl.height() <= testBoundsMax - windowTop)
                        ? 0
                        : -1 * (headerEl.height() - (testBoundsMax - windowTop) - 1) + 'px';

                    self.$elHeaders.css({top: topOffset});

                    visibleViewIndex = i;
                } else {
                    // hide header, since the corresponding test is not currently in view
                    headerEl.hide();
                }
            });
            
            // hide the header container if no test header is visible
            this.$elHeaders.css({
                visibility: (visibleViewIndex === null) ? 'hidden' : 'visible'
            });
            
            // Depending on what header is active, we want to trigger an event that will
            // let other modules know what is the current active test header
            if (visibleViewIndex !== null) {
                if ((parseInt(this.$elHeaders.css('top')) || 0) >= 0) {
                    // current header is fully visible, so current section is active
                    activeTestId = testViews[visibleViewIndex].model.id;
                } else if (visibleViewIndex < testViews.length - 1 && !testViews[visibleViewIndex+1].isCollapsed()) {
                    // current header is not fully visible, so assume next header is visible
                    activeTestId = testViews[visibleViewIndex+1].model.id;
                } else {
                    // no header is visible
                    activeTestId = null;
                }
            } else {
                // no header is visible
                activeTestId = null;
            }

            EventDispatcher.trigger('section.active', activeTestId);
        },
    });

    return Model
});
