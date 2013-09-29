define([
    'backbone'
], function(
    Backbone
) {
    return Backbone.Model.extend({
        constructor: function(attributes, options) {
            this.options = options;
            Backbone.Model.apply(this, arguments);
        },

        getLabel: function() {
            return this._getOption('label') || this.get('label');
        },

        getDescription: function() {
            return this.get('description');
        },

        getType: function() {
            return this.get('testType');
        },

        getValue: function() {
            return this.get('value');
        },

        getValueText: function() {
            return this.get('valueText');
        },

        _getOption: function(name) {
            if (typeof this.options != 'object') {
                return null;
            }

            return this.options[name];
        }
    });
});
