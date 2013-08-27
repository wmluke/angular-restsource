/**! 
 * angular-restsource v0.1.0
 * Copyright (c) 2013 Ares Project Management LLC <code@prismondemand.com>
 */
(function () {
    'use strict';

    /**
     * @param $http
     * @param $q
     * @param {String} rootUrl
     * @param {Object} [options]
     * @constructor
     */
    var Restsource = function ($http, $q, rootUrl, options) {
        var _opts = angular.extend({
            idField: 'id',
            responseInterceptors: [],
            httpConfig: {}
        }, options);

        var _self = this;

        function _defaultCfg(cfg) {
            return angular.extend(_opts.httpConfig, cfg);
        }

        function _intercept(httpPromise) {
            angular.forEach(_opts.responseInterceptors, function (responseInterceptor) {
                httpPromise = responseInterceptor(httpPromise);
            });
            return httpPromise;
        }

        Object.defineProperty(this, 'rootUrl', {
            get: function () {
                return rootUrl;
            }
        });

        this.create = function (record, cfg) {
            return _intercept($http.put(rootUrl, record, _defaultCfg(cfg)));
        };

        this.read = function (id, cfg) {
            var url = [rootUrl];
            if (id) {
                url.push(id);
            }
            return _intercept($http.get(url.join('/'), _defaultCfg(cfg)));
        };

        this.update = function (record, cfg) {
            return _intercept($http.post(rootUrl, record, _defaultCfg(cfg)));
        };

        this.save = function (record, cfg) {
            return record[_opts.idField] ? _self.update(record, _defaultCfg(cfg)) : _self.create(record, _defaultCfg(cfg));
        };

        this.list = function (page, perPage, cfg) {
            cfg = angular.extend({
                params: {
                    page: page,
                    perPage: perPage
                }
            }, cfg);
            return _intercept($http.get(rootUrl, _defaultCfg(cfg)));
        };

        this.delete = function (id, cfg) {
            var url = [rootUrl];
            if (id) {
                url.push(id);
            }
            return _intercept($http.delete(url.join('/'), _defaultCfg(cfg)));
        };

        this.clone = function (opts) {
            return new Restsource($http, $q, rootUrl, angular.extend(_opts, opts));
        };
    };

    angular.module('angular-restsource', []).config(['$provide', function ($provide) {

        $provide.provider('restsource', function () {

            this.provide = function (name, url) {

                return $provide.provider(name, function () {
                    var _self = this;
                    var _httpConfig = {};
                    var _responseInterceptors = [];
                    var _useBodyResponseInterceptor = true;

                    this.httpConfig = function (config) {
                        _httpConfig = config;
                        return _self;
                    };

                    this.useBodyResponseInterceptor = function (enable) {
                        _useBodyResponseInterceptor = enable;
                        return _self;
                    };

                    this.addResponseInterceptor = function (interceptor) {
                        _responseInterceptors.push(interceptor);
                        return _self;
                    };

                    this.$get = function ($injector, restsource) {
                        if (_useBodyResponseInterceptor) {
                            _responseInterceptors.push('bodyResponseInterceptor');
                        }
                        var interceptors = [];
                        angular.forEach(_responseInterceptors, function (interceptor) {
                            interceptors.push(angular.isString(interceptor) ? $injector.get(interceptor) : $injector.invoke(interceptor));
                        });
                        return restsource(url, {
                            httpConfig: _httpConfig,
                            responseInterceptors: interceptors
                        });
                    };
                    this.$get.$inject = ['$injector', 'restsource'];
                });

            };

            this.$get = function ($http, $q) {
                return function (url, cfg) {
                    return new Restsource($http, $q, url, cfg);
                };
            };
            this.$get.$inject = ['$http', '$q'];

        });

        $provide.factory('bodyResponseInterceptor', ['$q', function ($q) {
            return function (httpPromise) {
                var promise = httpPromise.then(function (response) {
                    if (response.data.error || !response.data.body) {
                        return $q.reject(response);
                    }
                    return response.data.body;
                });

                // Retain the $httpPromise API

                promise.success = function (fn) {
                    httpPromise.then(function (response) {
                        fn(response.data.body, response.status, response.headers, response.config);
                    });
                    return promise;
                };
                promise.error = function (fn) {
                    httpPromise.then(null, function (response) {
                        fn(response.data.error, response.status, response.headers, response.config);
                    });
                    return promise;
                };

                return promise;
            };
        }]);

    }]);

})();
