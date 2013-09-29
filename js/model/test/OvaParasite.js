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
        _defaultOrder: 400,
        _simpleTitle: 'Ova & Parasites',
        _booleanResultMessages: {
            'Roundworm': {
                yes: 'Roundworm was found.',
                no: 'None were found.'
            },
            'Hookworm': {
                yes: 'Hookworm was found.',
                no: 'None were found.'
            },
            'Whipworm': {
                yes: 'Whipworm was found.',
                no: 'None were found.'
            },
            'Tapeworm': {
                yes: 'Tapeworm was found.',
                no: 'None were found.'
            },
            'Coccidia': {
                yes: 'Coccidia was found.',
                no: 'None were found.'
            },
            'Giardia': {
                yes: 'Giardia was detected.',
                no: 'None were found.'
            },
            'Parasites': {
                no: 'None were found.'
            },
            'All Parasites': {
                no: 'None were found.'
            }
        }
    });
});
