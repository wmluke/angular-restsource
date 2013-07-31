'use strict';

angular.module('angular-restsource-demo-app', ['angular-restsource'])
    .factory('userRestsource', ['Restsource', function (Restsource) {
        return new Restsource('http://localhost:9999/api/user');
    }])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // Allow CORS requests
        $httpProvider.defaults.useXDomain = true;
    }]);
