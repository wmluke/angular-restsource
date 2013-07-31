'use strict';

angular.module('angular-restsource-demo-app')
    .controller('MainCtrl', ['$scope', 'userRestsource', function ($scope, userRestsource) {
        $scope.show = true;

        $scope.users = userRestsource.list().success(function (users) {
            console.log(users);
        });
    }]);
