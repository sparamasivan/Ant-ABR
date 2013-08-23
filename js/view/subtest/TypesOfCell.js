define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/TypesOfCell.html',
    'model/MediaQuery',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    ModelMediaQuery
) {
    var MAX_CELL_ROWS_DESKTOP = 5,
        MAX_CELL_ROWS_PHONE_TABLET = 4,
        DEFAULT_CELL_TYPE = 'fighter',
        CELL_GROUPS = ['fighter', 'defender', 'watcher'],
        CELL_TYPE_COMPONENTS = {
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
        };

    return Backbone.View.extend({
        template: Handlebars.compile(Template),
        templateCell: Handlebars.compile('<div class="cell {{type}}" data-type="{{type}}"><div class="icon"></div></div>'),

        render: function(parent) {
            var self = this,
                templateParams = {
                    species: this.options.species,
                    patient: this.options.patient
                };

            // format cell type components for template
            $.each(CELL_TYPE_COMPONENTS, function(cellType, components) {
                var formattedComponents = [];

                $.each(components, function(i, component) {
                    if (!self.options.ranges[component.type]) {
                        return;
                    };

                    formattedComponents.push({
                        title: component.title,
                        percentage: self._getCellPercentage(component.type),
                        description: self.options.ranges[component.type].getDescription()
                    });
                });

                templateParams[cellType] = {
                    components: formattedComponents
                };
            });

            // render template
            this.setElement($(this.template(templateParams)));

            this.$el.appendTo(parent);

            // enable tooltips
            this.$el.find('.component-info').tooltip({
                position: {
                    my: 'bottom center',
                    at: 'bottom center',
                },
                show: {
                    event: false,
                    solo: false,
                    modal: {
                        enabled: false
                    }
                },
                hide: {
                    event: false
                }
            });

            // bind events for switching between different types of cells
            this.$el.find('.option').bind('click', function() {
                self.select($(this).data('type'));
            });
            this.$el.find('.cells').delegate('.cell', 'click', function() {
                self.select($(this).data('type'));
            });

            // display cells
            this._updateCells();

            // activate default cell type
            this.select(DEFAULT_CELL_TYPE);

            // refresh widget whenever screen is resized
            ModelMediaQuery.on('change:windowWidth', $.proxy(this.refresh, this));
        },

        refresh: function() {
            this._updateCells();
        },

        _getCellPercentage: function(rangeName) {
            var totalCells = this._getCellTotal(),
                range = this.options.ranges[rangeName];

            if (!range) {
                return 0;
            }

            return range.getValue() / totalCells * 100;
        },

        _getCellTotal: function() {
            var ranges = this.options.ranges,
                total = 0;

            $.each(ranges, function(i, range) {
                if (!range) return;

                total += range.getValue();
            });

            return total;
        },

        select: function(cellType) {
            // button & description
            this.$el.find('.option, .description')
                .removeClass('selected')
                .filter('.' + cellType).addClass('selected');

            // cell
            this.$el.find('.cells')
                .removeClass('selected-defender selected-fighter selected-watcher')
                .addClass('selected-' + cellType);
        },

        _updateCells: function() {
            var self = this,
                totalCells = this._getCellTotal(),
                cellsElement = this.$el.find('.cells'),
                cell,
                cellWidth,
                maxCells,
                maxCellRows = ModelMediaQuery.isDesktopMedia() ? MAX_CELL_ROWS_DESKTOP : MAX_CELL_ROWS_PHONE_TABLET
                totalCells = 0,
                groupProperties = {},
                i;

            // remove all current cells
            cellsElement.empty();

            // reset width
            cellsElement.width('');

            // create a single cell, attach it, and measure it
            cell = this._createCell(DEFAULT_CELL_TYPE).appendTo(cellsElement);

            cellWidth = cell.outerWidth(true);

            cell.remove();

            // calculate how many cells we can fit
            maxCells = Math.floor(cellsElement.width() / cellWidth) * maxCellRows;

            // determine number of cell types to populate for each cell group based on percentages
            $.each(CELL_GROUPS, function(i, groupType) {
                var percentage = self._getCellTypeGroupPercentage(groupType),
                    numCells = Math.floor(maxCells * percentage / 100);

                // ensure that at least one cell is present for the group
                if (numCells < 1) numCells = 1;

                groupProperties[groupType] = {
                    percentage: percentage,
                    numCells: numCells
                };

                totalCells += numCells;
            });

            // ensure there aren't too many or too little cells
            // TODO: this test assumes that the extra cells can be added/removed
            // from the default cell group, which my not always be the case. Needs
            // a safer and more accurate algorithm.
            if (totalCells > maxCells) {
                // too many cells, so remove from default cell type
                for(i = totalCells - maxCells; i > 0; i--) {
                    groupProperties[DEFAULT_CELL_TYPE].numCells--;
                    totalCells--;
                }
            } else if (totalCells < maxCells) {
                // too little cells, so add to default cell type
                for(i = maxCells - totalCells; i > 0; i--) {
                    groupProperties[DEFAULT_CELL_TYPE].numCells++;
                    totalCells++;
                }
            }

            // set cell container width explicitly, otherwise the cells might not fit
            cellsElement.width(cellsElement.width());

            // populate cells
            $.each(groupProperties, function(groupType, properties) {
                for(i = 0; i < properties.numCells; i++) {
                    self._createCell(groupType).appendTo(cellsElement);
                }
            });
        },

        _createCell: function(groupType) {
            return $(this.templateCell({
                type: groupType
            }));
        },

        _getCellTypeGroupPercentage: function(groupType) {
            var self = this,
                percentage = 0;

            // format cell type components for template
            $.each(CELL_TYPE_COMPONENTS[groupType], function(i, component) {
                percentage += self._getCellPercentage(component.type);
            });

            return percentage;
        }
    });
});

