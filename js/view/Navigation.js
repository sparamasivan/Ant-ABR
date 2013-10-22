define([
    'jquery',
    'backbone',
    'handlebars',
    'model/Report',
    'text!template/Navigation.html',
    'model/MediaQuery',
    'event/Dispatcher',
    'jquery-transit'
], function(
    $,
    Backbone,
    Handlebars,
    ModelReport,
    Template,
    ModelMediaQuery,
    EventDispatcher
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelReport)) {
                throw new Error('model not an instanceof ModelReport');
            }

            Backbone.View.apply(this, arguments);
        },

        events: {
            'click .nav-toggle': '_toggleMenu',
            'click .section': '_goToSection',
            'click .bg': 'collapse'
        },

        render: function(parent) {
            return this.model.fetchAggregatedTestCollection()
                .then($.proxy(function(collection) {
                    // render template
                    this.setElement($(this.template({
                        tests: collection.map(function(test) {
                            return {
                                id: test.id,
                                type: test.getType(),
                                title: test.getTitle()
                            };
                        })
                    })));

                    this.$el.appendTo(parent);

                    // update styles whenever active section changes
                    EventDispatcher.on('section.active', $.proxy(this._handleSectionActive, this));

                    // update styles whenever test expands/collapses
                    EventDispatcher.on('section.collapse', $.proxy(this._handleSectionCollapse, this));
                    EventDispatcher.on('sections.collapse', $.proxy(this._handleSectionCollapse, this));
                    EventDispatcher.on('section.expand', $.proxy(this._handleSectionExpand, this));
                }, this));
        },

        _handleSectionActive: function(testId) {
            if (ModelMediaQuery.isPhoneMedia()) {
                return;
            }

            this._navItemActivate(testId);
        },

        _handleSectionCollapse: function(testId) {
            if (!ModelMediaQuery.isPhoneMedia()) {
                return;
            }

            // deactivate all nav items
            this._navItemActivate(null);
        },

        _handleSectionExpand: function(testId) {
            if (!ModelMediaQuery.isPhoneMedia()) {
                return;
            }

            // deactivate all nav items
            this._navItemActivate(testId);
        },

        _navItemActivate: function(testId) {
            var menuItems = this._getMenuItemEls();

            menuItems.removeClass('active');

            if (testId) {
                menuItems.filter('.test-id-' + testId).addClass('active');
            }
        },

        /**
         * Expand/collapse menu
         * @private
         */
        _toggleMenu: function(e) {
            var elNavItems = this.$el.find('.nav-items');

            if (this.$el.hasClass('expanded')) {
                this.collapse();
            } else {
                this.expand();
            }
        },

        expand: function() {
            var elNavItems = this.$el.find('.nav-items'),
                elToggle = this.$el.find('.nav-toggle'),
                elTests = this.$el.find('.nav-options .nav-item');

            // rotate toggle
            elToggle.find('.icon').transit({
                    rotate: '45deg',
                    duration: 300
                }, function() {
                    elTests.each(function(i) {
                            // calculate final position of nav item
                        var topOffset = ((i + 1) * $(this).outerHeight(true)),
                            // calculate how much to "overshoot" the final position
                            topOffsetWithBounce = topOffset + (i*i) * 1,
                            // duration of animation is relative to position
                            duration = topOffset * 1.2;

                        // animate item
                        $(this)
                            .css({
                                opacity: 0.5
                            })
                            // overshoot
                            .transit({
                                top: topOffsetWithBounce + 'px',
                                opacity: 1,
                                duration: duration,
                                // @see http://roblaplaca.com/examples/bezierBuilder/
                                easing: 'cubic-bezier(.25, .10, .54, .95)'
                            })
                            // go to final position
                            .transit({
                                top: topOffset + 'px',
                                duration: 200
                            });

                        // animate shadow separately, because we don't want the shadows to stack over one another
                        // and get a big black bubble (because shadows are semi transparent)
                        $(this).find('.shadow')
                            .css({
                                opacity: 0
                            })
                            .transit({
                                opacity: 1,
                                duration: duration
                            });
                    });
                });

            this.$el.addClass('expanded');
        },

        collapse: function() {
            var elNavItems = this.$el.find('.nav-items'),
                elToggle = this.$el.find('.nav-toggle'),
                elTests = this.$el.find('.nav-options .nav-item');

            elToggle.find('.icon').transit({
                    rotate: '0deg',
                    duration: 500
                });

            elTests.each(function(i) {
                // hide tests
                var topOffset = 0,
                    duration = $(this).position().top * 1.2;

                $(this)
                    .transit({
                        top: topOffset,
                        opacity: 0.5,
                        duration: duration
                    }, function() {
                        $(this)
                            .css({
                                opacity: 0
                            });
                    });
            });

            this.$el.removeClass('expanded');
        },

        /**
         * Navigate to selected section.
         * @private
         */
        _goToSection: function(e) {
            var sectionUrl = $(e.currentTarget).data('section');

            // navigate to section
            EventDispatcher.trigger('route', sectionUrl);

            if (ModelMediaQuery.isPhoneMedia()) {
                // collapse menu
                this._toggleMenu(e);
            }
        },

        _getMenuItemEls: function() {
            return this.$el.find('.nav-item');
        }
    });
});
