'use strict';

/**
 * The main Sails Angular app module + run time initializations
 *
 * @type {angular.Module}
 */
var app = angular.module('app', ['ui.router','ui.bootstrap', 'ngSails',
  'akoenig.deckgrid', 'geolocation', 'ngTagsInput', 'client-storage',
   'facebook', 'adaptive.detection','ngFlash']);

app.run(function ($log) {
  FastClick.attach(document.body);
});

app.config(function ($stateProvider, $locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $stateProvider
    .state('home', {
      resolve: {},
      url: '/?search',
      templateUrl: '/templates/views/chat.html',
      controller: 'ChatController'
    })
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

/*
TODO
 */
//2do scroll from bottom
//2do trigger topic search when typing /topic
//2do configure socket io to instantiate the chat as a room with x,y,z members (specified in query params)
//2do add postgress db persistence
//2do fix top header
//2do remove 'from' field once I have implmeented a real room channel
/*
DONE
 */
