define([
    'handlebars-base',
    'config'
], function(
    Handlebars,
    Config
) {
    var PRONOUN_TYPES_BY_SEX = {
        male: {
            subjective: "he",
            objective: "him",
            possessiveAdjective: "his",
            possessiveAbsolute: "his"
        },

        female: {
            subjective: "she",
            objective: "her",
            possessiveAdjective: "her",
            possessiveAbsolute: "hers"
        }
    };

    /**
     * Returns his/hers depending on sex
     */
    Handlebars.registerHelper('pronoun', function(type, sex, options) {
        var normalizedSex,
            pronoun;

        if (typeof type != 'string') {
            throw new Error('"type" parameter must be of type string');
        } else if (typeof sex != 'string') {
            throw new Error('"sex" parameter must be of type string');
        }

        // normalize sex
        switch(sex.toLowerCase()) {
            case 'male':
            case 'm':
                normalizedSex = 'male';
                break;

            case 'female':
            case 'f':
            case 'sf':
                normalizedSex = 'female';
                break;

            default:
                throw new Error('Invalid value of "sex" parameter: ' + sex);
                break;
        }

        pronoun = PRONOUN_TYPES_BY_SEX[normalizedSex][type];

        if (!pronoun) {
            throw new Error('Unsupported pronoun type: ' + pronoun);
        }

        return Handlebars.Utils.escapeExpression(pronoun);
    });

    Handlebars.registerHelper('list', function(list, options) {
        var i, str = '';

        switch(list.length) {
            case 0:
                break;

            case 1:
                return Handlebars.Utils.escapeExpression(list[0]);
                break;

            case 2:
                return Handlebars.Utils.escapeExpression(list[0]) + ' and ' + Handlebars.Utils.escapeExpression(list[1]);
                break;

            default:
                for(i=0; i < list.length - 1; i++) {
                    str += Handlebars.Utils.escapeExpression(list[i]) + ', ';
                }

                str += 'and ' + Handlebars.Utils.escapeExpression(list[i]);
                break;
        }

        return new Handlebars.SafeString(str);
    });

    /**
     * Evaluates the first parameter as if it was a handlebars template.
     */
    Handlebars.registerHelper('renderTemplate', function(template, options) {
        var result = (typeof template == 'function')
            ? template(this)
            : Handlebars.compile(template)(this);

        return new Handlebars.SafeString(result);
    });

    /**
     * Replace carriage returns with <br /> elements
     */
    Handlebars.registerHelper('nl2br', function(text, options) {
        return new Handlebars.SafeString(
            Handlebars.Utils.escapeExpression(text)
                .replace(/\n/g, "<br />")
        );
    });

    Handlebars.registerHelper('phoneLink', function(phone, classes, options) {
        var escPhone = Handlebars.Utils.escapeExpression(phone),
            escClasses = Handlebars.Utils.escapeExpression(classes || ''),
            link;

        link = (Config.isMobile())
            ? '<a class="' + escClasses + '" href="tel:' + escPhone + '">' + escPhone + '</a>'
            : '<span class="' + escClasses + '">' + escPhone + '</span>';

        return new Handlebars.SafeString(link);
    });

    /**
     * Format a date using a formatting pattern string.
     * @link https://raw.github.com/n8barr/handlebars-helpers/master/formatDate.js
     *
     * @param date {String} Date string to be parsed into a Date object
     * @param format {String} Fromatting pattern (e.g. 'F j, Y')
     *
     * Based on PHP date formatting
     * @link http://php.net/manual/en/function.date.php
     */
    Handlebars.registerHelper('formatDate', function(date, format, options) {
        var result = '',
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            pad = function(n){return n<10 ? '0'+n : n};

        if (!(date instanceof Date)) {
            throw new Error('Date must of Date type instead of: ' + typeof date + '.');
        }

        //create result string
        for (i = 0; i < format.length; i++) {
            switch (format[i]) {

                //Day of the month, 2 digits with leading zeros (01 to 31)
                case 'd':
                    result += pad(date.getUTCDate());
                    break;

                //A full textual representation of a month    (January through December)
                case 'F':
                    result += months[date.getUTCMonth()];
                    break;

                //24-hour format of an hour without leading zeros   (0 through 23)
                case 'G':
                    result += date.getUTCHours();
                    break;

                //Day of the month without leading zeros  (1 to 31)
                case 'j':
                    result += date.getUTCDate();
                    break;

                //Numeric representation of a month, with leading zeros (01 through 12)
                case 'm':
                    result += pad(date.getUTCMonth() + 1);
                    break;

                //A full numeric representation of a year, 4 digits   (e.g. 1999 or 2003)
                case 'Y':
                    result += date.getUTCFullYear();
                    break;

                //Allow other characters to pass through   (e.g. space, colon, etc.)
                default:
                    result += format[i];
            }
        }
        return result;
    });

    return Handlebars;
});
