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

        _createSubtest: function(subtestData) {
            // all subtests are boolean
            return new ModelSubtestBoolean(subtestData, {
                messageTypes: this._getBooleanResultMessagesByLabel(subtestData.label)
            });
        },

        _getBooleanResultMessages: function() {
            return this._booleanResultMessages[this.getReport().getPatientSpecies()];
        }
    });
});
