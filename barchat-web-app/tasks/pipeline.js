/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files, and the ! prefix for excluding files.)
 */

// Path to public folder
var tmpPath = '.tmp/public/';

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'styles/**/*.css',
  'bower_components/bootstrap/less/bootstrap.css',
  'bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css',
  'bower_components/angular-bootstrap/ui-bootstrap-csp.css',
  '/bower_components/angular-flash-alert/dist/angular-flash.min.css',
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  // Dependencies like jQuery, or Angular are brought in here (not used)
  'js/dependencies/**/*.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js',
  //EXTERNAL
  'https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js',
  'https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js',
  //BOWER INCLUDES
  '/bower_components/jquery/dist/jquery.js',
  '/bower_components/angular/angular.js',
  '/bower_components/angular-route/angular-route.js',
  '/bower_components/angular-bootstrap/ui-bootstrap.min.js',
  '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  '/bower_components/bootstrap/dist/js/bootstrap.js',
  '/bower_components/angular-sails/dist/angular-sails.js',
  '/bower_components/underscore/underscore-min.js',
  '/bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js',
  '/bower_components/angular-ui-router/release/angular-ui-router.min.js',
  '/bower_components/angular-deckgrid/angular-deckgrid.js',
  '/bower_components/angular-flash-alert/dist/angular-flash.min.js',
  '/bower_components/underscore.string/dist/underscore.string.min.js',
  '/bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js',
  '/bower_components/ng-tags-input/ng-tags-input.min.js',
  'bower_components/angular-adaptive-detection/angular-adaptive-detection.min.js',
  'bower_components/fastclick/lib/fastclick.js',
  'bower_components/ngFacebook/version/v0.0.7/ngFacebook.min.js',
  'bower_components/moment/moment.js',
  // ANGULAR APP FILES
  'app.js',
  'services/localStorageService.js',
  'controllers/chatCtrl.js',
  'controllers/topicCtrl.js',
  'factories/topicFactory.js',
  'services/wikiDataService.js',
  'filters/cutFilter.js',
  'services/topicalGraphService.js',
  'services/oEmbedService.js',
  'factories/userFactory.js',
  'directives/chatMessageDir.js',
  'directives/topicMessageDir.js'


  // Use the "exclude" operator to ignore files
  // '!js/ignore/these/files/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [

  'templates/**/*.html'
];


// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(transformPath);
module.exports.jsFilesToInject = jsFilesToInject.map(transformPath);
module.exports.templateFilesToInject = templateFilesToInject.map(transformPath);

// Transform paths relative to the "assets" folder to be relative to the public
// folder, preserving "exclude" operators.
function transformPath(path) {
  return (path.substring(0, 1) == '!') ? ('!' + tmpPath + path.substring(1)) : (tmpPath + path);
}
