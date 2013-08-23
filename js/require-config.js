var require = {
    baseUrl: 'js/',

    paths: {
        'text': 'lib/require-text',
        'jquery-base': 'lib/jquery-1.8.3',
        'jquery-qtip': 'lib/qtip/jquery.qtip-2.0.1',
        'jquery-waitforimages': 'lib/jquery.waitforimages',
        'jquery-debouncedresize': 'lib/jquery.debouncedresize',
        'modernizr' : 'lib/modernizr.custom.media-query',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone-1.0.0',
        'handlebars-base': 'lib/handlebars-1.0.0-rc.3',
        'handlebars': 'handlebars-helper',
        'iscroll': 'lib/iscroll'
    },

    config: {
        'app': {
            defaultReportUrl: 'data/combined.json',
            windowWidthHeightToolbarEnabled: true
        },
        'view/Page': {
            petPortalHomeUrl: '#',
            logoutUrl: '#',
            privacyPolicyUrl: '#'
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
        }
    }
};
