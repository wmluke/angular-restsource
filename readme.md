# angular-restsource

> Restful resources for AngularJS

[![Build Status](https://travis-ci.org/AresProjectManagement/angular-restsource.png?branch=master)](https://travis-ci.org/AresProjectManagement/angular-restsource)

## Installation

Download [angular-restsource.js](https://github.com/AresProjectManagement/angular-restsource/blob/master/dist/scripts/angular-restsource.js) or install with bower.

```bash
$ bower install angular-restsource --save
```

Load the `angular-restsource` modules into your app and configure...

```javascript
angular.module('app', ['angular-restsource'])
    .config(['restsourceProvider', function (restsourceProvider) {

        // Create a userRestsource that pulls data from http://localhost:9999/api/user
        restsourceProvider.provide('userRestsource', 'http://localhost:9999/api/user')

            // Add $http config's to be used with each call

            // Enable CORS support
            .httpConfig({withCredentials: true})

            // Add a custom verb to read the user's name from GET http://localhost:9999/api/user/:id/name
            // The function transforms the method signature into a `$http` config per http://docs.angularjs.org/api/ng.$http
            .verb('readName', function (id, cfg) {
                return angular.extend(cfg || {}, {
                    method: 'GET',
                    url: '/' + id + '/name'
                });
            })

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
    }]);
```

## Usage

Alternatively, register a Restsource service

```javascript
    angular.module('angular-restsource-demo-app').factory('userRestsource', ['restsource', 'env', function (restsource, env) {
        return restsource(env.apiUrl + '/user');
    }]);
```

Use the Restsource

```javascript
angular.module('angular-restsource-demo-app')
    .controller('MainCtrl', ['$scope', 'userRestsource', function ($scope, userRestsource) {

        $scope.page = 1;
        $scope.perPage = 5;

        $scope.create = function (user) {
            userRestsource.create(user).success(function () {
                $scope.list($scope.page, $scope.perPage);
            });
        };

        $scope.read = function (id) {
            userRestsource.read(id).success(function (user) {
                $scope.selectedUser = user;
            });
        };

        $scope.readName = function (id) {
            userRestsource.readName(id).success(function (name) {
                alert(name);
            });
        };

        $scope.list = function (page, perPage) {
            $scope.users = userRestsource.list(page, perPage);
        };

        $scope.update = function (user) {
            userRestsource.update(user).success(function () {
                $scope.list($scope.page, $scope.perPage);
            });
        };

        $scope.delete = function (user) {
            userRestsource.delete(user.id).success(function () {
                $scope.selectedUser = null;
                $scope.list($scope.page, $scope.perPage);
            });
        };

        $scope.list($scope.page, $scope.perPage);

        $scope.$watch(function () {
            return $scope.page * $scope.perPage;
        }, function () {
            $scope.list($scope.page, $scope.perPage);
        });

    }]);
```

### API

See https://github.com/AresProjectManagement/angular-restsource/blob/master/test/spec/angular-restsource-spec.js

### Sample App

See https://github.com/AresProjectManagement/angular-restsource/tree/master/app.

## Contributing

### Prerequisites

The project requires [Bower](http://bower.io), [Grunt](http://gruntjs.com), and [PhantomJS](http://phantomjs.org).  Once you have installed them, you can build, test, and run the project.

### Build & Test

To build and run tests, run either...

```bash
$ make install
```

or

```bash
$ npm install
$ bower install
$ grunt build
```

### Demo & Develop

To run a live demo or do some hackery, run...

```bash
$ grunt server
```

## License

MIT
