/**
 * RTFM:
 *   - http://docs.angularjs.org/guide/dev_guide.unit-testing
 *   - http://docs.angularjs.org/api/angular.mock.inject
 */

describe('Service: Restsource', function () {
    'use strict';

    // load the service's module
    beforeEach(module('angular-restsource'));

    // instantiate service
    var _Restsource,
        $httpBackend;

    beforeEach(inject(function (Restsource, $injector) {
        $httpBackend = $injector.get('$httpBackend');
        _Restsource = Restsource;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('Restsource.create', function () {

        it('should create a Restsource instance with the root url', function () {
            var fooResource = _Restsource.create('/api/foo');
            expect(fooResource.rootUrl).toBe('/api/foo');
        });
    });

    describe('Restsource instance', function () {

        var userResource,
            theUser = {id: '123', name: 'Yo Momma'},
            theResponseBody = {foo: 'bar'},
            theResponse = {success: true, body: theResponseBody};

        beforeEach(function () {
            userResource = _Restsource.create('/api/user');
        });

        it('should send a request to create a user', function () {
            $httpBackend.expectPUT('/api/user', theUser).respond(theResponse);

            var promise = userResource.create(theUser);
            promise.success(function (body) {
                expect(body).toBe(theResponseBody);
            });

            $httpBackend.flush();
        });

        it('should send a request to read a user', function () {

            $httpBackend.expectGET('/api/user/123abc').respond(theResponse);

            userResource.read('123abc').success(function (body) {
                expect(body).toBe(theResponseBody);
            });

            $httpBackend.flush();
        });

        it('should send a request to list users', function () {

            $httpBackend.expectGET('/api/user?page=2&perPage=5').respond(theResponse);

            userResource.list(2, 5).success(function (body) {
                expect(body).toBe(theResponseBody);
            });

            $httpBackend.flush();

        });

        it('should send a request to update a user', function () {
            $httpBackend.expectPOST('/api/user', theUser).respond(theResponse);

            userResource.update(theUser).success(function (body) {
                expect(body).toBe(theResponseBody);
            });

            $httpBackend.flush();
        });

        it('should send a request to delete a user', function () {
            $httpBackend.expectDELETE('/api/user/123abc').respond(theResponse);

            userResource.delete('123abc').success(function (body) {
                expect(body).toBe(theResponseBody);
            });

            $httpBackend.flush();
        });

        describe('Restsource:save', function () {

            var existingUser = {id: '123', name: 'Yo Momma'},
                newUser = {name: 'Yo Momma'};

            it('should send a request to create the user when the user has no ID', function () {
                $httpBackend.expectPUT('/api/user', newUser).respond(theResponse);

                userResource.save(newUser).success(function (body) {
                    expect(body).toBe(theResponseBody);
                });

                $httpBackend.flush();
            });

            it('should send a request to update the user when the user has an ID', function () {
                $httpBackend.expectPOST('/api/user', existingUser).respond(theResponse);

                userResource.save(existingUser).success(function (body) {
                    expect(body).toBe(theResponseBody);
                });

                $httpBackend.flush();
            });

        });

    });

});