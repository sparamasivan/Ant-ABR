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
        _simpleTitle: 'FeLV',
        _booleanResultMessages: {
            'FeLV Antigen': {
                yes: '{{{patient.name}}} has shown signs of the virus.',
                no: '{{{patient.name}}} does not have this virus.'
            }
        }
    });
});
