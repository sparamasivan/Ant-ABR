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
    'view/animation/Cbc',
    'modernizr',
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
    ViewSubtestColor,
    ViewAnimation,
    Modernizr
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
            var species = this.model.getReport().getPatientSpecies();

            $.extend(this._overview, {
                descriptionTemplate: 'The CBC (Complete Blood Cell Count) test examines the health and numbers of {{{patient.name}}}’s cells.',
                diagramFilename: 'diagram-' + species + '-2x.png',
                moreTemplate: 'There are three different kinds of cells in the blood: red blood cells, white blood cells and platelets. Though they have different jobs and vary in number, they all work together to achieve balance.',
                viewAnimation: new ViewAnimation({
                    species: species
                })
            });

            ViewTestBase.prototype.render.apply(this, arguments);

            this.$elContent.append(this.templateContent({
                patient: this.model.getReport().getDataPatient()
            }));

            return $.when(
                this._renderRbcSection(this.$elContent.find('.subsection-rbc')),
                this._renderWbcSection(this.$elContent.find('.subsection-wbc')),
                this._renderPlateletSection(this.$elContent.find('.subsection-platelet'))
            );
        },

        _renderRbcSection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),
                view = new ViewSubtestRange({
                    model: this.model.getModelRbcRange(),
                    name: this.model.getReport().getDataPatient().name,
                    unitOfMeasure: 'MILLION/μL',
                    message: {
                        good: Handlebars.compile('{{{patient.name}}}’s red blood cell count is within expected range.')({patient: patient}),
                        bad: Handlebars.compile('{{{patient.name}}}’s red blood cell count is outside the expected range.')({patient: patient})
                    },
                    description: {
                        good: Handlebars.compile('We look at both the total number of red blood cells and their appearance to analyze {{{patient.name}}}’s well-being.')({patient: patient}),
                        bad: Handlebars.compile('However, an unexpected cell count does not necessarily mean the {{{patient.name}}}’s red blood cells are out of balance. We look not only at the number of red blood cells, but also their appearance.')({patient: patient})
                    }
                });
            
            return $.when(
                view.render(parent.find('.range-container')),
                this._renderPieChart(parent.find('.chart'), this.model.getRbcPercentage(), 0),
                this._renderRbcAppearanceSubsection(parent.find('.test-subsection.appearance'))
            );
        },

        _renderRbcAppearanceSubsection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // create subsection
                view = new ViewWidgetTestSubsection({
                    title: Handlebars.compile('Appearance of {{{patient.name}}}’s Cells')({patient: patient}),
                    text: Handlebars.compile('By analyzing size, shape and color of red blood cells, we can learn more about {{{patient.name}}}’s cell health and composition.')({patient: patient})
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

                elPods,

                deferred = new $.Deferred();

            // render subsection
            view.render(parent);

            // populate subsection with content
            view.setContent(contentEl);

            // --- populate subsection with subtests --- //

            // cell size
            subtestData = formatCellAttributesForSubtest(ModelTestCbc.RBC_SIZES, this.model.getRbcSize());
            viewSubtest = new ViewSubtestSelect({
                title: 'Cell Size',
                message: {
                    good: Handlebars.compile('{{{patient.name}}}’s average cell size is normal, which is expected.')({patient: patient}),
                    bad: Handlebars.compile('{{{patient.name}}}’s average cell size is {{{result}}}, which is outside the expected range.')({patient: patient, result: subtestData.labels[subtestData.selectedIndex].toLowerCase()}),
                },
                description: Handlebars.compile('We look at size to determine the age of {{{patient.name}}}’s red blood cells, as well as the amount of oxygen and hemoglobin they contain.')({patient: patient}),
                options: subtestData.labels,
                selectedIndex: subtestData.selectedIndex,
                selectedIsBad: ModelTestCbc.RBC_SIZES[subtestData.selectedIndex].bad
            });
            viewSubtest.render(contentEl.find('.size'));

            // cell shape
            subtestData = formatCellAttributesForSubtest(ModelTestCbc.RBC_SHAPES, this.model.getRbcShape());
            viewSubtest = new ViewSubtestSelect({
                title: 'Cell Shape',
                message: {
                    good: Handlebars.compile('{{{patient.name}}}’s average cell shape is regular, which is expected.')({patient: patient}),
                    bad: Handlebars.compile('{{{patient.name}}}’s average cell shape is irregular.')({patient: patient}),
                },
                description: {
                    good: Handlebars.compile('Healthy red blood cells are able to retain their regular round shape even after passing through tiny capillaries.')({patient: patient}),
                    bad: Handlebars.compile('Irregularly shaped red blood cells can mean that {{{patient.name}}}’s cells have lost some of their elasticity and no longer spring back to a round shape.')({patient: patient}),
                },
                options: subtestData.labels,
                selectedIndex: subtestData.selectedIndex,
                selectedIsBad: ModelTestCbc.RBC_SHAPES[subtestData.selectedIndex].bad
            });
            viewSubtest.render(contentEl.find('.shape'));

            // cell color
            subtestData = formatCellAttributesForSubtest(ModelTestCbc.RBC_COLORS, this.model.getRbcColor());
            viewSubtest = new ViewSubtestColor({
                title: 'Cell Color',
                message: {
                    good: Handlebars.compile('{{{patient.name}}}’s cell color is red, which is expected.')({patient: patient}),
                    bad: Handlebars.compile('{{{patient.name}}}’s cells are paler than expected.')({patient: patient}),
                },
                description: {
                    good: Handlebars.compile('Just like how chlorophyll makes plants green, oxygen and hemoglobin make blood red.')({patient: patient}),
                    bad: Handlebars.compile('Red blood cells are rich in oxygen and hemoglobin. As their composition changes, they become paler in color.')({patient: patient}),
                },
                label: subtestData.labels[subtestData.selectedIndex],
                isBad: ModelTestCbc.RBC_COLORS[subtestData.selectedIndex].bad
            });
            viewSubtest.render(contentEl.find('.color'));

            // equalize pod heights
            elPods = contentEl.find('.view-subtest-pod-base >.inner');
            view.expand(); // expand subsection, to force images to load
            elPods.waitForImages({
                finished: function() {
                    elPods.equalHeights({
                        callback: function(tallestHeight) {
                            return !ModelMediaQuery.isPhoneMedia();
                        }
                    });

                    view.collapse();

                    deferred.resolve();
                },

                waitForAll: true
            });

            // updated heights when subsection expanded
            view.on('expanded', function() {
                elPods.equalHeights('refresh');
            });

            return deferred.promise();
        },

        _renderWbcSection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // range
                view = new ViewSubtestRange({
                    model: this.model.getModelWbcRange(),
                    name: this.model.getReport().getDataPatient().name,
                    unitOfMeasure: 'THOUSAND/μL',
                    message: {
                        good: Handlebars.compile('{{{patient.name}}}’s white blood cell count is within expected range.')({patient: patient}),
                        bad: Handlebars.compile('{{{patient.name}}}’s white blood cell count is outside the expected range.')({patient: patient})
                    },
                    description: {
                        good: Handlebars.compile('We look at both the total number of white blood cells and their types to analyze {{{patient.name}}}’s well-being.')({patient: patient}),
                        bad: Handlebars.compile('However, an unexpected cell count does not necessarily mean {{{patient.name}}}’s white blood cells are out of balance. We look not only at the number of white blood cells, but also their types.')({patient: patient})
                    }
                });

            view.render(parent.find('.range-container'));

            this._renderPieChart(parent.find('.chart'), this.model.getWbcPercentage(), this.model.getRbcPercentage());

            this._renderWbcTypesOfCellSubsection(parent.find('.test-subsection.types-of-cell'));
        },

        _renderWbcTypesOfCellSubsection: function(parent) {
            var patient = this.model.getReport().getDataPatient(),

                // create subsection
                view = new ViewWidgetTestSubsection({
                    title: Handlebars.compile('Types of {{{patient.name}}}’s Cells')({patient: patient}),
                    text: Handlebars.compile('There are three types of white blood cells. Though they have different jobs and vary in number, they all work together to achieve balance.')({patient: patient})
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
            var patient = this.model.getReport().getDataPatient(),

                // range
                view = new ViewSubtestRange({
                    model: this.model.getModelPlateletRange(),
                    name: this.model.getReport().getDataPatient().name,
                    unitOfMeasure: 'THOUSAND/μL',
                    message: {
                        good: Handlebars.compile('{{{patient.name}}}’s platelet count is within expected range.')({patient: patient}),
                        bad: Handlebars.compile('{{{patient.name}}}’s platelet count is outside the expected range.')({patient: patient})
                    },
                    description: {
                        good: Handlebars.compile('We look at both the total number of platelets and check if they’ve clumped in order to analyze {{{patient.name}}}’s well-being.')({patient: patient}),
                        bad: Handlebars.compile('However, an unexpected count does not necessarily mean {{{patient.name}}}’s platelets are out of balance. We look not only at the number of platelets, but also check if they’ve clumped.')({patient: patient})
                    }
                });

            view.render(parent.find('.range-container'));

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

                target = parent.find('.diagram >.inner'),

                chart = new google.visualization.PieChart(target[0]);

            if (Modernizr.csstransforms !== true) {
                target.addClass('no-csstransforms');
            }

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
                    {color: '#00b8d6'},
                    {color: '#e8eae5'}
                ],
                enableInteractivity: false,
                tooltip: {
                    trigger: 'none'
                }
            });

            parent.find('.number').text(mathRound(percentage, 1));
        }
    });
});
