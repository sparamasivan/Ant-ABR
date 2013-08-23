define([
    'jquery',
    'underscore',
    'backbone',
    'model/test/Base'
], function(
    $,
    _,
    Backbone,
    ModelTestBase
) {
    return ModelTestBase.extend({
        _defaultOrder: 600,
        _simpleTitle: 'FIV',
        _booleanResultMessages: {
            'FIV Antibody': {
                yes: '{{{patient.name}}} has been exposed to this virus.',
                no: '{{{patient.name}}} has not been exposed to this virus.'
            }
        }
    });
});
