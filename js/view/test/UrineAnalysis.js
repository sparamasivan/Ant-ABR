define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/UrineAnalysis.html',
    'text!template/test/urineanalysis/ChemicalComponent.html',
    'text!template/test/urineanalysis/MicroscopicParticle.html',
    'view/subtest/pod/Boolean',
    'config',
    'view/widget/TestSubsection',
    'view/subtest/Select',
    'jquery-tooltip'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    TemplateChemicalComponent,
    TemplateMicroscopicParticle,
    ViewSubtestBoolean,
    Config,
    ViewWidgetTestSubsection,
    ViewSubtestSelect
) {
    var mathRound = function(value, decimalPlaces) {
        var roundedValue = Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        return roundedValue.toFixed(decimalPlaces);
    }

    return ViewTestBase.extend({
        title: 'URINALYSIS',

        templateContent: Handlebars.compile(Template),

        templateChemicalComponentContent: Handlebars.compile(TemplateChemicalComponent),

        templateMicroscopicParticleContent: Handlebars.compile(TemplateMicroscopicParticle),

        render: function(parent) {
            var mPh = this.model.getModelPh(),
                phValue = mathRound(mPh.getValue(), 1);

            $.extend(this._overview, {
                descriptionTemplate: 'Analyzing {{patient.name}}’s urine gives us an excellent snapshot of how the body’s organs and systems are functioning.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
                patient: this.model.getReport().getDataPatient(),

                color: Config.getUrineColorInfoById(this.model.getModelColor().getValueText()),
                
                appearance: Config.getUrineAppearanceInfoById(this.model.getModelAppearance().getValueText()),

                ph: {
                    value: phValue,
                    isBad: (phValue < 5.5 || phValue > 7) ? true : false,
                    valueRounded: Math.floor((phValue < 0) ? 0 : ((phValue >= 10) ? 9 : phValue - 0.01 ))
                }
            }));

            this._renderVisualAnalysisSection(this.$elContent.find('.test-section.visual'));

            this._renderChemicalAnalysisSection(this.$elContent.find('.test-section.visual'));
        },

        _renderVisualAnalysisSection: function(parent) {
            this._renderMicroscopicParticleSubsection(parent.find('.test-subsection.particle'));
        },

        _renderMicroscopicParticleSubsection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // create subsection
                view = new ViewWidgetTestSubsection({
                    title: Handlebars.compile('Microscopic Particles')({patient: patient}),
                    text: Handlebars.compile('The following components were found in {{{patient.name}}}’s urine:')({patient: patient})
                }),

                // prepare subsection content
                contentEl = $(this.templateMicroscopicParticleContent({
                    components: _(this.model.getMicroscopicComponentModels())
                        .chain()
                        .map(function(model) {
                            var e4 = (model.getValueText() || "").toLowerCase();
                            
                            if(e4 != 'neg' && e4 != 'negative' && !e4.match(/^none*/)){
                                return {
                                    label: model.getLabel(),
                                    description: model.getDescription()
                                }
                            } else {
                                return false;
                            }
                        })
                        .reject(function(item) {
                            return item === false;
                        })
                        .value()
                }));

            // render subsection
            view.render(parent);

            // append subsection content to subsection
            view.setContent(contentEl);
        },

        _renderChemicalAnalysisSection: function(parent) {
            var mConcentration = this.model.getModelConcentration(),
                patient = this.model.getReport().getDataPatient(),
                viewSubtest;

            // concentration
            viewSubtest = new ViewSubtestSelect({
                description: Handlebars.compile('This level reflects the water balance in {{{patient.name}}}’s body, which should be concentrated. If {{patient.name}} drinks too much water, the kidneys will dump it, resulting in diluted urine.')({patient: patient}),
                options: [
                    'Diluted',
                    'Neutral',
                    'Concentrated'
                ],
                /*
                    Overall range: 1.001 - 1.060
                    Diluted: 1.001 - 1.009
                    Neutral: 1.010 - 1.020
                    Concentrated: 1.021 - 1.060
                */
                selectedIndex: (mConcentration.getValue() < 1.010) ? 0 : ((mConcentration.getValue() > 1.020) ? 2 : 1),
                // always good
                selectedIsBad: false
            });
            viewSubtest.render(parent.find('.select'));

            this._renderChemicalComponentSubsection(parent.find('.test-subsection.component'));
        },

        _renderChemicalComponentSubsection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // create subsection
                view = new ViewWidgetTestSubsection({
                    title: Handlebars.compile('Chemical Components')({patient: patient}),
                    text: Handlebars.compile('The following comptonents were found in {{{patient.name}}}’s urine:')({patient: patient})
                }),

                // prepare subsection content
                contentEl = $(this.templateChemicalComponentContent({}));

            // render subsection
            view.render(parent);

            // append subsection content to subsection
            view.setContent(contentEl);

            // glucose
            this._renderMetabolicSubcomponent(
                contentEl.find('.glucose'),
                this.model.getModelGlucoseBoolean()
            );

            // protein
            this._renderMetabolicSubcomponent(
                contentEl.find('.protein'),
                this.model.getModelProteinBoolean()
            );

            // ketones
            this._renderMetabolicSubcomponent(
                contentEl.find('.ketones'),
                this.model.getModelKetonesBoolean()
            );

            // bilirubin
            this._renderMetabolicSubcomponent(
                contentEl.find('.bilirubin'),
                this.model.getModelBilirubinBoolean()
            );
        },

        _renderMetabolicSubcomponent: function(parent, model) {
            var view = new ViewSubtestBoolean({
                    model: model
                });

            view.render(parent);
        }
    });
});
