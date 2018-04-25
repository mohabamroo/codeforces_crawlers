console.log("dljdnkjbn")
angular.module('bachelor').controller('UserController', ['$scope', '$location', 'AuthService',
    '$rootScope', '$timeout', '$window', '$http', '$routeParams',
    function($scope, $location, AuthService, $rootScope, $timeout, $window, $http, $routeParams) {

        $rootScope.getRecommendations = function() {
            $rootScope.overlay();
            $http({
                    url: backendUrl + '/api/users/recommendations/',
                    method: "get"
                })
                .then(function(response) {
                        console.log(response);
                        $rootScope.stopLoading();
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }
    }
]);