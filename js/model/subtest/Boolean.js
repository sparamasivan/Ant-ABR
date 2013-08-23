define([
    'jquery',
    'backbone',
    'model/subtest/Base'
], function(
    $,
    Backbone,
    ModelSubtestBase
) {
	return ModelSubtestBase.extend({
        getValue: function() {
            var result = this.get('valueText');
            var label = this.get('label');

            var validValues = ['Glucose-Strip', 'Protein', 'Ketones', 'Bilirubin'];

            if ($.inArray(label, validValues) > -1) {
                result = result || '';
                return (result.toLowerCase() !== "neg" && result.toLowerCase() !== "negative");
            } else if (label.toLowerCase().match(/parasite #/)){
                result = result || '';
                return (result !== '');
            }
            else{
                result = result || '';
                return (result.toLowerCase() === 'pos' || result.toLowerCase() === 'positive');
            }
        },

        getMessage: function() {
            if (!this.options || !this.options.messageTypes)
                return false;

            return this.getValue()
                ? this.options.messageTypes['yes']
                : this.options.messageTypes['no'];
        }
    });
});
