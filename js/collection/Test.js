define([
    'jquery',
    'backbone',
    'model/test/Base',
    'config'
], function(
    $,
    Backbone,
    ModelTestBase,
    Config
) {
    return Backbone.Collection.extend({
        model: ModelTestBase,

        /**
         * Order test by putting bad ones first.
         */
        comparator: function(model1, model2) {
            var result = model2.requiresFollowUp() - model1.requiresFollowUp();

            if (result == 0) {
                // both good or both bad
                return model1.getDefaultOrder() - model2.getDefaultOrder();
            } else {
                // one good and one bad
                return result;
            }
        }
    });
});
