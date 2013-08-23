define([
    'jquery',
    'underscore',
    'backbone',
    'model/test/Base',
    'model/test/Felv',
    'model/test/Fiv'
], function(
    $,
    _,
    Backbone,
    ModelTestBase,
    ModelTestFelv,
    ModelTestFiv
) {
    return ModelTestBase.extend({
        _defaultOrder: 600,
        _simpleTitle: 'FeLV & FIV',

        constructor: function(mFivTest, mFelvTest, attributes) {
            if (!mFivTest && !mFelvTest) {
                throw new Error('No tests specified. FIV and/or FeLV test must be specified.');
            }

            if (mFivTest && !(mFivTest instanceof ModelTestFiv)) {
                throw new Error('Not a valid instance of FIV test.');
            }

            if (mFelvTest && !(mFelvTest instanceof ModelTestFelv)) {
                throw new Error('Not a valid instance of FeLV test.');
            }

            this._mFivTest = mFivTest;
            this._mFelvTest = mFelvTest;

            this.id = ((this._mFivTest) ? this._mFivTest.id : '') + ((this._mFelvTest) ? this._mFelvTest.id : '');

            ModelTestBase.apply(this, [attributes]);
        },

        getType: function() {
            return 'felv-fiv';
        },

        requiresFollowUp: function() {
            if ((this.hasFivTest() && this.getFivTest().requiresFollowUp())
                || (this.hasFelvTest() && this.getFelvTest().requiresFollowUp())) {
                return true;
            } else {
                return false;
            }
        },

        getAllTestCodes: function() {
            var testCodes = [];

            if (this.hasFelvTest()) {
                testCodes = testCodes.concat(this.getFelvTest().getAllTestCodes());
            }

            if (this.hasFivTest()) {
                testCodes = testCodes.concat(this.getFivTest().getAllTestCodes());
            }

            return testCodes;
        },

        getReport: function() {
            if (this.hasFivTest()) {
                return this.getFivTest().getReport();
            } else if (this.hasFelvTest()) {
                return this.getFelvTest().getReport();
            } else {
                throw new Error('Neither FIV nor FeLV test present. Unable to get report.');
            }
        },

        hasFivTest: function() {
            return !!this._mFivTest;
        },

        hasFelvTest: function() {
            return !!this._mFelvTest;
        },

        getFivTest: function() {
            return this._mFivTest;
        },

        getFelvTest: function() {
            return this._mFelvTest;
        }
    });
});
