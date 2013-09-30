define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'model/test/Base',
    'model/subtest/Range',
    'model/subtest/Boolean',
], function(
    $,
    _,
    Backbone,
    Handlebars,
    ModelTestBase,
    ModelSubtestRange,
    ModelSubtestBoolean
) {
    var 
        MICROSCOPIC_COMPONENT_LABELS = [
            'Occult blood',
            'WBC',
            'WBC Clumps',
            'RBC',
            'Casts',
            'Casts/LPF',
            'Crystals',
            'Struvite (Triple PO4) crystals',
            'Amorphous Phosphate crystals',
            'Calcium Oxalate Dihydrate crystals',
            'Calcium Oxalate Monohydrate crystals',
            'Bilirubin crystals',
            'CA Phos (Brushite) crystals',
            'Calcium Carbonate crystals',
            'Ammonium Biurate crystals',
            'Amorphous Urate crystals',
            'Amorphous crystals',
            'Uric Acid crystals',
            'Bacteria',
            'Epithelial cells',
            'Transitional Epithelia',
            'Squamous Epithelia',
            'Renal Epithelia',
            'Fat droplets',
            'Yeast/Fungi'
        ];

    return ModelTestBase.extend({
        _defaultOrder: 300,
        _simpleTitle: 'Urinalysis',
        _booleanResultMessages: {
            'Glucose-Strip': {
                yes: 'Glucose has been found in {{{patient.name}}}’s urine.',
                no: 'No glucose found in {{{patient.name}}}’s urine.'
            },
            'Protein': {
                yes: 'Protein has been found in {{{patient.name}}}’s urine.',
                no: 'No protein found in {{{patient.name}}}’s urine.'
            },
            'Ketones': {
                yes: 'Ketones has been found in {{{patient.name}}}’s urine.',
                no: 'No ketones found in {{{patient.name}}}’s urine.'
            },
            'Bilirubin': {
                yes: 'Bilirubin has been found in {{{patient.name}}}’s urine.',
                no: 'No bilirubin found in {{{patient.name}}}’s urine.'
            }
        },

        getModelConcentration: function() {
            return this._getSubtestByLabel('Specific gravity');
        },

        getModelPh: function() {
            return this._getSubtestByLabel('pH');
        },

        getModelColor: function() {
            return this._getSubtestByLabel('Color');
        },

        getModelAppearance: function() {
            return this._getSubtestByLabel('Appearance');
        },

        getMicroscopicComponentModels: function() {
            var self = this,
                components = [];

            $.each(MICROSCOPIC_COMPONENT_LABELS, function(i, label) {
                var component = self._tryGetSubtestByLabel(label);

                if (component) {
                    components.push(component);
                }
            });
            return components;
        },

        getModelGlucoseBoolean: function() {
            return this._getSubtestByLabel('Glucose-Strip');
        },

        getModelProteinBoolean: function() {
            return this._getSubtestByLabel('Protein');
        },

        getModelKetonesBoolean: function() {
            return this._getSubtestByLabel('Ketones');
        },

        getModelBilirubinBoolean: function() {
            return this._getSubtestByLabel('Bilirubin');
        },

        _createSubtest: function(subtestData) {
            var label = subtestData.label;

            switch(label) {
                case 'Glucose-Strip':
                    return new ModelSubtestBoolean(subtestData, {
                        messageTypes: this._getBooleanResultMessagesByLabel(label),
                        label: 'Glucose'
                    });

                case 'Protein':
                case 'Ketones':
                case 'Bilirubin':
                    return new ModelSubtestBoolean(subtestData, {
                        messageTypes: this._getBooleanResultMessagesByLabel(label)
                    });

                case 'Specific gravity':
                case 'pH':
                    return new ModelSubtestRange(subtestData);

                default:
                    return ModelTestBase.prototype._createSubtest.apply(this, arguments);
            }
        }
    });
});
