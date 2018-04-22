angular.module('community').controller('companiesController', ['$scope', '$location', 'AuthService', 'AuthToken', '$rootScope', '$timeout', '$window', '$routeParams', '$http', '$filter',
    function($scope, $location, AuthService, AuthToken, $rootScope, $timeout, $window, $routeParams, $http, $filter) {
        var currentId = $routeParams.id;
        $rootScope.msg = null;
        $rootScope.error = null;
        $rootScope.disabled = false;

        $scope.getCompany = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/company/viewprofile/' + currentId)
                .success(function(response) {
                    if (response.success) {
                        $scope.company = response.data;
                        $rootScope.company = response.data;
                        $rootScope.loadingDiv = false;
                        $scope.getBranches();
                        $scope.getOffers();
                    }
                }).error(function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.getBranches = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/company/getBranches/' + $scope.company._id).success(function(response) {
                if (response.success) {
                    $scope.branches = response.data;
                    $rootScope.loadingDiv = false;
                }
            }).error(function(response) {
                $rootScope.error = "";
                if (response.data.errors)
                    response.data.errors.forEach(function(daa) {});
            });
        }

        $scope.redirectNewBranch = function() {
            $window.location.href = "/#/company/addBranch/";
        }

        $scope.addBranch = function() {
            $rootScope.loadingDiv = true;
            $rootScope.disabled = true;
            $rootScope.error = "";
            var newBranch = $scope.newBranch;
            $http({
                    url: backendUrl + '/api/company/addBranch',
                    method: "POST",
                    data: {
                        'newBranch': newBranch,
                    }
                })
                .then(function(response) {
                    $window.scrollTo(0, 0);
                    $rootScope.loadingDiv = false;
                    if (response.data.success) {
                        $rootScope.msg = response.data.msg;
                        setTimeout(function() {
                            $window.location.href = '/#/' + $rootScope.currentUser.usertype + '/viewprofile/' + $rootScope.currentUser._id;
                        }, 2000);
                    }
                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.getOffers = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/offers/getOffers/' + $scope.company._id).success(function(response) {
                if (response.success) {
                    $scope.offers = response.data;
                    $rootScope.loadingDiv = false;
                }
            }).error(function(response) {
                $rootScope.handleErrors(response);
            });
        }

        $scope.getMinimalBranches = function() {
            console.log("wewe");
            var companyId = $routeParams.id;
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/company/getMinimalBranches/' + companyId,
                    method: "get",
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    $rootScope.msg = response.data.msg;
                    $scope.branches = response.data.data;
                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.getCodes = function() {
            console.log($scope.codesForm.branchID);
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/company/getCodes/',
                    method: "post",
                    data: { 'branchID': $scope.codesForm.branchID }
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    console.log(response);
                    $scope.codes = response.data.data;
                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.getAnalytics = function() {
            $rootScope.loadingDiv = true;
            $http({
                    url: backendUrl + '/api/company/analytics/',
                    method: "get",
                })
                .then(function(response) {
                    $rootScope.loadingDiv = false;
                    $scope.stats = response.data.stats;
                    console.log(response.stats);
                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        jQuery('#logoEdit').click(function() {
            jQuery('#fileUpload').click();
        });

        $scope.updateLogo = function() {
            $rootScope.loadingDiv = true;
            var fd = new FormData();
            fd.append('logoPhoto', $scope.logoPhoto);
            $http.post(backendUrl + '/api/company/updateLogo', fd, {
                    transformRequest: angular.indentity,
                    headers: { 'Content-Type': undefined }
                }).success(function(response) {
                    $rootScope.msg = response.msg;
                    $rootScope.loadingDiv = false;
                    console.log(response)
                    $scope.company.logo = response.url;
                })
                .error(function(response) {
                    $rootScope.loadingDiv = true;
                    $rootScope.handleErrors(response);
                });
        }

        $scope.saveCompanyDescription = function() {
            if ($scope.company.description != null && $scope.company.description != "") {
                $rootScope.loadingDiv = true;
                $http({
                        url: backendUrl + '/api/company/update/description',
                        method: "post",
                        data: { 'description': $scope.company.description }
                    })
                    .then(function(response) {
                        $rootScope.printMsg(response);
                    }, function(response) {
                        $rootScope.handleErrors(response);
                    });
            }
        }

        $scope.clubs = [{ name: "nnn", id: "123" }, { name: "what", id: "1334" }];
        $scope.updateFeatClub = function() {
            console.log($scope.company.club);
            $http({
                    url: backendUrl + '/api/company/update/club',
                    method: "post",
                    data: { 'club': $scope.company.club }
                })
                .then(function(response) {
                    $rootScope.printMsg(response);
                }, function(response) {
                    $rootScope.handleErrors(response);
                });
        }

        $scope.getCompClubs = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/company/clubs/')
                .success(function(response) {
                    $rootScope.loadingDiv = false;
                    $scope.clubs = response.clubs;
                }).error(function(response) {
                    $rootScope.handleErrors(response);
                });
        }
    }
]);