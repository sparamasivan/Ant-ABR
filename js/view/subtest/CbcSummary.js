define([
    'jquery',
    'backbone',
    'handlebars',
    'text!template/subtest/CbcSummary.html'
], function(
    $,
    Backbone,
    Handlebars,
    Template
) {
    var mathRound = function(value, decimalPlaces) {
        var roundedValue = Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        return roundedValue.toFixed(decimalPlaces);
    }

    return Backbone.View.extend({
        template: Handlebars.compile(Template),

        render: function(parent) {
            // render template
            this.setElement($(this.template({
                sectionId: this.options.sectionId,
                rbc: mathRound(this.options.rbc, 1),
                wbc: mathRound(this.options.wbc, 1),
                platelet: mathRound(this.options.platelet, 1),
                species: this.options.species
            })));

            this.$el.find('.link').bind('click', function(e) {
                e.preventDefault();

                // navigate to section
                Backbone.history.navigate($(this).attr('href'));

                // process navigation
                Backbone.history.loadUrl();
            });

            this.$el.appendTo(parent);
        }
    });
});

