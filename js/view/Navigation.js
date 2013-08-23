define([
    'jquery',
    'backbone',
    'handlebars',
    'model/Report',
    'text!template/Navigation.html',
    'model/MediaQuery',
    'event/Dispatcher'
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
            'click .section': '_goToSection'
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

                    // update styles dynamically
                    this._updateStyles();

                    // update styles whenever screen is resized
                    ModelMediaQuery.on('change:windowWidth', $.proxy(this._updateStyles, this));

                    // update styles whenever active section changes
                    EventDispatcher.on('section.active', $.proxy(this._handleSectionActive, this));

                    // update styles whenever test expands/collapses
                    EventDispatcher.on('section.collapse', $.proxy(this._handleSectionCollapse, this));
                    EventDispatcher.on('sections.collapse', $.proxy(this._handleSectionCollapse, this));
                    EventDispatcher.on('section.expand', $.proxy(this._handleSectionExpand, this));
                }, this));
        },

        /**
         * Dynamically update menu styles/classes depending on state (e.g. collapsed vs. expanded)
         * @private
         */
        _updateStyles: function() {
            var menuItems = this._getMenuItemEls(),
                visibleMenuItems = menuItems.filter(':visible');

            // remove first/last classes
            menuItems.removeClass('first last');

            // add "first" class to first visible menu item
            visibleMenuItems.first().addClass('first');

            // add "last" class to last visible menu item
            visibleMenuItems.last().addClass('last');
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
            // slide nav into view, then update styles again
            this.$el.find('.nav-options').slideToggle(300, $.proxy(this._updateStyles, this));

            // update styles as soon as nav begins animating
            this._updateStyles();
        },

        /**
         * Navigate to selected section.
         * @private
         */
        _goToSection: function(e) {
            var sectionUrl = $(e.currentTarget).data('section');

            // navigate to section
            Backbone.history.navigate(sectionUrl);

            // process navigation
            Backbone.history.loadUrl();

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
