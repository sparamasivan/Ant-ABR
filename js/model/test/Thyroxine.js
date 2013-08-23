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
        _defaultOrder: 800,
        _simpleTitle: 'T4',

        getModelRange: function() {
            return this.getAllTestCodes()[0];
        },

        _createSubtest: function(subtestData) {
            // all subtests are ranges
            return new ModelSubtestRange(subtestData);
        }
    });
});
