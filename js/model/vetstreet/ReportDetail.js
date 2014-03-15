define([
    'jquery',
    'backbone',
    'jquery-cookie'
], function(
    $,
    Backbone
) {
    return Backbone.Model.extend({
        url: '/api/v2/healthtracks_report_details',

        sync: function(method, model, options) {
            if (method == 'read') {
                options = $.extend({
                    type: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    data: {
                        hospital_domain: '',
                        l: $.cookie('l'),
                        report_id: this.get('id')
                    }
                }, options);
            }

            return Backbone.Model.prototype.sync.call(this, method, model, options);
        },

        parse: function(resp, options) {
            return resp.healthtracks_info;
        }
    });
});
