define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'model/Base',
    'model/subtest/Base',
    'model/subtest/Boolean',
    'model/subtest/Range'
], function(
    $,
    _,
    Backbone,
    Config,
    ModelBase,
    ModelSubtestBase,
    ModelSubtestBoolean,
    ModelSubtestRange
) {
    return ModelBase.extend({
        _defaultOrder: null,
        _booleanResultMessages: {},

        parse: function(resp, options) {
            var self = this,
                subtests = {};

            _.each(resp.subTests, function(subtest, key) {
                var testCodes = [];

                _.each(subtest.testCodes, function(testCode) {
                    // create subtest model
                    testCodes.push(self._createSubtest(testCode));
                });

                subtests[key] = _.extend({}, subtest, {
                    testCodes: testCodes
                });
            });

            this._subtests = subtests;

            return resp;
        },

        getType: function() {
            var type = this.get('type');
            return Config.getFrontendTestTypeByBackendType(type);
        },

        requiresFollowUp: function() {
            return this.get('followUpStatus') === 1;
        },

        getTitle: function() {
            return this.get('title');
        },

        getReport: function() {
            return this.report;
        },

        /**
         * Returns the default order position of this test in relation to other tests.
         * @return {Number}
         */
        getDefaultOrder: function() {
            if (typeof this._defaultOrder != 'number') {
                throw new Error('Default order not defined for test.');
            }

            return this._defaultOrder;
        },

        getSubtests: function() {
            return this._subtests;
        },

        getAllTestCodes: function() {
            var subtests = this.getSubtests(),
                allTestCodes = [];

            _.each(subtests, function(subtestCategory, subtestCategoryName) {
                _.each(subtestCategory.testCodes, function(testCode, i) {
                    allTestCodes.push(testCode);
                });
            })

            if (!allTestCodes.length) {
                throw new Error('No test codes present in test. (id: ' + this.id + ', ' + 'type: ' + this.getType() + ')');
            }

            return allTestCodes;
        },

        getSimpleTitle: function() {
            if (!this._simpleTitle) {
                throw new Error('Simple title not defined for Test object. (id: ' + this.id + ', ' + 'type: ' + this.getType() + ')');
            }

            return this._simpleTitle;
        },

        _createSubtest: function(subtestData) {
            var type = subtestData.testType;

            switch(type) {
                case 'boolean':
                    return new ModelSubtestBoolean(subtestData, {
                        messageTypes: this._getBooleanResultMessagesByLabel(subtestData.label)
                    });

                case 'range':
                case 'rangePercent':
                    return new ModelSubtestRange(subtestData);

                default:
                    return new ModelSubtestBase(subtestData);
            }
        },

        _tryGetSubtestByTypeAndLabel: function(type, label) {
            var result = null;

            $.each(this.getAllTestCodes(), function(i, subtest) {
                if (subtest.getType() == type && subtest.getLabel() == label) {
                    result = subtest;
                    return false;
                }
            });

            return result;
        },

        _getSubtestByTypeAndLabel: function(type, label) {
            var result = this._tryGetSubtestByTypeAndLabel(type, label);

            if (!result) {
                throw new Error('Failed to find subtest by type (' + type + ') and label (' + label + ') in test (id: ' + this.id + ', type: ' + this.getType() + ').');
            }

            return result;
        },

        _tryGetSubtestByLabel: function(label) {
            var result = null;

            $.each(this.getAllTestCodes(), function(i, subtest) {
                if (subtest.get('label') == label) {
                    result = subtest;
                    return false;
                }
            });

            return result;
        },

        _getSubtestByLabel: function(label) {
            var result = this._tryGetSubtestByLabel(label);

            if (!result) {
                throw new Error('Failed to find subtest by label (' + label + ') in test (id: ' + this.id + ', type: ' + this.getType() + ').');
            }

            return result;
        },

        _getBooleanResultMessagesByLabel: function(label) {
            var patient = this.getReport().getDataPatient(),
                messageTypes = this._getBooleanResultMessages()[label];

            if (!messageTypes) {
                return null;
            }

            _.each(messageTypes, function(template, key) {
                messageTypes[key] = Handlebars.compile(template)({
                    patient: patient
                })
            });

            return messageTypes;
        },

        _getBooleanResultMessages: function() {
            return this._booleanResultMessages;
        }
    });
});
