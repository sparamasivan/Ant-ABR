define([
    'jquery',
    'modernizr',
    'jquery-qtip'
], function(
    $,
    Modernizr
) {
    var defaultModalOptions,
        getDefaultModalOptions = function() {
            if (!defaultModalOptions) {
                defaultModalOptions = {
                    'show.modal.on': true,
                    'position.my': 'center',
                    'position.at': 'center',
                    'position.target': $(window),
                    'position.viewport': false,
                    'hide.event': 'click'
                };
            }

            return defaultModalOptions;
        },
        defaultOptions,
        getDefaultOptions = function() {
            if (!defaultOptions) {
                defaultOptions = {
                    content: {
                        text: function(el, api) {
                            return $('<p/>').text(this.attr(api.get('content.attr')));
                        }
                    },
                    position: {
                        my: 'top center',
                        at: 'bottom center',
                        viewport: $('.page')
                    },
                    show: {
                        event: 'click',
                        delay: 0,
                        modal: {
                            on: false,
                            // custom setting used to determine if we should allow automatic switching to
                            // modal display on small screen
                            enabled: true
                        },
                        solo: true,
                        effect: false
                    },
                    hide: {
                        event: 'click',
                        leave: false,
                        effect: false,
                        target: $('body')
                    },
                    style: {
                        classes: 'tooltip qtip-light qtip-shadow qtip-rounded',
                        tip: {
                            width: 20,
                            height: 10
                        }
                    },
                    events: {
                        show: function(event, api) {
                            if (!api.cache.show) {
                                if (Modernizr.mq('(max-width:480px)') && api.get('show.modal.enabled')) {
                                    if (!api.cache.nonModalOptions) {
                                        // load modal option values
                                        api.cache.nonModalOptions = {};

                                        $.each(defaultModalOptions, function(option, value) {
                                            api.cache.nonModalOptions[option] = api.get(option);
                                            api.set(option, value);
                                        });
                                    } else {
                                        // modal options already loaded
                                    }
                                } else {
                                    if (api.cache.nonModalOptions) {
                                        // load non-modal option values
                                        $.each(api.cache.nonModalOptions, function(option, value) {
                                            api.set(option, value);
                                        });

                                        delete api.cache.nonModalOptions;
                                        api.plugins.modal.destroy();
                                    } else {
                                        // non-modal options already loaded
                                    }
                                }

                                // WORKAROUND: prevent current show event, and trigger a new one
                                // because the update modal options will only be taken into account
                                // in the next show event
                                api.cache.show = true;
                                // IE might throw an error calling preventDefault(), so use a try/catch block.
                                try { event.preventDefault(); } catch(e) {}
                                api.toggle(true, event.originalEvent);
                            } else {
                                api.cache.show = false;

                                // prevent original event from propagating and triggering hide which is listening for click on body
                                if (event.originalEvent.stopPropagation) {
                                    event.originalEvent.stopPropagation();
                                }
                            }
                        }
                    }
                }
            };

            return defaultOptions;
        };

    return $.fn.tooltip = function(customOptions) {
        var defaultOptions = getDefaultOptions(),
            defaultModalOptions = getDefaultModalOptions(),
            options = $.extend(true, {}, defaultOptions, customOptions),
            text;

        // wrap simple tooltip text in <p> tag
        text = options.content.text;
        if (typeof text == 'string') {
            options.content.text = function(api) {
                return $('<p></p>').text(text);
            };
        }

        // extend classes if custom classes set
        if (customOptions && customOptions.style && customOptions.style.classes) {
            options.style.classes = defaultOptions.style.classes + ' ' + customOptions.style.classes;
        }

        // wrap custom show function so that our default show function also gets executed
        if (customOptions && customOptions.events && customOptions.events.show) {
            options.events.show = function(event, api) {
                customOptions.events.show.apply(this, [event, api, defaultOptions.events.show]);
            };
        }

        return $(this).qtip((typeof customOptions == 'string') ? customOptions : options);
    };
});
