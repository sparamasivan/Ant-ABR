define([
    'jquery',
    'backbone',
    'handlebars',
    'view/test/Base',
    'text!template/test/CompleteBloodCount.html',
    'view/subtest/Range',
    'model/test/CompleteBloodCount',
    'view/subtest/TypesOfCell2',
    'model/MediaQuery',
    'view/widget/TestSubsection',
    'view/subtest/pod/Select',
    'view/subtest/pod/Color',
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
    ModelTestCbc,
    ViewSubtestTypesOfCell2,
    ModelMediaQuery,
    ViewWidgetTestSubsection,
    ViewSubtestSelect,
    ViewSubtestColor
) {
    var mathRound = function(value, decimalPlaces) {
        var roundedValue = Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        return roundedValue.toFixed(decimalPlaces);
    }

    return ViewTestBase.extend({
        title: 'CBC',

        templateContent: Handlebars.compile(Template),

        templateAppearanceContent: Handlebars.compile(
            '<div class="yui3-g-r">' +
                '<div class="yui3-u-1-3 yui3-u-1-2-small-tablet yui3-u-1-2-phone">' +
                    '<div class="yui3-u-c">' +
                        '<div class="size"></div>' +
                    '</div>' +
                '</div>' +

                '<div class="yui3-u-1-3 yui3-u-1-2-small-tablet yui3-u-1-2-phone">' +
                    '<div class="yui3-u-c">' +
                        '<div class="shape"></div>' +
                    '</div>' +
                '</div>' +

                '<div class="yui3-u-1-3 yui3-u-1-2-small-tablet yui3-u-1-2-phone">' +
                    '<div class="yui3-u-c">' +
                        '<div class="color"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ),

        render: function(parent) {
            $.extend(this._overview, {
                descriptionTemplate: 'The CBC (Complete Blood Cell Count) test examines the health and numbers of {{patient.name}}’s cells.',
                diagramFilename: 'diagram-' + this.model.getReport().getPatientSpecies() + '-2x.png'
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
                patient: this.model.getReport().getDataPatient()
            }));

            this._renderRbcSection(this.$elContent.find('.subsection-rbc'));

            this._renderWbcSection(this.$elContent.find('.subsection-wbc'));

            this._renderPlateletSection(this.$elContent.find('.subsection-platelet'));
        },

        _renderRbcSection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),
                view = new ViewSubtestRange({
                    model: this.model.getModelRbcRange(),
                    name: this.model.getReport().getDataPatient().name,
                    unitOfMeasure: 'MILLION/uL',
                    message: {
                        good: Handlebars.compile('{{{patient.name}}}’s red blood cell count is within expected range.')({patient: patient}),
                        bad: Handlebars.compile('{{{patient.name}}}’s red blood cell count is outside the expected range.')({patient: patient})
                    },
                    description: {
                        good: Handlebars.compile('We look at both the total number of red blood cells and their ratio to other cells to analyze {{{patient.name}}}’s well-being.')({patient: patient}),
                        bad: Handlebars.compile('However, an unexpected cell count does not necessarily mean the {{{patient.name}}}’s red blood cells are out of balance. We look not only at the number of red blood cells, but also their ratio to the other types of cells.')({patient: patient})
                    }
                });

            view.render(parent.find('.range'));

            this._renderPieChart(parent.find('.chart'), this.model.getRbcPercentage(), 0);

            this._renderRbcAppearanceSubsection(parent.find('.test-subsection.appearance'));
        },

        _renderRbcAppearanceSubsection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // create subsection
                view = new ViewWidgetTestSubsection({
                    title: Handlebars.compile('Appearance of {{{patient.name}}}’s Cells')({patient: patient}),
                    text: Handlebars.compile('They power {{{patient.name}}}’s body, carrying oxygen from the lungs to all the other cells and tissues, where it’s then turned into energy.')({patient: patient})
                }),

                // prepare subsection content
                contentEl = $(this.templateAppearanceContent()),
                
                viewSubtest,

                formatCellAttributesForSubtest = function(attributeValues, selectedType) {
                    var selectedIndex,
                        labels = $.map(attributeValues, function(attribute, index) {
                            if (attribute.type == selectedType) {
                                selectedIndex = index;
                            }

                            return attribute.label;
                        });

                    return {
                        labels: labels,
                        selectedIndex: selectedIndex
                    };
                },

                subtestData,

                elPods;

            // render subsection
            view.render(parent);

            // populate subsection with content
            view.setContent(contentEl);

            // --- populate subsection with subtests --- //

            // cell size
            subtestData = formatCellAttributesForSubtest(ModelTestCbc.RBC_SIZES, this.model.getRbcSize());
            viewSubtest = new ViewSubtestSelect({
                title: 'CELL SIZE',
                description: Handlebars.compile('{{{patient.name}}}’s blood is a mix of young, middle aged and old blood cells. Size helps determine their age and how much hemoglobin and oxygen they contain.')({patient: patient}),
                options: subtestData.labels,
                selectedIndex: subtestData.selectedIndex,
                selectedIsBad: ModelTestCbc.RBC_SIZES[subtestData.selectedIndex].bad
            });
            viewSubtest.render(contentEl.find('.size'));

            // cell shape
            subtestData = formatCellAttributesForSubtest(ModelTestCbc.RBC_SHAPES, this.model.getRbcShape());
            viewSubtest = new ViewSubtestSelect({
                title: 'CELL SHAPE',
                description: Handlebars.compile('Blood cells have to squeeze through tiny capillaries. After passing through, the blood cells should spring back to a round shape.')({patient: patient}),
                options: subtestData.labels,
                selectedIndex: subtestData.selectedIndex,
                selectedIsBad: ModelTestCbc.RBC_SHAPES[subtestData.selectedIndex].bad
            });
            viewSubtest.render(contentEl.find('.shape'));

            // cell color
            subtestData = formatCellAttributesForSubtest(ModelTestCbc.RBC_COLORS, this.model.getRbcColor());
            viewSubtest = new ViewSubtestColor({
                title: 'CELL COLOR',
                description: Handlebars.compile('Just like how chlorophyll makes plants green, oxygen and hemoglobin make blood red.')({patient: patient}),
                label: subtestData.labels[subtestData.selectedIndex],
                isBad: ModelTestCbc.RBC_COLORS[subtestData.selectedIndex].bad
            });
            viewSubtest.render(contentEl.find('.color'));

            // equalize pod heights
            elPods = contentEl.find('.view-subtest-pod-base >.inner');
            elPods.equalHeights({
                callback: function(tallestHeight) {
                    return !ModelMediaQuery.isPhoneMedia();
                }
            });

            // updated heights when subsection expanded
            view.on('expanded', function() {
                elPods.equalHeights('refresh');
            });
        },

        _renderWbcSection: function(parent) {
            // range
            var view = new ViewSubtestRange({
                model: this.model.getModelWbcRange(),
                name: this.model.getReport().getDataPatient().name,
                unitOfMeasure: 'THOUSAND/uL'
            });
            view.render(parent.find('.range'));

            this._renderPieChart(parent.find('.chart'), this.model.getWbcPercentage(), this.model.getRbcPercentage());

            this._renderWbcTypesOfCellSubsection(parent.find('.test-subsection.types-of-cell'));
        },

        _renderWbcTypesOfCellSubsection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // create subsection
                view = new ViewWidgetTestSubsection({
                    title: Handlebars.compile('Types of {{{patient.name}}}’s Cells')({patient: patient}),
                    text: Handlebars.compile('There are three types of WBC. Though they have different jobs and vary in number, they all work together to achieve balance.')({patient: patient})
                }),

                // prepare subsection content
                contentEl = $('<div />');

            // render subsection
            view.render(parent);

            // append subsection content to subsection
            view.setContent(contentEl);

            // types of cells
            view = new ViewSubtestTypesOfCell2({
                model: this.model
            });
            view.render(contentEl);
        },

        _renderPlateletSection: function(parent) {
            var view = new ViewSubtestRange({
                model: this.model.getModelPlateletRange(),
                name: this.model.getReport().getDataPatient().name,
                unitOfMeasure: 'THOUSAND/uL'
            });
            view.render(parent.find('.range'));

            this._renderPieChart(parent.find('.chart'), this.model.getPlateletPercentage(), this.model.getWbcPercentage() + this.model.getRbcPercentage());
        },

        _renderPieChart: function(parent, percentage, startPercentage) {
                // ensure percentage is visible
            var slicePercentage = (percentage < 1) ? 1 : percentage,

                data = new google.visualization.arrayToDataTable([
                    ['Label', 'Value'],
                    ['RBC', slicePercentage],
                    ['Other', 100 - slicePercentage]
                ]),

                chart = new google.visualization.PieChart(parent.find('.diagram')[0]);

            chart.draw(data, {
                pieHole: 0.3,
                backgroundColor: {
                    fill: 'none'
                },
                chartArea: {
                    width: '100%',
                    height: '100%'
                },
                legend: {
                    position: 'none'
                },
                pieSliceBorderColor: 'none',
                pieSliceText: 'none',
                pieStartAngle: 360 * startPercentage / 100,
                slices: [
                    {color: '#00b8d5'},
                    {color: '#e9eae4'}
                ],
                enableInteractivity: false
            });

            parent.find('.number').text(mathRound(percentage, 1));
        }
    });
});
