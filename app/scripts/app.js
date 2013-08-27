'use strict';

angular.module('angular-restsource-demo-app', ['angular-restsource'])
    .config(['restsourceProvider', function (restsourceProvider) {

        // Create a userRestsource that pulls data from http://localhost:9999/api/user
        restsourceProvider.provide('userRestsource', 'http://localhost:9999/api/user')

            // Add $http config's to be used with each call

            // Enable CORS support
            .httpConfig({withCredentials: true})

            // Use the bodyResponseInterceptor to return `response.data.body` and `response.data.error`
            // for success and error responses respectively.  ENABLED BY DEFAULT.
            .useBodyResponseInterceptor(true)

            // Like `$httpProvider.responseInterceptors`, `addResponseInterceptor` takes either
            // a function or a service string

            // Add a response interceptor to log requests
            .addResponseInterceptor(['$log', function ($log) {
                return function (promise) {
                    promise.success(function (body, status, headers, config) {
                        $log.log([config.method, config.url, status].join(' '));
                        $log.log('  params: ' + JSON.stringify(config.params));
                        if (config.data) {
                            $log.log('  data: ' + JSON.stringify(config.data));
                        }
                    });
                    return promise;
                };
            }]);

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
