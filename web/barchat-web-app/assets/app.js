'use strict';

/**
 * The main Sails Angular app module
 *
 * @type {angular.Module}
 */
var app = angular.module('app', ['ui.router','ui.bootstrap', 'ngSails', 'angular-flash.flash-alert-directive',
  'akoenig.deckgrid', 'geolocation', 'ngTagsInput', 'client-storage',
   'facebook', 'adaptive.detection']);

app.run(function ($log) {
  FastClick.attach(document.body);
  $log.debug('initialized fastclick');
});
app.config(function ($stateProvider, $locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $stateProvider
    .state('home', {
      resolve: {},
      url: '/?goto',
      templateUrl: '/templates/views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'Home'
    })
    .state('user', {
      resolve: {},
      url: '/user/:company_slug/:user_uuid',
      templateUrl: '/templates/views/user.html',
      controller: 'UserCtrl',
      controllerAs: 'UserView'
    })
    .state('results', {
      resolve: {},
      url: '/results/:company_slug/:user_uuid',
      templateUrl: '/templates/views/results.html',
      controller: 'ResultsCtrl',
      controllerAs: 'Results'
    })
    .state('vouch', {
      resolve: {},
      url: '/vouch/:link_code',
      templateUrl: '/templates/views/vouch_code.html',
      controller: 'VouchCodeCtrl',
      controllerAs: 'VouchCode'
    });

});

app.config(function (flashProvider) {
  // Support bootstrap 3.0 "alert-danger" class with error flash types
  flashProvider.errorClassnames.push('alert-danger');
  /**
   * Also have...
   *
   * flashProvider.warnClassnames
   * flashProvider.infoClassnames
   * flashProvider.successClassnames
   */
});

app.run(function ($rootScope) {
  // Load the facebook SDK asynchronously
  (function () {
    // If we've already installed the SDK, we're done
    if (document.getElementById('facebook-jssdk')) {
      return;
    }

    // Get the first script element, which we'll use to find the parent node
    var firstScriptElement = document.getElementsByTagName('script')[0];

    // Create a new script element and set its id
    var facebookJS = document.createElement('script');
    facebookJS.id = 'facebook-jssdk';

    // Set the new script's source to the source of the Facebook JS SDK
    facebookJS.src = '//connect.facebook.net/en_US/all.js';

    // Insert the Facebook JS SDK into the DOM
    firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
  }());
});
