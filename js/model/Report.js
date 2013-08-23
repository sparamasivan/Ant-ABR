define([
    'jquery',
    'backbone',
    'model/Base',
    'collection/Test',
    'model/test/FelvFiv',
    'config'
], function(
    $,
    Backbone,
    ModelBase,
    CollectionTest,
    ModelTestFelvFiv,
    Config
) {
    /**
     * @class ModelReport
     * @constructor
     * @extends Backbone.Model
     * @param {Object} attributes Configuration settings.
     * @param {String} attributes.authToken Authorization token to use when requesting data from server.
     * @param {String} attributes.context Base url to data server.
     * @param {String} attributes.endpoint Relative url to model data.
     */
    return ModelBase.extend({
        _fetchTestCollectionPromise: null,
        _fetchAggregatedTestCollectionPromise: null,

        fetchTestCollection: function() {
            var self = this,
                deferred,
                promises = [],
                dataTests,
                collection;

            if (this._fetchTestCollectionPromise) {
                // data is already being fetched
                return this._fetchTestCollectionPromise;
            }

            deferred = new $.Deferred();

            // initialize collection
            collection = new CollectionTest();
            collection.authToken = _.result(this, 'authToken');
            collection.url = _.result(this, 'urlRoot');

            dataTests = this.getDataTests();

            // fetch data for each test
            $.each(dataTests, function(i, dataTest) {
                var backendType = dataTest.type,
                    frontendType,
                    modelTestModulePath;

                if (!backendType) {
                    throw new Error('Type of test (id: ' + dataTest.id + ') not defined in report (id: ' + self.getDataReport().id + ').');
                }

                frontendType = Config.getFrontendTestTypeByBackendType(backendType);
                modelTestModulePath = Config.getModelTestModuleByTestType(frontendType);

                // get the test model subclass for this test
                require([modelTestModulePath], function(ModelTest) {
                    var model = new ModelTest({
                        id: dataTest.testEndpoint
                    });

                    // set sync related properties
                    model.authToken = collection.authToken;
                    model.urlRoot = collection.url;

                    // allow test to reference report parent
                    model.report = self;

                    promises.push(model);

                    // fetch test data
                    model
                        .fetch()
                        .fail(function(deffered, status, error) {
                            throw new Error('Failed to fetch test: ' + status + ' : ' + error.toString());
                        })
                        .done(function() {
                            var len = collection.length;

                            // add to collection
                            collection.add(model);

                            // check if we got all tests
                            if (collection.length == dataTests.length) {
                                deferred.resolve(collection);
                                return;
                            }

                            // ensure that the we don't have duplicate tests
                            if (len == collection.length) {
                                throw new Error('Data inconsistency: "' + model.getType() + '" test has same id (' + model.id + ') as "' + collection.get(model.id).getType() + '" test.');
                            }
                        });
                });
            });

            this._fetchTestCollectionPromise = deferred.promise();

            return this._fetchTestCollectionPromise;
        },

        fetchAggregatedTestCollection: function() {
            if (this._fetchAggregatedTestCollectionPromise) {
                return this._fetchAggregatedTestCollectionPromise;
            }

            this._fetchAggregatedTestCollectionPromise = this.fetchTestCollection()
                .then(function(collection) {
                    var aggregatedTestCollection = new CollectionTest(),
                        mFivTest,
                        mFelvTest;

                    $.each(collection.models, function(i, model) {
                        switch(model.getType()) {
                            case 'fiv':
                                if (!mFivTest) {
                                    mFivTest = model;
                                } else {
                                    throw new Error('Unsupported: More than one "fiv" test found in report.');
                                }
                                break;

                            case 'felv':
                                if (!mFelvTest) {
                                    mFelvTest = model;
                                } else {
                                    throw new Error('Unsupported: More than one "felv" test found in report.');
                                }
                                break;

                            default:
                                aggregatedTestCollection.add(model);
                                break;
                        }
                    });

                    if (mFivTest || mFelvTest) {
                        aggregatedTestCollection.add(new ModelTestFelvFiv(mFivTest, mFelvTest));
                    }

                    return aggregatedTestCollection;
                });

            return this._fetchAggregatedTestCollectionPromise;
        },

        requiresFollowUp: function() {
            return 1 === this.getDataReport().followup;
        },

        getDataTests: function() {
            return this.getDataReport().tests;
        },

        getDataReport: function() {
            return this.get('report');
        },

        getDataPatient: function() {
            return this.get('meta').patient;
        },

        getDataDoctor: function() {
            return this.get('meta').doctor;
        },

        getDataClient: function() {
            return this.get('meta').client;
        },

        getDataClinic: function() {
            return this.get('meta').clinic;
        },

        getDoctorComment: function() {
            return this.getDataReport().approval.doctorComment;
        },

        getNextStepsComment: function() {
            return this.getDataReport().approval.nextStepsComment;
        },

        getDate: function() {
            return Config.parseDate(this.getDataReport().date);
        },

        getPatientSpecies: function() {
            var species = this.getDataPatient().species.toLowerCase();

            switch(species) {
                case 'dog':
                case 'canine':
                    return 'canine';

                case 'cat':
                case 'feline':
                    return 'feline';

                default:
                    throw new Error('Unable to normalize species type: ' + species);
            }
        }
    });
});
