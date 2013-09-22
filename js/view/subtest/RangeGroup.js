define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/RangeGroup.html',
    'text!template/subtest/RangeGroupItem.html',
    'model/MediaQuery',
    'iscroll',
    'jquery-tooltip'
], function(
    $,
    Backbone,
    Handlebars,
    Template,
    TemplateRange,
    ModelMediaQuery,
    iScroll
) {
    var EXPECTED_RANGE_PERCENTAGE = 70;

    return Backbone.View.extend({
        template: Handlebars.compile(Template),
        templateRangeItem: Handlebars.compile(TemplateRange),
        _animating: false,
        _scroller: null,
        _detailsContainerItemIndex: null,
        _displayingAsRangePicker: null,

        render: function(parent) {
            // render template
            this.setElement($(this.template()));

            this.$el.appendTo(parent);

            // set average range bounds
            this.$el.find('.average-range').css({
                height: EXPECTED_RANGE_PERCENTAGE + '%',
                top: (100 - EXPECTED_RANGE_PERCENTAGE) / 2 + '%'
            });

            // render ranges
            this._renderRanges(this.$el.find('.ranges'));

            this._scroller = new iScroll(this.$el.find('.content-inner')[0], {
                snap: false,
                momentum: false,
                hScrollbar: false,
                vScroll: false,
                handleClick: false,
                onBeforeScrollStart: $.proxy(this._onBeforeScrollStart, this),
                onScrollStart: $.proxy(this._onScrollStart, this),
                onScrollMove: $.proxy(this._onScrollMove, this),
                onScrollEnd: $.proxy(this._onScrollEnd, this)
            });

            // attach paging listeners
            this.$el.find('.previous').bind('click', $.proxy(this.previousPage, this));
            this.$el.find('.next').bind('click', $.proxy(this.nextPage, this));

            // attach phone tooltip
            this.$el.find('.scroller-container').tooltip({
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    container: this.$el.find('.details-container'),
                    adjust: {
                        method: 'none'
                    }
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
                },
                style: {
                    classes: 'view-subtest-range-group-item-tooltip'
                }
            });

            // show phone tooltip
            this.$el.find('.scroller-container').qtip('api').show();

            this.refresh();

            // refresh widget whenever screen is resized
            ModelMediaQuery.on('change:windowWidth', $.proxy(this.refresh, this));
        },

        previousPage: function() {
            var scroller = this._scroller,
                currentItemIndex = this._getCurrentItemIndex(),
                itemWidth = this._getRangeItemWidth(),
                itemsPerPage = Math.floor(scroller.wrapperW / itemWidth),
                x = -1 * (currentItemIndex - itemsPerPage + ((scroller.x % itemWidth == 0) ? 0 : 1)) * itemWidth;

            if (x < scroller.maxScrollX) x = scroller.maxScrollX;
            else if (x > 0) x = 0;

            scroller.scrollTo(x, scroller.y, 400);
        },

        nextPage: function() {
            var scroller = this._scroller,
                currentItemIndex = this._getCurrentItemIndex(),
                itemWidth = this._getRangeItemWidth(),
                itemsPerPage = Math.floor(scroller.wrapperW / itemWidth),
                x = -1 * (currentItemIndex + itemsPerPage) * itemWidth;

            if (x < scroller.maxScrollX) x = scroller.maxScrollX;
            else if (x > 0) x = 0;

            scroller.scrollTo(x, scroller.y, 400);
        },

        refresh: function() {
            var scrollerWidth,
                rangeItemWidth,
                marginLeft = 0,
                marginRight = 0,
                wasDisplayingAsRangePicker = this._displayingAsRangePicker;

            if (this._isRangePicker()) {
                // calculate amount of padding to put on side of scroller, in order to
                // make the first and last range items line up to the center
                scrollerWidth = this.$el.find('.scroller').width();
                rangeItemWidth = this._getRangeItemWidth();
                marginLeft = scrollerWidth / 2 - rangeItemWidth / 2;
                marginRight = scrollerWidth / 2 - rangeItemWidth / 2;
            }

            // add margin to beginning and end of range group in order for range items to appear centered to this.$el.find('.swipe')
            this.$el.find('.ranges').css({
                marginLeft: marginLeft + 'px',
                marginRight: marginRight +'px'
            });

            // update range items details container
            this._refreshRangeItemDetails();

            // update scroller
            this._scroller.refresh();

            this._updatePaging();

            this._displayingAsRangePicker = this._isRangePicker();

            // default to the middle item when displaying as range picker for the first time
            if (this._isRangePicker() && !wasDisplayingAsRangePicker) {
                this._centerOnItem(Math.floor(this.options.models.length / 2));
            }
        },

        _updatePaging: function() {
            var scroller = this._scroller;

            this.$el.find('.pager.previous').toggleClass('disabled', scroller.x >= 0);
            this.$el.find('.pager.next').toggleClass('disabled', scroller.x <= scroller.maxScrollX);
        },

        _isRangePicker: function() {
            return this.$el.find('.details-container').is(':visible');
        },

        _getRangeItemWidth: function() {
            return this.$el.find('.range-item').eq(0).width();
        },

        _onBeforeScrollStart: function(e) {
            var scroller = this._scroller;

            // @see http://stackoverflow.com/questions/7800261/iscroll-with-native-scrolling-on-one-axis/13146675#13146675
            if ( scroller.absDistX > (scroller.absDistY + 5 ) ) {
                // user is scrolling the x axis, so prevent the browsers' native scrolling
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        },

        _onScrollStart: function() {
            this.$el.find('.swipe').fadeOut();
            this.$el.find('.scroller .qtip').qtip('hide');
        },

        _onScrollMove: function() {
            this._refreshRangeItemDetails();
        },

        _onScrollEnd: function() {
            this._refreshRangeItemDetails();
            this._updatePaging();
            this._centerOnItem(this._getCurrentItemIndex());
        },

        _getCurrentItemIndex: function() {
            var x = this._scroller.x,
                itemIndex = Math.floor(( -1 * x - this._getRangeItemWidth() / 2) / this._getRangeItemWidth()) + 1,
                maxIndex = this.options.models.length - 1;

            if (x > 0) itemIndex = 0;
            else if (itemIndex > maxIndex) itemIndex = maxIndex;
            else if (itemIndex < 0) itemIndex = 0;

            return itemIndex;
        },

        _centerOnItem: function(index) {
            var x,
                newX;

            if (!this._isRangePicker()) {
                // only center on item when range picker is active
                return;
            }

            x = this._scroller.x;
            newX = -1 * index * this._getRangeItemWidth();

            if (x == newX) {
                // already centered
                return;
            }

            this._scroller.scrollTo(newX, 0, 200);
        },

        _refreshRangeItemDetails: function() {
            var itemIndex,
                elRangeItems;

            if (!this._isRangePicker()) {
                return;
            }

            itemIndex = this._getCurrentItemIndex();

            if (this._detailsContainerItemIndex !== null && this._detailsContainerItemIndex == itemIndex) {
                // correct range details already showing
                return;
            }

            this._detailsContainerItemIndex = itemIndex;

            elRangeItems = this.$el.find('.range-item');

            // remove selected class
            elRangeItems.removeClass('active');

            this.$el.find('.scroller-container').qtip('api').elements.content
                .empty()
                .append(
                    elRangeItems
                        .eq(itemIndex)
                        .addClass('active')
                        .qtip('api').get('content.text')
                        .clone()
                        .show()
                );
        },

        _renderRanges: function(parent) {
            var self = this,
                mRanges = this.options.models
                totalParentWidth = 0;

            $.each(mRanges, function(i, mRange) {
                var value = mRange.getPercentageValue(EXPECTED_RANGE_PERCENTAGE),
                    el = $(self.templateRangeItem({
                        patient: self.options.patient,
                        title: mRange.getLabel(),
                        value: mRange.getValue(),
                        minValue: mRange.getMinValue(),
                        maxValue: mRange.getMaxValue(),
                        unitOfMeasure: mRange.getUnitOfMeasure(),
                        description: mRange.getDescription()
                    })).appendTo(parent),
                    elDetails = el.find('.view-subtest-range-group-item-details');

                // append "bad" class if value out of expected range
                if (!mRange.isNormal()) {
                    el.addClass('bad');
                }

                // position value marker
                el.find('.value').css({
                    top: (100 - value.percentageValue) + '%'
                });

                // attach tooltip
                el.tooltip({
                    content: {
                        text: elDetails
                    },
                    position: {
                        my: 'top center',
                        at: 'bottom center',
                        target: el.find('.marker')
                    },
                    show: {
                        target: el.find('.range, .marker')
                    },
                    style: {
                        classes: 'view-subtest-range-group-item-tooltip'
                    },
                    events: {
                        show: function(event, api, defaultShowFn) {
                            if (self._isRangePicker()) {
                                // disable tooltips on mobile
                                // IE might throw an error calling preventDefault(), so use a try/catch block.
                                try { event.preventDefault(); } catch(e) {}

                                // scroll to the selected range item
                                self._scroller.scrollTo(-1 * i * self._getRangeItemWidth(), 0, 200);
                            } else {
                                // execute the default show function
                                defaultShowFn.apply(this, [event, api]);
                            }
                        }
                    }
                });
                
                // hide tooltip automatically when window resized, so that it doesn't interfere with other tooltips
                ModelMediaQuery.on('change:windowWidth', function() {
                    el.qtip('api').hide();
                });

                totalParentWidth += el.width();
            });

            parent.width(totalParentWidth + 'px');
        }
    });
});

