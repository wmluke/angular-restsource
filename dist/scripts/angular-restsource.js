/**! 
 * angular-restsource v0.0.1
 * Copyright (c) 2013 Ares Project Management LLC <code@prismondemand.com>
 */
(function () {
    'use strict';

    angular.module('angular-restsource', []).factory('Restsource', ['$http', '$q', function ($http, $q) {

        /**
         * @name Restsource
         * @param {String} rootUrl
         * @param {Object} [options]
         * @constructor
         */
        var Restsource = function (rootUrl, options) {
            var _opts = angular.extend({
                idField: 'id',
                onError: null,
                onSuccess: null
            }, options);

            var _self = this;

            function _defaultCfg(cfg) {
                return angular.extend({withCredentials: true}, cfg);
            }

            function _intercept(httpPromise) {
                var success = function (response) {
                    if (response.data.error || !response.data.body) {
                        return $q.reject(response);
                    }
                    return response.data.body;
                };
                var error = _opts.onError || function (response) {
                    return $q.reject(response);
                };
                var promise = httpPromise.then(success, error);

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
                return new Restsource(rootUrl, angular.extend(_opts, opts));
            };
        };

        Restsource.create = function (rootUrl) {
            return new Restsource(rootUrl);
        };

        return Restsource;
    }]);
})();
