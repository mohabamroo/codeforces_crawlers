var app = angular.module('community');
app.controller('eventsController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'AuthService',
    function($scope, $rootScope, $http, $location, $routeParams, AuthService) {
        $scope.selectedEvent = null;
        $rootScope.topDivShow = false;
        $rootScope.backgroundDiv = false;
        $scope.selectEvent = function(id) {
            $http.get(backendUrl + '/api/events/getEvent/' + id).success(function(event) {
                console.log(event);
                $scope.selectedEvent = event;
                $rootScope.topDivShow = true;
                $rootScope.backgroundDiv = true;
                console.log($scope.topDivShow)
            });
        }

        $scope.getCurrentEvents = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/events/current')
                .success(function(response) {
                    $scope.events = response.events;
                    $rootScope.loadingDiv = false;
                }).catch(function(res) {
                    console.log(res);
                    $rootScope.loadingDiv = false;
                });
        }

        $scope.getComingEvents = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/events/coming')
                .success(function(response) {
                    $scope.events = response.events;
                    $rootScope.loadingDiv = false;
                }).catch(function(res) {
                    console.log(res);
                    $rootScope.loadingDiv = false;
                });;
        }

        $scope.getOldEvents = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/events/old')
                .success(function(response) {
                    $scope.events = response.events;
                    $rootScope.loadingDiv = false;
                }).catch(function(res) {
                    console.log(res);
                    $rootScope.loadingDiv = false;
                });;
        }

        $scope.hideDetailedView = function(event) {
            // if (keyEvent.which === 27) {
            $rootScope.topDivShow = false;
            $rootScope.backgroundDiv = false;
            // }
        }

        $scope.getCurrentEvents();



    }
]);