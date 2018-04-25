angular.module('bachelor').controller('mainController', ['$scope', '$location', 'AuthService',
    '$rootScope', '$timeout', '$window', '$http', '$routeParams',
    function($scope, $location, AuthService, $rootScope, $timeout, $window, $http, $routeParams) {

        $rootScope.toggleNavBar = function() {
            jQuery("#navbarColor01").slideToggle();
        }


        $rootScope.handleErrors = function(response) {
            $rootScope.stopLoading();
            var errorString = "";
            var errors = response.data;
            for (key in errors) {
                var error_msg = "Something is wrong.";
                if (Array.isArray(errors[key])) {
                    error_msg = errors[key][0];
                } else if (typeof errors[key] === 'string') {
                    error_msg = errors[key];
                }
                errorString +=
                    '* <b>' + key + '</b>' + ' : ' + error_msg + '<br>';
            }

            swal({
                type: 'error',
                title: 'Something went wrong: ' + response.status,
                html: errorString
            });
        }

        $rootScope.overlay = function(property = 'block') {
            $("#overlay").css({ display: property });
        }

        $rootScope.stopLoading = function() {
            $rootScope.overlay('none');
        }

        $rootScope.login = function(isValid) {
            if (isValid) {
                $rootScope.overlay();
                AuthService.login($scope.user)
                    .then(function() {
                        $rootScope.stopLoading();
                        $window.location.assign('/#/recommendations');
                        $rootScope.userStatus = AuthService.isLoggedIn();
                    }).catch(function(err) {
                        $rootScope.handleErrors(err);
                    });
            }
        }

        $rootScope.logout = function() {
            AuthService.logout()
                .then(function() {
                    $rootScope.userStatus = AuthService.isLoggedIn();
                    $location.path('signin');
                });
        }

        $rootScope.notAuthorized = function() {
            swal('You are not authorized!',
                'Please, log in first.',
                'error'
            );
            $location.path('signin');
        }

        $rootScope.register = function(isValid) {
            if (isValid) {
                AuthService.register($scope.user)
                    .then(function() {
                        $rootScope.stopLoading();
                        swal('Signed up successfully!',
                            'Sign in now to get your recommendations.',
                            'success'
                        );
                        $window.location.assign('/#/signin');
                    }).catch(function(err) {
                        $rootScope.handleErrors(err);
                    });
            }
        }
    }
]);