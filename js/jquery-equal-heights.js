define([
    'jquery',
    'jquery-debouncedresize'
], function(
    $
) {
    var methods = {
        equalizeHeights: function() {
            var options = this.data('equalHeightsOptions'),
                elements = (this.length > 1)
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

            if (options && options.callback && !options.callback(tallestHeight)) {
                // prevent equalizing heights
                return;
            }

            elements.each(function() {
                $(this).height((numberVisibleElements > 1) ? tallestHeight : '');
            });

            return this;
        },

        init: function(options) {
            var self = this,
                options = $.extend({}, options),
                result,
                win = $(window),
                winW = win.width(),
                winH = win.height();

            this.data('equalHeightsOptions', options);
            result = methods.equalizeHeights.call(this);

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

                methods.equalizeHeights.call(self);
            });

            return result;
        },

        refresh: function() {
            methods.equalizeHeights.call(this);
        }
    };

    /**
     * Loops through all child elements, if just one element, otherwise through all given elements,
     * end sets the height of each element to the tallest one in the group.
     */
    return $.fn.equalHeights = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
    }
});