define([
    'jquery',
    'backbone',
    'handlebars',
    'model/Report',
    'text!template/Page.html',
    'view/Navigation',
    'view/Report',
    'module',
    'model/MediaQuery',
    'jquery-equal-heights'
], function(
    $,
    Backbone,
    Handlebars,
    ModelReport,
    Template,
    ViewNavigation,
    ViewReport,
    Module,
    ModelMediaQuery
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !(config.model instanceof ModelReport)) {
                throw new Error('model not an instanceof ModelReport');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var promises = [];

            // render template
            this.setElement($(this.template({
                clinic: this.model.getDataClinic(),
                petPortalHomeUrl: Module.config().petPortalHomeUrl,
                logoutUrl: Module.config().logoutUrl,
                privacyPolicyUrl: Module.config().privacyPolicyUrl,
                patient: this.model.getDataPatient()
            })));

            this.$el.find('.page-section-conclusion .arrow').bind('click', function() {
                // navigate to section
                Backbone.history.navigate('next-steps');

                // process navigation
                Backbone.history.loadUrl();
            });

            this.$el.appendTo(parent);
            
            parent.find('.page-footer .column').equalHeights({
                callback: function(tallestHeight) {
                    return !ModelMediaQuery.isPhoneMedia();
                }
            });

            promises.push(this._renderNavigation());

            promises.push(this._renderReport());
            
            return $.when.apply($, promises);
        },

        _renderNavigation: function() {
            var view = new ViewNavigation({
                model: this.model
            });

            return view.render(this.$el.find('.page-nav'));
        },

        _renderReport: function() {
            this._reportView = new ViewReport({
                model: this.model
            });

            return this._reportView.render(this.$el.find('.page-content'));
        }
    });
});
