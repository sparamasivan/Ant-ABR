define([
    'jquery',
    'backbone',
    'handlebars',
    'model/subtest/Range',
    'text!template/subtest/Range.html',
    'view/widget/Indicator',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    ModelSubtestRange,
    Template,
    WidgetIndicator
) {
    var EXPECTED_RANGE_PERCENTAGE = 70;

    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelSubtestRange)) {
                throw new Error('model not an instanceof ModelSubtestRange');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var isBad = (this.model.getValue() < this.model.getMinValue() || this.model.getValue() > this.model.getMaxValue()),
                cssClass,
                wIndicator;

            // render template
            this.setElement($(this.template({
                value: this.model.getValue(),
                unit: this.options.unitOfMeasure || this.model.getUnitOfMeasure(),
                classes: this.options.classes,
                range: {
                    minimum: this.model.getMinValue(),
                    maximum: this.model.getMaxValue()
                },
                name: this.options.name,
                message: (this.options.message) ? this.options.message[(isBad) ? 'bad' : 'good'] : null,
                description: (this.options.description) ? this.options.description[(isBad) ? 'bad' : 'good'] : null
            })));

            // render indicator
            wIndicator = new WidgetIndicator({
                isBad: isBad,
                isBig: true
            });
            wIndicator.render(this.$el.find('.indicator'));

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

            // attach tooltip
            if (this.options.message || this.options.description) {
                this.$el.find('.widget-indicator').tooltip({
                    content: {
                        text: this.$el.find('.description')
                    },
                    position: {
                        my: 'top center',
                        at: 'bottom center'
                    },
                    style: {
                        classes: 'message-tooltip'
                    }
                });
            }
        },

        /**
         * Use percentage values to position html element dynamically based on the data
         */
        _positionRangeElements: function() {
            var value = this.model.getPercentageValue(EXPECTED_RANGE_PERCENTAGE);

            // expected value
            this.$el.find('.expected .value, .actual .expected-value').css({
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
