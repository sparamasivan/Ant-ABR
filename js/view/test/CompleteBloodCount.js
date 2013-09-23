define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/CompleteBloodCount.html',
    'view/subtest/Range',
    'model/test/CompleteBloodCount',
    'view/subtest/TypesOfCell',
    'model/MediaQuery',
    'goog!visualization,1,packages:[corechart,geochart]',
    'jquery-equal-heights',
    'jquery-waitforimages'
], function(
    $,
    Backbone,
    Handlebars,
    ViewTestBase,
    Template,
    ViewSubtestRange,
    ModelTestCompleteBloodCount,
    ViewSubtestTypesOfCell,
    ModelMediaQuery
) {
    return ViewTestBase.extend({
        title: 'CBC',

        templateContent: Handlebars.compile(Template),

        _viewSubtestTypesOfCell: null,

        render: function(parent) {
            var rbc = {
                    size: this.model.getRbcSize(),
                    shape: this.model.getRbcShape(),
                    color: this.model.getRbcColor()
                };

            $.extend(this._overview, {
                descriptionTemplate: 'The CBC (Complete Blood Count) test examines the health and numbers of {{patient.name}}’s cells.'
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
                patient: this.model.getReport().getDataPatient(),

                rbc: {
                    sizes: this._formatRbcAttributesForTemplate(ModelTestCompleteBloodCount.RBC_SIZES, rbc.size),
                    shapes: this._formatRbcAttributesForTemplate(ModelTestCompleteBloodCount.RBC_SHAPES, rbc.shape),
                    colors: this._formatRbcAttributesForTemplate(ModelTestCompleteBloodCount.RBC_COLORS, rbc.color),
                    clipartUrl: 'images/test/cbc/rbc/clipart/' + ['normal', rbc.shape, rbc.color].join('-') + '.png'
                }
            }));

            this._renderRedBloodCellSubsection(this.$elContent.find('.subsection-rbc'));

            this._renderWhiteBloodCellSubsection();

            this._renderPlateletSubsection(this.$elContent.find('.subsection-platelet'));
        },

        refresh: function() {
            ViewTestBase.prototype.refresh.apply(this, arguments);
            this._viewSubtestTypesOfCell.refresh();
        },

        _formatRbcAttributesForTemplate: function(attributes, selectedType) {
            return $.map(attributes, function(attribute) {
                return {
                    label: attribute.label,
                    isSelected: (attribute.type == selectedType)
                }
            });
        },

        _renderRedBloodCellSubsection: function(parent) {
            var view = new ViewSubtestRange({
                model: this.model.getModelRbcRange(),
                name: this.model.getReport().getDataPatient().name,
                unitOfMeasure: 'MILLION/uL'
            });
            view.render(parent.find('.diagram-rbc-result'));

            parent.find('.attribute-list').equalHeights();
            parent.find('.cell-attribute-column').equalHeights({
                callback: function(tallestHeight) {
                    return !ModelMediaQuery.isPhoneMedia();
                }
            });
            
            
            var data = new google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['RBC', this.model.getRbcPercentage()],
                ['Other', 100 - this.model.getRbcPercentage()]
            ]);

            var chart = new google.visualization.PieChart(parent.find('.chart')[0]);
            chart.draw(data, {
                pieHole: 0.3,
                backgroundColor: {
                    fill: 'none'
                },
                chartArea: {
                    width: '200%',
                    height: '200%'
                },
                legend: {
                    position: 'none'
                },
                pieSliceBorderColor: 'none',
                pieSliceText: 'none',
                slices: [
                    {color: '#00b8d5'},
                    {color: '#e9eae4'}
                ],
                enableInteractivity: false
            });
        },

        _renderWhiteBloodCellSubsection: function() {
            // range
            var view = new ViewSubtestRange({
                model: this.model.getModelWbcRange(),
                name: this.model.getReport().getDataPatient().name,
                unitOfMeasure: 'THOUSAND/uL'
            });
            view.render(this.$elContent.find('.diagram-wbc-result'));

            // types of cells
            view = new ViewSubtestTypesOfCell({
                ranges: this.model.getWbcCellRanges(),
                species: this.model.getReport().getPatientSpecies(),
                patient: this.model.getReport().getDataPatient()
            });
            view.render(this.$elContent.find('.diagram-wbc-breakdown'));
            this._viewSubtestTypesOfCell = view;
        },

        _renderPlateletSubsection: function(parent) {
            var view = new ViewSubtestRange({
                model: this.model.getModelPlateletRange(),
                name: this.model.getReport().getDataPatient().name,
                unitOfMeasure: 'THOUSAND/uL'
            });
            view.render(this.$elContent.find('.diagram-platelet-result'));

            parent.waitForImages(function() {
                $(this).find('.clumping .column .yui3-u-c').equalHeights({
                    callback: function(tallestHeight) {
                        return !ModelMediaQuery.isPhoneMedia();
                    }
                });
            });
        }
    });
});
