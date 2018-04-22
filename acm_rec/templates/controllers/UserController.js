angular.module('community').controller('userController', ['$scope', '$location', 'AuthService', 'AuthToken', '$rootScope', '$timeout', '$window', '$routeParams', '$http', '$filter', 'Upload', 'multipartForm',
    function($scope, $location, AuthService, AuthToken, $rootScope, $timeout, $window, $routeParams, $http, $filter, Upload, multipartForm) {
        $rootScope.loadingDiv = true;
        $scope.newTags = "";
        var currentId = $routeParams.id;
        $scope.oldDate = (new Date("2007/12/18")).getTime();
        $scope.birthdate = new Date(1996, 10, 20);
        $scope.langs = [
            "Arabic",
            "English",
            "French",
            "Deutsch"
        ]

        $http.get(backendUrl + '/api/user/viewprofile/' + currentId)
            .success(function(response) {
                $rootScope.loadingDiv = false;
                $scope.user = response.data;
                $scope.age = response.age;
            }).error(function(data) {
                $rootScope.handleErrors(data);
            });

        $scope.getOrganizations = function() {
            $http.get(backendUrl + '/api/user/getOrganizations/' + currentId).success(function(response) {
                var myMembers = response.data;
                if (myMembers == null || myMembers.length < 1) {} else {
                    $scope.members = response.data;
                }
            });
        }

        $scope.getPassword = function() {
            $rootScope.backgroundDiv = true;
            $scope.topDiv = true;
            $scope.passwordDiv = true;
        }

        $scope.saveChanges = function() {
            $rootScope.backgroundDiv = false;
            $scope.passwordDiv = false;
            $rootScope.loadingDiv = true;
            $scope.currentUser.birthdate = $scope.birthdate.toISOString().substring(0, 10);
            $http({
                    url: backendUrl + '/api/user/saveChanges',
                    method: "POST",
                    data: {
                        'user': $scope.currentUser,
                        'tags': $scope.newTags,
                        'username': $scope.currentUser.username,
                        'password': $scope.password
                    }
                })
                .then(function(response) {
                        $rootScope.loadingDiv = false;
                        AuthToken.setToken(response.data.token);
                        $window.location.reload();

                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.deleteTags = function() {
            $http({
                    url: backendUrl + '/api/user/deleteTags',
                    method: "POST",
                    data: {
                        'user': $scope.currentUser
                    }
                })
                .then(function(response) {
                        // success
                        $rootScope.loadingDiv = false;
                        AuthToken.setToken(response.data.token);
                        console.log("delete token: " + response.data.token);
                        $window.location.reload();

                    },
                    function(response) { // optional
                        // failed
                    });
        }

        $scope.$watch('currentUser.birthdate', function(newValue) {
            console.log(newValue);
            var newDate = (new Date(newValue)).getTime();
            // $scope.currentUser.birthdate = $filter('date')(newValue, 'yyyy/MM/dd');
            if (newDate != $scope.oldDate && newValue != undefined) {
                $scope.birthdate = new Date(newValue);
                $scope.oldDate = newDate;
            }
        });

        $scope.uploadPic = function(file) {
            console.log(file);
            file.upload = Upload.upload({
                url: 'http://s3-api.us-geo.objectstorage.softlayer.net/images/' + file.name,
                data: { username: $scope.username, file: file },
            });

            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }

        $scope.updateRating = function() {
            jQuery("fieldset").each(function(i) {
                var rating = jQuery(this).parent().attr('rating');
                console.log(rating);
                if (!rating)
                    rating = "0";
                var inputElement = $(this).find("[value=" + rating + "]");
                $(this).find("input").nextAll().css({ "color": "#ddd" });
                inputElement.css({ "color": "#FFD700" });
                inputElement.nextAll().css({ "color": "#FFD700" });
                // console.log($(this).find("[value="+rating+"]").val());
            });
        }

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $scope.updateRating();
        });

        $scope.customer = {};
        $scope.Submit = function() {
            $scope.customer.profilePhoto = $scope.profilePhoto;
            // console.log($scope.profilePhoto);
            var uploadUrl = '/api/user/updateProfilePhoto';
            // multipartForm.post(uploadUrl, $scope.customer);

            var fd = new FormData();
            var data = $scope.customer;
            for (var key in data) {
                console.log(key + " => " + data[key]);
                fd.append(key, data[key]);
            }
            $rootScope.loadingDiv = true;
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.msg = response.msg;
                    $rootScope.loadingDiv = true;
                    AuthToken.setToken(response.token);
                    setTimeout(function() {
                        $window.location.reload();
                    }, 1000);

                })
                .error(function(response) {
                    $rootScope.loadingDiv = true;
                    $rootScope.handleErrors(response);
                });
        }

        $scope.previewProfilePhoto = function() {
            var preview = document.getElementById('profilePhoto');
            var file = document.getElementById('fileUpload').files[0];
            var reader  = new FileReader();
            reader.addEventListener("load", function() {
                preview.src = reader.result;
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        }

        $scope.addLink = function() {
            if (!$scope.link) {
                $rootScope.error = "Fill all fields.";
            } else {
                $rootScope.loadingDiv = true;
                $rootScope.error = null;
                $http({
                        url: backendUrl + '/api/user/addlink',
                        method: "POST",
                        data: {
                            'link': $scope.link,
                        }
                    })
                    .then(function(response) {
                            $rootScope.loadingDiv = false;
                            $scope.link = {};
                            $rootScope.printMsg(response);
                        },
                        function(response) {
                            $rootScope.handleErrors(response);
                        });
            }
        }

        $scope.addOrganization = function() {
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/user/addOrganization',
                    method: "POST",
                    data: {
                        'organization': $scope.organization,
                    }
                })
                .then(function(response) {
                        $rootScope.loadingDiv = false;
                        $scope.organization = {};
                        $rootScope.printMsg(response);
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        jQuery('#profilePhoto').click(function() {
            jQuery('#fileUpload').click();
        });

        $scope.addLang = function() {
            $scope.currentUser.languages.push($scope.new_lang);
            console.log($scope.currentUser.languages)
            $scope.new_lang = null;
            jQuery(function() {
                jQuery('#targetModal').modal('toggle');
            });
        }
        $scope.getOrganizations();

    }
]);