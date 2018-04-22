angular.module('community').controller('mainController', ['$scope', '$location', 'AuthService', '$rootScope', '$timeout', '$window', '$http', '$routeParams',
    function($scope, $location, AuthService, $rootScope, $timeout, $window, $http, $routeParams) {
        $rootScope.loadingDiv = false;
        $rootScope.error = false;
        $rootScope.msg = null;

        $scope.login = function() {
            $scope.error = false;
            $scope.disabled = true;
            $rootScope.loadingDiv = true;
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                .then(function() {
                    AuthService.getUser().then(function(currentUser) {
                        $rootScope.currentUser = currentUser;
                        if (currentUser != null)
                            $rootScope.userStatus = true;
                        else
                            $rootScope.userStatus = false;
                    });
                    $window.location.assign('/#/offers');
                    $rootScope.loadingDiv = false;
                }).catch(function() {
                    $scope.error = true;
                    $rootScope.error = "Invalid username and/or password";
                    // $scope.loginForm = {};
                    $scope.disabled = false;
                    $rootScope.loadingDiv = false;
                });
        }

        $rootScope.getUnis = function() {
            console.log("loading unis")
            $rootScope.unis_loading = true;
            $http({
                    url: backendUrl + '/api/unis/',
                    method: "get"
                })
                .then(function(response) {
                        $rootScope.unis_loading = false;
                        $rootScope.unis = response.data.unis;
                        console.log($rootScope.unis)
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.initRegisterform = function() {
            $scope.type = "student";
            $rootScope.disabled = false;
            // $rootScope.loadingDiv = true;
            $rootScope.getUnis();
        }


        $scope.register = function() {
            $scope.registerForm.idPic = $scope.idPic;
            var newUser = $scope.registerForm;
            var fd = new FormData();
            var data = $scope.registerForm;
            newUser.type = $scope.type;
            var uni = JSON.parse($scope.registerForm.uni);
            data.uni = uni._id;
            for (var key in data) {
                // console.log(key + " => " + data[key]);
                fd.append(key, data[key]);
            }
            $rootScope.loadingDiv = true;
            $rootScope.disabled = true;
            $http.post('/api/user/signup', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.disabled = false;

                    $rootScope.printMsg(response);
                    setTimeout(function() {
                        $window.location.href = '/#/signin';
                    }, 2000);
                })
                .error(function(response) {
                    $rootScope.disabled = false;

                    $rootScope.handleErrors(response);
                });

        }

        $scope.changeUni = function() {
            var uni = JSON.parse($scope.registerForm.uni);
            $scope.majors = uni.majors;
            $scope.registerForm.major = null;
            $scope.registerForm.year = null;
            $scope.years = uni.years;
        }

        $scope.logout = function() {
            $rootScope.loadingDiv = true;
            $timeout(function() {
                AuthService.logout()
                    .then(function() {
                        // $scope.loadingDiv = false;
                        $rootScope.userStatus = false;
                        $window.location.assign('/#/signin');
                    });
            }, 1000);
        }

        $rootScope.exit = function() {
            console.log("exit");
            $rootScope.topDivShow = false;
            $rootScope.error = null;
            $rootScope.msg = null;
            $rootScope.backgroundDiv = false;
            $rootScope.cameraRequested = false;
        }

        $rootScope.handleErrors = function(response) {
            console.log(response)
            $rootScope.msg = null;
            $window.scrollTo(0, 0);
            $rootScope.disabled = false;
            $rootScope.loadingDiv = false;
            $rootScope.error = "";
            var errors = response.errors || response.data.errors;
            if (errors) {
                errors.forEach(function(error) {
                    $rootScope.error += error.msg;
                });
            } else {
                $rootScope.msg = null;
                $rootScope.error = "Sorry, something went wrong";
            }
            if (response.msg) {
                $rootScope.error = response.msg;
            }
        }

        $rootScope.printMsg = function(response) {
            $scope.loadingDiv = false;
            if (response && (response.msg || response.data.msg)) {
                $rootScope.msg = response.msg || response.data.msg;
                $window.scrollTo(0, 0);
                $rootScope.error = null;
            } else {
                $rootScope.msg = "Success!"
            }
            $timeout(function() {
                $rootScope.msg = null;
            }, 3000);

        }

        $rootScope.updateWidth = function() {
            var screenwith = parseInt(jQuery('#bs-example-navbar-collapse-1').width());
            var formWidth = parseInt(jQuery('#formDiv').width());
            var normalWidth = parseInt(jQuery('#normalNav').width());
            var diff = screenwith - (normalWidth + formWidth);
            if (screenwith < (normalWidth + formWidth)) {
                jQuery('#normalNav').hide();
                jQuery('#shortDiv').show();
            } else {
                jQuery('#shortDiv').hide();
                jQuery('#normalNav').show();
            }
        }

        $scope.previewImg = function(file, img) {

            var preview = document.getElementById(img);
            var file = document.getElementById(file).files[0];
            var reader  = new FileReader();
            reader.addEventListener("load", function() {
                preview.src = reader.result;
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        }

        $scope.previewSubImg = function() {
            var preview = document.getElementById('subImg' + $rootScope.subDepIdImg);
            var file = document.getElementById('subDepFile' + $rootScope.subDepIdImg).files[0];
            var reader  = new FileReader();
            reader.addEventListener("load", function() {
                preview.src = reader.result;
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        }

        $scope.goToSearch = function() {
            $window.location.assign('/#/search/' + $scope.searchterm);
        }

        $scope.getSearchResults = function() {
            var searchterm = $routeParams.searchterm;
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/user/search/' + searchterm)
                .success(function(response) {
                    $scope.students = response.results;
                    $rootScope.loadingDiv = false;
                }).error(function(data) {
                    $rootScope.handleErrors(data);
                });

        }
        $rootScope.updateDateInputs = function() {
            var j = jQuery.noConflict();
            // j('input[type="date"]').focus(function() {
            //     // j(this).click();
            // });
        }

        $rootScope.updateWidth();
    }
]);