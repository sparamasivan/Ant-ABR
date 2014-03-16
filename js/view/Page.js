define([
    'jquery',
    'backbone',
    'handlebars',
    'model/Report',
    'text!template/Page.html',
    'view/MainMenu',
    'view/InternalNote',
    'view/Navigation',
    'view/Report',
    'view/Survey',
    'module',
    'model/MediaQuery',
    'event/Dispatcher',
    'jquery-equal-heights'
], function(
    $,
    Backbone,
    Handlebars,
    ModelReport,
    Template,
    ViewMainMenu,
    ViewInternalNote,
    ViewNavigation,
    ViewReport,
    ViewSurvey,
    Module,
    ModelMediaQuery,
    EventDispatcher
) {
    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        constructor: function(config) {
            if (!config || !config.model || !(config.model.report instanceof ModelReport)) {
                throw new Error('model not an instanceof ModelReport');
            }

            Backbone.View.apply(this, arguments);
        },

        render: function(parent) {
            var promises = [];

            // render template
            this.setElement($(this.template({
                clinic: this.model.report.getDataClinic(),
                petPortalHomeUrl: Module.config().petPortalHomeUrl,
                logoutUrl: Module.config().logoutUrl,
                privacyPolicyUrl: Module.config().privacyPolicyUrl,
                patient: this.model.report.getDataPatient()
            })));

            this.$el.find('.page-section-conclusion .widget-circle-arrow').bind('click', function() {
                // close all sections
                EventDispatcher.trigger('sections.collapse');

                // navigate to section
                EventDispatcher.trigger('route', 'next-steps');
            });

            this.$el.appendTo(parent);
            
            parent.find('.page-footer .column').equalHeights({
                callback: function(tallestHeight) {
                    return !ModelMediaQuery.isPhoneMedia();
                }
            });

            promises.push(this._renderMainMenu());

            if (this.model.reportDetail.isInPreviewMode()) {
                promises.push(this._renderInternalNote());
            }

            promises.push(this._renderNavigation());

            promises.push(this._renderReport());

            if (Module.config().isSurveyEnabled && !this.model.reportDetail.isInPreviewMode()) {
                promises.push(this._renderSurvey());
            }
            
            return $.when.apply($, promises);
        },

        _renderMainMenu: function() {
            var view = new ViewMainMenu({
                model: this.model.reportDetail
            });

            return view.render(this.$el.find('.page-mainmenu'));
        },

        _renderInternalNote: function() {
            var view = new ViewInternalNote({
                model: this.model.reportDetail
            });

            return view.render(this.$el.find('.page-internal-note'));
        },

        _renderNavigation: function() {
            var view = new ViewNavigation({
                model: this.model.report
            });

            return view.render(this.$el.find('.page-nav'));
        },

        _renderReport: function() {
            this._reportView = new ViewReport({
                model: this.model.report
            });

            return this._reportView.render(this.$el.find('.page-content'));
        },

        _renderSurvey: function() {
            var view = new ViewSurvey();

            return view.render();
        }
    });
});
