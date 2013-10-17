define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/Survey.html',
    'model/MediaQuery',
    'module',
    'foundation-reveal',
    'jquery-cookie'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelMediaQuery,
    Module
) {
    /**
     * Displays a modal window after a certain amount of time passes. The user is given the option to
     * proceed to fill out a survey or exit the modal window. Once the user accepts/declines, a cookie
     * is set, so that future reloads of the page will not trigger the modal to display again. 
     */
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        timeoutHandle: null,

        events: {
            'click .accept': '_accept',
            'click .decline': '_decline'
        },

        render: function() {
            var self = this;

            // render template
            this.setElement($(this.template({
                url: Module.config().url
            })));

            $('body').append(this.$el);

            // check if survey has not been seen yet by user
            if (!this._retrieveSurveyResponse()) {
                self.setTimer();
            }

            // refresh widget whenever screen is resized
            ModelMediaQuery.on('change:windowWidth', $.proxy(this._windowResized, this));

            // close modal when outside container is clicked
            this.$el.bind('click', function(e) {
                if (e.target === this) {
                    self.close();
                }
            });
        },

        /**
         * Display survey after some initial time has passed
         */
        setTimer: function() {
            var self = this;

            this.timeoutHandle = setTimeout(function() {
                self.timeoutHandle = null;

                if (ModelMediaQuery.isPhoneMedia()) {
                    // do not display on phones
                    return;
                }

                self.open();
            }, Module.config().timeout);
        },

        open: function() {
            var self = this;

            this.$el.foundation('reveal', 'open', {
                bg: $('.reveal-modal-bg'),
                close: function() {
                    if (!self._retrieveSurveyResponse() && !ModelMediaQuery.isPhoneMedia()) {
                        self._storeSurveyResponse('declined');
                    }

                    // WORKAROUND: change window positioning to absolute so closing animation can run properly
                    $(this).css({
                        'position': 'absolute',
                        'top': parseInt($(this).css('top')) + $(window).scrollTop()
                    });
                },
                opened: function() {
                    // WORKAROUND: once opening animation is finished, display modal window as fixed
                    $(this).css({
                        'position': 'fixed',
                        'top': parseInt($(this).css('top', '').css('top'))
                    });
                }
            });

            $('body').foundation('reveal', 'events');
        },

        close: function() {
            this.$el.foundation('reveal', 'close');
        },

        _accept: function(e) {
            this._storeSurveyResponse('accepted');
            this.close();
        },

        _decline: function(e) {
            e.preventDefault();
            this.close();
        },

        /**
         * Get survey response if the use has interacted with the survey in some previous session.
         */
        _retrieveSurveyResponse: function() {
            return $.cookie('survey-response');
        },

        /**
         * Update the survey response.
         */
        _storeSurveyResponse: function(response) {
            $.cookie('survey-response', response, {
                expires: 365 * 5 // large enough value, so that cookie never really expires
            });
        },

        _windowResized: function() {
            if (ModelMediaQuery.isPhoneMedia()) {
                this.close();
            } else if (!this.timeoutHandle && !this._retrieveSurveyResponse()) {
                // screen is wider now, so let's try to display survey if the timer is not already on
                this.setTimer();
            }
        }
    });
});
