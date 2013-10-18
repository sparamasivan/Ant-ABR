var require = {
    baseUrl: 'js/',

    paths: {
        'text': 'lib/require-text',
        'jquery-base': 'lib/jquery-1.8.3',
        'jquery-qtip': 'lib/qtip/jquery.qtip-2.0.1',
        'jquery-waitforimages': 'lib/jquery.waitforimages',
        'jquery-debouncedresize': 'lib/jquery.debouncedresize',
        'jquery-jswipe': 'lib/jquery.jswipe',
        'jquery-transit': 'lib/jquery.transit',
        'jquery-cookie': 'lib/jquery.cookie',
        'modernizr' : 'lib/modernizr.custom',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone-1.0.0',
        'handlebars-base': 'lib/handlebars-1.0.0-rc.3',
        'handlebars': 'handlebars-helper',
        'iscroll': 'lib/iscroll',
        'async': 'lib/require/async',
        'propertyParser': 'lib/require/propertyParser',
        'goog': 'lib/require/goog',
        'foundation': 'lib/foundation/foundation',
        'foundation-reveal': 'lib/foundation/foundation.reveal'
    },

    config: {
        'app': {
            defaultReportUrl: 'data/combined.json',
            windowWidthHeightToolbarEnabled: true
        },
        'view/Page': {
            petPortalHomeUrl: '#',
            logoutUrl: '#',
            privacyPolicyUrl: 'http://www.vetsecure.com/petportals/privacy_policy',
            isSurveyEnabled: true
        },
        'view/Survey': {
            surveyUrl: 'https://www.google.com/',
            timeout: 120000
        }
    },

    shim: {
        'modernizr': {
            exports: 'Modernizr'
        },
        'jquery-base': {
            exports: 'jQuery'
        },
        'jquery-qtip': {
            deps: ['jquery'],
            exports: 'jQuery.qtip'
        },
        'jquery-waitforimages': {
            deps: ['jquery'],
            exports: 'jQuery.waitForImages'
        },
        'jquery-debouncedresize': {
            deps: ['jquery'],
            exports: 'jQuery.event.special.debouncedresize'
        },
        'jquery-jswipe': {
            deps: ['jquery'],
            exports: 'jQuery.fn.swipe'
        },
        'jquery-transit': {
            deps: ['jquery'],
            exports: 'jQuery.fn.transit'
        },
        'jquery-cookie': {
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        },
        'underscore': {
            exports: '_',
            init: function() {
                _.templateSettings.variable = "data";

                return _;
            }
        },
        'backbone': {
            deps: ['underscore', 'jquery', 'handlebars'],
            exports: 'Backbone'
        },
        'handlebars-base': {
            exports: 'Handlebars'
        },
        'iscroll': {
            exports: 'iScroll'
        },
        'foundation': {
            deps: ['jquery'],
            exports: 'Foundation'
        },
        'foundation-reveal': {
            deps: ['foundation'],
            exports: 'Foundation.libs.reveal'
        }
    }
};
