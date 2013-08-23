define([
    'jquery',
    'backbone'
], function(
    $,
    Backbone
) {
    return Backbone.Model.extend({
        /**
         * Override parent url function since it doesn't allow empty root urls.
         */
        url: function() {
            var base = _.result(this, 'urlRoot');
            if (this.isNew()) return base;
            return base + (!base || base.charAt(base.length - 1) === '/' ? '' : '/') + this.id;
        },

        urlRoot: function() {
            return _.result(this.collection, 'url') || '';
        },

        authToken: function() {
            return _.result(this.collection, 'authToken') || '';
        },

        sync: function(method, model, options) {
            options =  _.extend(options, {
                headers: {
                    auth_token: _.result(this, 'authToken')
                }
            });

            return Backbone.sync.apply(this, [method, model, options]);
        }
    });
});
