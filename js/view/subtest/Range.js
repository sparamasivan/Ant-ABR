define([
    'jquery',
    'backbone',
    'handlebars',
    'model/subtest/Range',
    'text!template/subtest/Range.html'
], function(
    $,
    Backbone,
    Handlebars,
    ModelSubtestRange,
    Template
) {
    var EXPECTED_RANGE_PERCENTAGE = 70;

    return Backbone.View.extend({
        options: {
            skin: 'green'
        },

        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelSubtestRange)) {
                throw new Error('model not an instanceof ModelSubtestRange');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var cssClass;

            // render template
            this.setElement($(this.template({
                value: this.model.getValue(),
                unit: this.options.unitOfMeasure || this.model.getUnitOfMeasure(),
                range: {
                    minimum: this.model.getMinValue(),
                    maximum: this.model.getMaxValue()
                },
                name: this.options.name,
                skin: this.options.skin
            })));

            // add a class that will allow us to style according to low/normal/high range type
            if (this.model.getValue() < this.model.getMinValue()) {
                cssClass = 'value-low';
            } else if (this.model.getValue() > this.model.getMaxValue()) {
                cssClass = 'value-high';
            } else {
                cssClass = 'value-normal';
            }
            this.$el.addClass(cssClass);

            this._positionRangeElements();

            this.$el.appendTo(parent);
        },

        /**
         * Use percentage values to position html element dynamically based on the data
         */
        _positionRangeElements: function() {
            var value = this.model.getPercentageValue(EXPECTED_RANGE_PERCENTAGE);

            // expected value
            this.$el.find('.expected .value').css({
                width: value.insideExpectedRange + '%',
                marginLeft: value.outsideExpectedRange + '%'
            });

            // actual value
            this.$el.find('.actual .value').css({
                width: value.percentageValue + '%'
            });

            // marker value - same as actual value
            this.$el.find('.marker').css({
                left: value.percentageValue + '%'
            });
        }
    });
});
