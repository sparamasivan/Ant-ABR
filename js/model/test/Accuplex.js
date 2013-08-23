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
        _defaultOrder: 500,
        _simpleTitle: 'Accuplex',
        _booleanResultMessages: {
            'Lyme Exposure': {
                yes: '{{{patient.name}}} has been exposed to lyme disease.',
                no: '{{{patient.name}}} has not been exposed to lyme disease.'
            },
            'Ehrlichia Exposure': {
                yes: '{{{patient.name}}} has been exposed to the bacteria ehrilichia.',
                no: '{{{patient.name}}} has not been exposed to ehrlichia.'
            },
            'Anaplasma Exposure': {
                yes: '{{{patient.name}}} has been exposed to the bacteria  anaplasma.',
                no: '{{{patient.name}}} has not been exposed to anaplasma.'
            }
        }
    });
});
