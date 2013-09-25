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
    var Model = ModelTestBase.extend({
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

        getWbcCellPercentageByType: function(type) {
            var range = this.getWbcCellRanges()[type],
                totalCells = this.getWbcCellTotal();

            return range.getValue() / totalCells * 100;
        },

        getWbcCellPercentageByGroupType: function(groupType) {
            var self = this,
                percentage = 0;

            // format cell type components for template
            $.each(Model.WBC_CELL_TYPE_COMPONENTS[groupType], function(i, component) {
                percentage += self.getWbcCellPercentageByType(component.type);
            });

            return percentage;
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
            {type: 'normal', label: 'Normal', bad: false},
            {type: 'small', label: 'Small', bad: true},
            {type: 'large', label: 'Large', bad: true}
        ],
        RBC_SHAPES: [
            {type: 'normal', label: 'Normal', bad: false},
            {type: 'irregular', label: 'Irregular', bad: true}
        ],
        RBC_COLORS: [
            {type: 'red', label: 'Red', bad: false},
            {type: 'pale', label: 'Pale', bad: true}
        ],

        WBC_CELL_GROUPS: ['fighter', 'defender', 'watcher'],

        WBC_CELL_TYPE_COMPONENTS: {
            defender: [{
                title: 'Lymphocytes',
                type: 'lymphocyte'
            }, {
                title: 'Monocytes',
                type: 'monocyte'
            }],

            fighter: [{
                title: 'Neutrophils',
                type: 'neutrophil'
            }, {
                title: 'Bands',
                type: 'band'
            }],

            watcher: [{
                title: 'Eosinophils',
                type: 'eosinophil'
            }, {
                title: 'Basophils',
                type: 'basophil'
            }]
        }
    });

    return Model;
});
