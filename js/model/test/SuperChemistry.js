define([
    'jquery',
    'underscore',
    'backbone',
    'model/test/Base',
    'model/subtest/Range'
], function(
    $,
    _,
    Backbone,
    ModelTestBase,
    ModelSubtestRange
) {
    return ModelTestBase.extend({
        _defaultOrder: 100,
        _simpleTitle: 'Chemistry',

        _createSubtest: function(subtestData) {
            // all subtests are ranges
            return new ModelSubtestRange(subtestData);
        }
    });
});
