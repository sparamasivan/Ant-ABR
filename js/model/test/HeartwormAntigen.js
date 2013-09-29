define([
    'jquery',
    'underscore',
    'backbone',
    'model/test/Base',
    'model/subtest/Boolean'
], function(
    $,
    _,
    Backbone,
    ModelTestBase,
    ModelSubtestBoolean
) {
    return ModelTestBase.extend({
        _defaultOrder: 700,
        _simpleTitle: 'Heartworm',
        _booleanResultMessages: {
            'canine': {
                'Heartworm': {
                    yes: 'Heartworm detected.',
                    no: 'Heartworm not found.'
                }
            },
            'feline': {
                'Heartworm': {
                    yes: '{{patient.name}} has been exposed to heartworm.',
                    no: 'Heartworm exposure not found.'
                }
            }
        },

        getModelHeartwormBoolean: function() {
            return this.getAllTestCodes()[0];
        },

        _createSubtest: function(subtestData) {
            // hardcode label
            var label = 'Heartworm';

            // there should be only one subtest, and it's a boolean
            return new ModelSubtestBoolean(subtestData, {
                // override label
                label: label,
                messageTypes: this._getBooleanResultMessagesByLabel(label)
            });
        },

        _getBooleanResultMessages: function() {
            return this._booleanResultMessages[this.getReport().getPatientSpecies()];
        }
    });
});
