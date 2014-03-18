define([
    'jquery',
    'backbone',
    'model/Report',
    'model/vetstreet/ReportDetail',
    'view/Page',
    'router/Section',
    'view/widget/Busy',
    'module'
], function(
    $,
    Backbone,
    ModelReport,
    ModelVetstreetReportDetail,
    ViewPage,
    RouterSection,
    ViewWidgetBusy,
    Module
) {
    return {

        /**
         * Initializes application model, views, and routing.
         */
        init: function() {
            var self = this,
                mReport,
                mVetstreetReportDetail,
                vPage,
                vBusy;

            // initialize global error handling
            this._initErrorHandling();

            // initialize loader
            vBusy = new ViewWidgetBusy();
            vBusy.render($('body'));

            // show busy until we are finished loading all the data
            vBusy.show();

            // create report model
            mReport = new ModelReport({
                id: unescape(this.getURLParam("report")) || Module.config().defaultReportUrl
            });

            // set sync related properties
            mReport.authToken = this.getURLParam("auth_token");
            mReport.urlRoot = unescape(this.getURLParam("context"));

            // show window width/height debug console
            if (Module.config().windowWidthHeightToolbarEnabled) {
                require(['view/widget/WindowWidthHeight'], function(ViewWidgetWindowWidthHeight) {
                    var view = new ViewWidgetWindowWidthHeight();
                    return view.render($('body'));
                });
            }

            // disable page scaling
            this._disablePageScaling();

            // initialize report view once report model is loaded
            return $.when(
                    mReport.fetch()
                )
                .fail(function(deffered, status, error) {
                    self._showError('Failed to fetch report detail: ' + status + ' - ' + error.toString());
                })
                .then(function() {
                    // create report detail model
                    mVetstreetReportDetail = new ModelVetstreetReportDetail({
                        id: mReport.getReportId()
                    });

                    return mVetstreetReportDetail.fetch();
                })
                .fail(function(data) {
                    self._showError('Failed to fetch report detail: ' + data.error_msg);
                })
                // render report
                .then(function() {
                    vPage = new ViewPage({
                        model: {
                            report: mReport,
                            reportDetail: mVetstreetReportDetail
                        }
                    });

                    return vPage.render($("body"));
                })
                .then($.proxy(this.configureRouting, this))
                .then(function() {
                    // finished loading all data, time to hide the loader
                    vBusy.hide();
                });
        },

        _initErrorHandling: function() {
            var gOldOnError = window.onerror;

            // Override previous handler.
            window.onerror = function (errorMsg, url, lineNumber) {
                if (gOldOnError) {
                    // Call previous handler.
                    return gOldOnError(errorMsg, url, lineNumber);
                } else {
                    alert(errorMsg);
                }

                // Just let default handler run.
                return false;
            }
        },

        _showError: function(message) {
            alert(message);
        },

        /**
         * Initialize route handler/listener.
         */
        configureRouting: function() {
            // hash change handler
            var rSection = new RouterSection();
        },

        /**
         * Parse parameter value from url.
         */
        getURLParam: function(name){
            var regexS = "[\\?&]"+name+"=([^&#]*)",
                regex = new RegExp( regexS ),
                results = regex.exec( window.location.href );

            return (results === null) ? "" : results[1];
        },

        /**
         * Some browsers need to have page scaling disabled in order for this application to display correctly.
         */
        _disablePageScaling: function() {
            var userAgent = window.navigator.userAgent,
                // parses string similar to "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; ..." to figure out
                // whether this is an Android Browser and get the major, and minor version numbers
                // @see http://www.useragentstring.com/pages/Android%20Webkit%20Browser/
                androidBrowserMatch = userAgent.match(/; Android (\d+)(?:[.](\d+))?.*?;/),
                majorVersionNumber,
                viewportMeta;

            // ensure that browser scaling is disabled in Android browser < 3, in order for fixed positioning to work properly
            // @see http://bradfrostweb.com/blog/mobile/fixed-position/#fixed-support
            if (androidBrowserMatch) {
                majorVersionNumber = parseInt(androidBrowserMatch[1]);

                if (majorVersionNumber < 3) {
                    viewportMeta = $('meta[name=viewport]').attr("content");
                    viewportMeta += ', user-scalable=0';
                    $('meta[name=viewport]').attr("content", viewportMeta);
                }
            }
        }
    };
});
