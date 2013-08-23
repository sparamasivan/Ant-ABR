define([
    'jquery',
    'backbone',
    'handlebars',
    'model/Report',
    'text!template/Overview.html'
], function(
    $,
    Backbone,
    Handlebars,
    ModelReport,
    Template
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
            var self = this;

            return this.model.fetchAggregatedTestCollection()
                .then(function(collection) {
                    self._render(parent, collection)
                });
        },

        _render: function(parent, testCollection) {
            var clinic = this.model.getDataClinic(),
                phoneContainer,
                phoneEl;

            // render template
            this.setElement($(this.template({
                patient: this.model.getDataPatient(),
                doctor: this.model.getDataDoctor(),
                client: this.model.getDataClient(),
                clinic: clinic,
                requiresFollowUp: this.model.requiresFollowUp(),
                doctorComment: this.model.getDoctorComment(),
                nextStepsComment: this.model.getNextStepsComment(),
                date: this.model.getDate(),
                avatarUrl: this._getAvatarUrl(),
                printUrl: this.model.getPrintUrl(),
                testTitles: testCollection.map(function(test) {
                    return test.getSimpleTitle();
                })
            })));
            
            // link icon
            this.$el.find('.result-summary .text-container .icon, .result-summary .text-container .text').bind('click', function(e) {
                e.preventDefault();
                
                // navigate to section
                Backbone.history.navigate('overview');

                // process navigation
                Backbone.history.loadUrl();
            });

            // go to first section when arrow clicked
            this.$el.find('.arrow').bind('click', function() {
                // navigate to section
                Backbone.history.navigate('section/' + testCollection.first().id);

                // process navigation
                Backbone.history.loadUrl();
            });

            this.$el.appendTo(parent);
        },

        _getAvatarUrl: function() {
            var patient = this.model.getDataPatient(),
                species = this.model.getPatientSpecies();

            if (patient.photo) {
                return patient.photo;
            }

            switch(species) {
                case 'canine':
                    return 'images/overview/avatar/canine.png';

                case 'feline':
                    return 'images/overview/avatar/feline.png';

                default:
                    throw new Error('No default avatar specified for species: ' + species);
            }
        }
    });
});
