define([
    'jquery',
    'underscore',
    'backbone',
    'module',
    'modernizr',
    'jquery-debouncedresize'
], function(
    $,
    _,
    Backbone,
    Module,
    Modernizr
) {
    var Model = Backbone.Model.extend({
        constructor: function(attributes) {
            Backbone.Model.apply(this, arguments);

            this._resize();

            this.get('window').on('debouncedresize', $.proxy(this._resize, this));
        },

        _resize: function(e) {
            this.set('windowWidth', this.get('window').width());
            this.set('windowHeight', this.get('window').height());
        },

        isPhoneMedia: function() {
            return Modernizr.mq('(max-width:480px)');
        },

        isTabletMedia: function() {
            return Modernizr.mq('(min-width:481px and max-width:767px');
        },

        isDesktopMedia: function() {
            return Modernizr.mq('(min-width:768px)');
        }
    });

    return new Model({
        window: $(window)
    });
});
