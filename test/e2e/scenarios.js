/**
 * RTFM: http://docs.angularjs.org/guide/dev_guide.e2e-testing
 */

describe('module: angular-restsource', function () {
    'use strict';

    beforeEach(function () {
        browser().navigateTo('../index.html');
    });


    it('should fetch a list of users', function () {

        expect(repeater('.li-user').count()).toEqual(3);
        expect(repeater('.li-user').row(0)).toEqual(['Luke']);
        expect(repeater('.li-user').row(1)).toEqual(['Matt']);
        expect(repeater('.li-user').row(2)).toEqual(['Tim']);

    });

});
