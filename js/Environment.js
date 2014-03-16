define([
    'jquery',
    'parseUri',
    'module',
    'jquery-cookie'
], function(
    $,
    parseUri,
    Module
) {
    return {
        /**
         * Get environment configuration parameters from url, cookie, etc.
         */
        getParameters: function(url) {
            var urlParams = this.getPathParameters(url),
                queryParams = this.getQueryParameters(url),
                tokenParam = $.cookie('l');

            return $.extend(
                {},
                urlParams,
                queryParams,
                {token: tokenParam}
            );
        },

        /**
         * Parse parameters from url query string
         * e.g. http://abc.com/home?a=1&b=2 --> {a: "1", b: "2"}
         */
        getQueryParameters: function(url) {
            var params = parseUri(url || window.location.href).queryKey;

            // decode values
            $.each(params, function(key, value) {
                params[key] = window.decodeURIComponent(value);
            });

            return params;
        },

        /**
         * Extract configuration parameters from url path and query
         */
        getPathParameters: function(url) {
            var patterns = Module.config().pathPatterns,
                params = {},
                path = parseUri(url || window.location.href).path;

            // parse parameters from url path based on pattern e.g. /<hospital>/login -> {hospital: <hospital>}
            $.each(patterns, function(i, p) {
                var regexp = new RegExp(p.pattern),
                    match = regexp.exec(path);

                if (match) {
                    $.each(p.params, function(j, p) {
                        var pDefault = '',
                            pName = p;

                        // use param defaults if available
                        if (p instanceof Array) {
                            pName = p[0];
                            pDefault = p[1];
                        }

                        params[pName] = match[j+1] || pDefault;
                    });

                    return false;
                }
            });
            
            return params;
        }
    }
});
