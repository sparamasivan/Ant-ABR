define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/UrineAnalysis.html',
    'view/subtest/Pod/Boolean',
    'config',
    'model/MediaQuery',
    'jquery-equal-heights',
    'jquery-tooltip'
], function(
    $,
    _,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestBoolean,
    Config,
    ModelMediaQuery
) {
    return ViewTestBase.extend({
        title: 'URINALYSIS',

        templateContent: Handlebars.compile(Template),

        render: function(parent) {
            var mConcentration = this.model.getModelConcentration(),
                mPh = this.model.getModelPh();

            $.extend(this._overview, {
                descriptionTemplate: 'Analyzing {{patient.name}}’s urine gives us an excellent snapshot of how the body’s organs and systems are functioning.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
                patient: this.model.getReport().getDataPatient(),

                color: Config.getUrineColorInfoById(this.model.getModelColor().getValueText()),

                appearance: Config.getUrineAppearanceInfoById(this.model.getModelAppearance().getValueText()),

                microscopicComponents: _(this.model.getMicroscopicComponentModels())
                    .chain()
                    .map(function(model) {
                        var e4 = (model.getValueText() || "").toLowerCase();
                        
                        if(e4 != 'neg' && e4 != 'negative' && !e4.match(/^none*/)){
                            return {
                                label: model.getLabel(),
                                isGood: model.getValue(),
                                description: model.getDescription()
                            }
                        } else {
                            return false;
                        }
                    })
                    .reject(function(item) {
                        return item === false;
                    })
                    .value(),

                concentrations: [
                    {label: 'Diluted', isSelected: mConcentration.isLow()},
                    {label: 'Concentrated', isSelected: !mConcentration.isLow()}
                ],

                phs: [
                    {label: 'Acidic', isSelected: mPh.isLow()},
                    {label: 'Neutral', isSelected: mPh.isNormal()},
                    {label: 'Alkaline', isSelected: mPh.isHigh()}
                ]
            }));

            this.$elContent.find('.subsection-chemical-analysis .attribute-list').equalHeights();
            this.$elContent.find('.subsection-chemical-analysis .column').equalHeights({
                callback: function(tallestHeight) {
                    return !ModelMediaQuery.isPhoneMedia();
                }
            });

            // microscopic components tooltips
            this.$elContent.find('.components .component').tooltip({
                position: {
                    my: 'right center',
                    at: 'left center'
                }
            });

            // glucose
            this._renderMetabolicSubcomponent(
                this.$elContent.find('.metabolic-components .glucose'),
                this.model.getModelGlucoseBoolean()
            );

            // protein
            this._renderMetabolicSubcomponent(
                this.$elContent.find('.metabolic-components .protein'),
                this.model.getModelProteinBoolean()
            );

            // ketones
            this._renderMetabolicSubcomponent(
                this.$elContent.find('.metabolic-components .ketones'),
                this.model.getModelKetonesBoolean()
            );

            // bilirubin
            this._renderMetabolicSubcomponent(
                this.$elContent.find('.metabolic-components .bilirubin'),
                this.model.getModelBilirubinBoolean()
            );

            // refresh widget whenever screen is resized
            this.refresh();
            ModelMediaQuery.on('change:windowWidth', $.proxy(this.refresh, this));
        },

        refresh: function() {
            var elKidneyBladder = this.$elContent.find('.kidney-bladder'),
                elVisualAnalysis = this.$elContent.find('.visual-analysis'),
                elBracket = this.$elContent.find('.bracket .vertical');

            ViewTestBase.prototype.refresh.apply(this, arguments);

            // adjust the height of the bracket
            elBracket.height(Math.max(elKidneyBladder.height(), elVisualAnalysis.height()));
        },

        _renderMetabolicSubcomponent: function(parent, model) {
            var view = new ViewSubtestBoolean({
                    model: model
                });

            view.render(parent);
        }
    });
});
