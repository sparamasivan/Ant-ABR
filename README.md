# VCA Healthtracks

VCA Healthtracks allows pet owners to view their pet's lab results through an easy-to-use, single-page, web-based report.

## Files
  * [report.html](report.html) - Frontend endpoint used for displaying test results. Uses optimized (compressed) JS and CSS files, along with configuration settings geared towards live deployment.
  * [report-dev.html](report-dev.html) - Same as [report.html](report.html), but uses uncompressed JavaScript and other configuration settings which should help the programmer with developing and debugging code.
  * [login.html](login.html), [password-create.html](password-create.html), [password-forgot.html](password-forgot.html) - Static login/authentication pages that need to be integrated with the backend.
  * [data-map.html](data-map.html) - A dynamically generated table (from sample JSON data) that lists all the test codes and properties by test type (Urine, CBC, etc.). All these test codes and properties must be present for each test JSON data in order for the frontend to render the report successfully.

## Sample Tests

A version of this code should be up and running on [allboatsrise.com/dev/vca/ht-report-print](http://allboatsrise.com/dev/vca/ht-report-print/).

## Supported Browsers
  * Desktop
    *  IE8+
    * Chrome (latest version)
    *  Safari (latest version)
    * FireFox (latest version)
  * Tablet
    * Android 7in. and larger screens running Andoid 4.0+ (Honey Comb and greater)
    * iPad Mini and larger screens running iOS 5+
  * Phone
    * Android with 320x480px and greater screens running OS 2.3+ (Gingerbread and greater) on 3G or greater networks
    * iPhone 3Gs+ with 320x480px and greater screens running iOS 5+ on 3G or greater networks

## Architecture

The report is built dynamically by fetching the report and corresponding test data from the backend (in JSON format), and using javascript to build the HTML page on the frontend.

Since this is a single-page web application, [RequireJS](http://requirejs.org/) is used to divide program logic into separate javascript files which are then included dynamically depending on the type of report and tests being loaded. The global namespace is left almost completely unpolluted, because RequireJS is used to contain and manage the various module dependencies.

Most modules that deal with rendering parts of the page (inside the js/view folder), have a corresponding [Handlebars](http://handlebarsjs.com/) template file in js/template folder. These templates help with generating the various HTML sections of the page.

Responsive web design pattern is used in order for the page to render optimally on screens of varying sizes.

## 3rd Party Libraries

A number of 3rd party libraries is used for building and compiling the code.

  * Backbone
  * Underscore
  * RequireJS
  * RequireJS Text
  * Respond.js
  * iScroll
  * SASS
  * HTML5-placeholder-polyfill
  * qTip2
  * Handlebars
  * jQuery
  * jQuery Resize
  * jQuery Debounced Resize
  * Modernizr
  * Grunt
  * NodeJS

## Development Environment

[Grunt](http://gruntjs.com/) tasks are used to build the CSS and JavaScript modules.

Whenever changes are made to SASS files in css-sass folder, *grunt compass* command needs to be run in order to generate a browser compatible CSS file.

Changes made to JS files can be tested and debugged by viewing index-dev.html file. However, when deploying the changes to production, the JS files should be compiled using *grunt requirejs* command, and viewed in index.html file.

To simplify the process of manually building SASS and JS files, the *grunt watch* command can be run in the background which will immediately run the SASS or JS build process if any corresponding files are modified.

In order to install Grunt and other required modules, make sure to have [NodeJS](http://nodejs.org/) installed on your system and run *npm install* in the project root directory. All the dependencies are managed in package.json file.
