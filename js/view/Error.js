define([
    'jquery',
    'backbone',
    'handlebars'
], function(
    $,
    Backbone,
    Handlebars
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            var gOldOnError = window.onerror;

            // Override previous handler.
            window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                if (gOldOnError)
                    // Call previous handler.
                    return gOldOnError(errorMsg, url, lineNumber);

                // Just let default handler run.
                return false;
            }
        }
    });
});
