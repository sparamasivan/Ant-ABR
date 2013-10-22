define([
    'jquery',
    'backbone',
    'event/Dispatcher'
], function(
    $,
    Backbone,
    EventDispatcher
) {
    return Backbone.Router.extend({
        routes: {
            '': 'top',
            'section/:section': 'section',
            'section/:section/sub/:subsection': 'subsection',
            'overview': 'overview',
            'next-steps': 'nextSteps'
        },

        _bindRoutes: function() {
            this.routeHandlers = [];
            
            Backbone.Router.prototype._bindRoutes.apply(this, arguments);

            EventDispatcher.on('route', $.proxy(this._handleRoute, this));
        },

        /**
         * Override default route functionality, since we don't want to link router
         * to Backbone.history, but instead to our EventDispatcher "route" events.
         */
        route: function(route, name, callback) {
            var router = this;

            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];

            this._addRouteByRegExp(route, function(fragment) {
                var args = router._extractParameters(route, fragment);
                callback && callback.apply(router, args);
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
            });

            return this;
        },

        _addRouteByRegExp: function(route, callback) {
            this.routeHandlers.unshift({route: route, callback: callback});
        },

        _handleRoute: function(fragment) {
            var matched = _.any(this.routeHandlers, function(handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
            return matched;
        },

        /**
         * Go to section
         */
        section: function(section) {
            var sectionEl = $('#section-' + section);

            if (!sectionEl.length) {
                throw new Error('Failed to find section: ' + section);
            }

            // collapse all sections
            EventDispatcher.trigger('sections.collapse');

            // expand selected section
            EventDispatcher.trigger('section.expand.' + section);
            EventDispatcher.trigger('section.expand', section);

            // scroll to section
            this._scrollTop(sectionEl.offset().top);
        },

        subsection: function(section, subsection) {
            var sectionEl = $('#section-' + section),
                subSectionEl = sectionEl.find('.subsection-' + subsection),
                sectionHeaderEl = sectionEl.find('.test-header');

            if (!sectionEl.length) {
                throw new Error('Failed to find section: ' + section);
            }

            // collapse all sections
            EventDispatcher.trigger('sections.collapse');

            // expand selected section
            EventDispatcher.trigger('section.expand.' + section);
            EventDispatcher.trigger('section.expand', section);

            // scroll to subsection
            this._scrollTop(subSectionEl.offset().top - sectionHeaderEl.height());
        },

        overview: function() {
            var overviewEl = $('.view-overview .page-section-ran');

            if (!overviewEl.length) {
                throw new Error('Failed to find overview section.');
            }

            // scroll to section
            this._scrollTop(overviewEl.offset().top);
        },

        nextSteps: function() {
            var el = $('.view-overview .page-section-next-steps');

            if (!el.length) {
                throw new Error('Failed to find next steps section.');
            }

            // scroll to section
            this._scrollTop(el.offset().top);
        },

        /**
         * Go to top of page
         */
        top: function() {
            // collapse all sections
            EventDispatcher.trigger('sections.collapse');

            this._scrollTop(0);
        },

        /**
         * Scroll page to specified offset
         */
        _scrollTop: function(offset) {
            var currentOffset = $('body').scrollTop(),
                difference = Math.abs(currentOffset - offset);

            // Fix un-clickable nav menu on IPad2 iOS5, by adding temporary padding, then removing it
            // @see http://stackoverflow.com/questions/4408363/fixed-position-not-working-on-ipad
            $('body').css('paddingBottom', '1px');
            
            $('html, body').animate({
                scrollTop: offset
            }, {
                duration: Math.floor(difference / 2.5),
                complete: function() {
                    $('body').css('paddingBottom', 0);
                }
            });
        }
    })
});
