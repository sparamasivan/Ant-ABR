# VCA Healthtracks

VCA Healthtracks allows pet owners to view their pet's lab results through an easy-to-use, single-page, web-based report.

## Files
  * [report.html](report.html) - Frontend endpoint used for displaying test results. Uses optimized (compressed) JS and CSS files, along with configuration settings geared towards live deployment.
  * [report-dev.html](report-dev.html) - Same as [report.html](report.html), but uses uncompressed JavaScript and other configuration settings which should help the programmer with developing and debugging code.
  * [login.html](login.html), [password-create.html](password-create.html), [password-forgot.html](password-forgot.html) - Static login/authentication pages that need to be integrated with the backend.
  * [data-map.html](data-map.html) - A dynamically generated table (from sample JSON data) that lists all the test codes and properties by test type (Urine, CBC, etc.). All these test codes and properties must be present for each test JSON data in order for the frontend to render the report successfully.

## Sample Tests

A version of this code should be up and running on [allboatsrise.com/dev/vca/ht-report](http://allboatsrise.com/dev/vca/ht-report/).

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

### Installation
  1. Install [NodeJS](http://nodejs.org/)
  2. Go to project root and run *npm install* on the command-line. All the dependencies are managed in [package.json](package.json) file.

Ensure the project root is located at the document root of the server. The site will only function correctly if accessed at the root of the domain (e.g. http://somedomain.com/), and not some subdirectory (e.g. http://somedomain.com/subdir/).

### Grunt Usage

  * *grunt compass:dev* - Run the command whenever changes are made to SASS files in css-sass folder in order to generate a browser compatible CSS file.
  * *grunt requirejs:dev* - Run the command when you want to launch URLs in index.html with the "Debug Urls: OFF" setting. This will use a compiled version of the javascript files
  * *grunt watch* - Simplifies the process of manually calling the above commands. This command continually runs in the background and will run the SASS or JS build process if any corresponding files are modified.
  * *grunt dist* - Extracts and builds all files necessary for deployment and puts them inside the "dist" folder.
