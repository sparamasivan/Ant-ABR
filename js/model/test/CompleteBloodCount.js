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
        _defaultOrder: 200,
        _simpleTitle: 'CBC',

        getModelPlateletRange: function() {
            return this._getSubtestByTypeAndLabel('Platelets', 'Platelet Count');
        },

        getModelWbcRange: function() {
            return this._getSubtestByTypeAndLabel('WBC', 'WBC');
        },

        getModelRbcRange: function() {
            return this._getSubtestByTypeAndLabel('RBC', 'RBC');
        },

        _getTotalCount: function() {
            return this.getModelPlateletRange().getValue() * 1000
                + this.getModelWbcRange().getValue() * 1000
                + this.getModelRbcRange().getValue() * 1000000;
        },

        getPlateletPercentage: function() {
            return this.getModelPlateletRange().getValue() * 1000 / this._getTotalCount() * 100;
        },

        getRbcPercentage: function() {
            return this.getModelRbcRange().getValue() * 1000000 / this._getTotalCount() * 100;
        },

        getWbcPercentage: function() {
            return this.getModelWbcRange().getValue() * 1000 / this._getTotalCount() * 100;
        },

        getRbcSize: function() {
            var subtest = this._getSubtestByTypeAndLabel('RBC', 'MCV');

            if (subtest.isLow()) {
                return 'small';
            } else if (subtest.isHigh()) {
                return 'large';
            } else {
                return 'normal';
            }
        },

        /**
         * If "Anisocytosis" or "Spherocytes" test codes exist, then "irregular", otherwise "normal".
         * @return {String}
         */
        getRbcShape: function() {
            if (this._tryGetSubtestByTypeAndLabel('RBC', 'Anisocytosis')
                || this._tryGetSubtestByTypeAndLabel('RBC', 'Spherocytes')
            ) {
                return 'irregular';
            } else {
                return 'normal';
            }
        },

        getRbcColor: function() {
            var hgb = this._getSubtestByTypeAndLabel('RBC', 'HGB');

            if (hgb.isLow()) {
                return 'pale';
            } else {
                return 'red';
            }
        },

        getWbcCellRanges: function() {
            return {
                neutrophil: this._getSubtestByTypeAndLabel('WBC', 'Absolute Neutrophils'),
                band: this._tryGetSubtestByTypeAndLabel('WBC', 'Absolute Bands'),
                lymphocyte: this._getSubtestByTypeAndLabel('WBC', 'Absolute Lymphocytes'),
                monocyte: this._getSubtestByTypeAndLabel('WBC', 'Absolute Monocytes'),
                eosinophil: this._getSubtestByTypeAndLabel('WBC', 'Absolute Eosinophils'),
                basophil: this._getSubtestByTypeAndLabel('WBC', 'Absolute Basophils')
            };
        },

        getWbcCellTotal: function() {
            var ranges = this.getWbcCellRanges(),
                total = 0;

            $.each(ranges, function(i, range) {
                total += range.getValue();
            });

            return total;
        },

        getWbcDefenderCellInfo: function() {
            var ranges = this.getWbcDefenderCellRanges(),
                total = this.getWbcCellTotal();

            return {
                percentage: (ranges.neutrophil.getValue() + ranges.band.getValue()) / total,
                ranges: {
                    neutrophil: {
                        title: 'Neutrophils',
                        percentage: ranges.neutrophil.getValue() / total,
                        model: ranges.neutrophil,
                    },

                    band: {
                        title: 'Bands',
                        percentage: ranges.band.getValue() / total,
                        model: ranges.band
                    }
                }
            }
        },

        _createSubtest: function(subtestData) {
            var type = subtestData.testType,
                label = subtestData.label;

            switch(type) {
                case 'RBC':
                    switch(label) {
                        case 'RBC':
                        case 'MCV':
                        case 'HGB':
                        case 'MCH':
                        case 'MCHC':
                            return new ModelSubtestRange(subtestData);

                        default:
                            return ModelTestBase.prototype._createSubtest.apply(this, arguments);
                    }

                case 'WBC':
                    switch(label) {
                        case 'WBC':
                        case 'Absolute Neutrophils':
                        case 'Absolute Bands':
                        case 'Absolute Basophils':
                        case 'Absolute Monocytes':
                        case 'Absolute Eosinophils':
                        case 'Absolute Lymphocytes':
                            return new ModelSubtestRange(subtestData);

                        default:
                            return ModelTestBase.prototype._createSubtest.apply(this, arguments);
                    }

                case 'Platelets':
                    switch(label) {
                        case 'Platelet Count':
                            return new ModelSubtestRange(subtestData);

                        default:
                            return ModelTestBase.prototype._createSubtest.apply(this, arguments);
                    }

                default:
                    return ModelTestBase.prototype._createSubtest.apply(this, arguments);
            }
            
        }
    }, {
        RBC_SIZES: [
            {type: 'normal', label: 'Normal'},
            {type: 'small', label: 'Small'},
            {type: 'large', label: 'Large'}
        ],
        RBC_SHAPES: [
            {type: 'normal', label: 'Normal'},
            {type: 'irregular', label: 'Irregular'}
        ],
        RBC_COLORS: [
            {type: 'red', label: 'Red'},
            {type: 'pale', label: 'Pale'}
        ]
    });
});
