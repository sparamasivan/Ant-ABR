define([
    'jquery',
    'backbone',
    'jquery-cookie'
], function(
    $,
    Backbone
) {
    var PET_PORTAL_LINK_TYPE_LOG_OUT = 'log_out',
        PET_PORTAL_LINKS = [{
                type: 'home',
                text: 'Home'
            },{
                type: 'pet_records',
                text: 'Pet Records'
            },{
                type: 'tools',
                text: 'Tools'
            },{
                type: 'care',
                text: 'Care'
            },{
                type: 'photos',
                text: 'Photos'
            },{
                type: 'community',
                text: 'Community'
            },{
                type: 'shop',
                text: 'Shop'
            },{
                type: PET_PORTAL_LINK_TYPE_LOG_OUT,
                text: 'Log Out'
            }
        ];

    return Backbone.Model.extend({
        url: '/api/v2/healthtracks_report_details',

        getUserDetails: function() {
            return this.get('user_details');
        },

        getPetPortalLinks: function() {
            var urls = this.get('pet_portal_urls') || {},
                links = [];

            $.each(PET_PORTAL_LINKS, function(i, link) {
                var url = urls[link.type + '_url'];

                if (!url) return;

                links.push($.extend(link, {
                    url: url
                }));
            });

            return links;
        },

        getMenuLinks: function() {
            return $.map(this.getPetPortalLinks(), function(link) {
                return (link.type == PET_PORTAL_LINK_TYPE_LOG_OUT)
                    ? null
                    : link;
            });
        },

        getLogoutLink: function() {
            var links = $.map(this.getPetPortalLinks(), function(link) {
                    return (link.type == PET_PORTAL_LINK_TYPE_LOG_OUT)
                        ? link
                        : null;
                });

            return (links.length > 0) ? links[0] : null;
        },

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
