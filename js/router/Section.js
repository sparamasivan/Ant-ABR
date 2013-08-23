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
