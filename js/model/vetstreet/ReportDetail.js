define([
    'jquery',
    'backbone',
    'Environment',
    'jquery-cookie'
], function(
    $,
    Backbone,
    Environment
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

        isInPreviewMode: function() {
            return this.get('preview_mode');
        },

        getInternalNotes: function() {
            return this.get('internal_notes').internal_note_list;
        },

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
            var deferred = new $.Deferred();

            if (method == 'read') {
                options = $.extend({
                    type: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    data: {
                        hospital_domain: Environment.getPathParameters().domain,
                        l: $.cookie('l'),
                        report_id: this.get('id')
                    }
                }, options);
            }

            Backbone.Model.prototype.sync.call(this, method, model, options)
                .then(function(data, textStatus, jqXHR) {
                    if(!data || data.status != 'success') {
                        deferred.reject(data);
                    } else {
                        deferred.resolve(data);
                    }
                }, function(jqXHR, textStatus, errorThrown) {
                    deferred.reject((jqXHR.responseJSON && jqXHR.responseJSON)
                        ? jqXHR.responseJSON
                        : null
                    );
                });

            return deferred.promise();
        },

        parse: function(resp, options) {
            return resp.healthtracks_info;
        }
    });
});
