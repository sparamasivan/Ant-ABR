define([
    'backbone',
    'model/subtest/Base'
], function(
    Backbone,
    ModelSubtestBase
) {
    return ModelSubtestBase.extend({
        getValue: function() {
            return parseFloat(this.get('value'));
        },

        getUnitOfMeasure: function() {
            return this.get('unitOfMeasure');
        },

        getMinValue: function() {
            return parseFloat(this.get('minValue'));
        },

        getMaxValue: function() {
            return parseFloat(this.get('maxValue'));
        },

        isLow: function() {
            return (this.getValue() < this.getMinValue());
        },

        isHigh: function() {
            return (this.getValue() > this.getMaxValue());
        },

        isNormal: function() {
            return (this.getValue() <= this.getMaxValue() && this.getValue() >= this.getMinValue());
        },

        getValueStatus: function() {
            if (this.isLow()) {
                return 'low';
            } else if (this.isHigh()) {
                return 'high';
            } else {
                return 'normal';
            }
        },

        getPercentageValue: function(expectedRangePercentage) {
            var outsideExpectedRange = (100 - expectedRangePercentage) / 2,
                percentageValue = outsideExpectedRange + (
                    expectedRangePercentage / (
                        this.getMaxValue() - this.getMinValue()
                    ) * (
                        this.getValue() - this.getMinValue()
                    )
                );

            // ensure value doesn't get out of bounds
            if (percentageValue < 5) percentageValue = 5;
            else if (percentageValue > 95) percentageValue = 95;

            return {
                insideExpectedRange: expectedRangePercentage,
                outsideExpectedRange: outsideExpectedRange,
                percentageValue: percentageValue
            };
        }
    });
});
