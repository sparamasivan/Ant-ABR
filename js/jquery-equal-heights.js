define([
    'jquery',
    'jquery-debouncedresize'
], function(
    $
) {
    var equalizeHeights = function(options) {
            var elements = (this.length > 1)
                    ? this
                    : this.children(),
                height,
                numberVisibleElements = 0,
                tallestHeight = 0,
                isVisible;

            // get tallest height
            elements.each(function() {
                // reset element height
                $(this).height('auto');

                // keep track of visible elements
                isVisible = $(this).is(':visible');
                numberVisibleElements += isVisible;

                // check height
                height = $(this).height();
                tallestHeight = (height > tallestHeight && isVisible) ? height : tallestHeight;
            });

            if (options.callback && !options.callback(tallestHeight)) {
                // prevent equalizing heights
                return;
            }

            elements.each(function() {
                $(this).height((numberVisibleElements > 1) ? tallestHeight : '');
            });

            return this;
        };

    /**
     * Loops through all child elements, if just one element, otherwise through all given elements,
     * end sets the height of each element to the tallest one in the group.
     */
    return $.fn.equalHeights = function(options) {
        var self = this,
            opts = $.extend({}, options),
            result = equalizeHeights.call(this, opts),
            win = $(window),
            winW = win.width(),
            winH = win.height();

        // recalculate heights on window resize
        win.on('debouncedresize', function() {
            var w = win.width(),
                h = win.height();

            if (winW == w && winH == h) {
                // window dimensions did not change
                return;
            }

            winW = w;
            winH = h;

            equalizeHeights.call(self, opts);
        });

        return result;
    }
});