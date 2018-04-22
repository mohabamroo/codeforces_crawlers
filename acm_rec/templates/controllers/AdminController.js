angular.module('community').controller('AdminController', ['$scope', '$location', '$rootScope', '$http', '$window', '$controller',
    function($scope, $location, $rootScope, $http, $window, $controller) {
        $controller('JobsController', { $scope: $scope }); //This works

        $scope.ensureAdmin = function() {
            console.log("ensuring")
        }

        $scope.getCompanies = function() {
            $rootScope.loadingDiv = true;
            $http.get(backendUrl + '/api/admin/companies')
                .success(function(response) {
                    $scope.companies = response.companies;
                    console.log(response);
                    $rootScope.loadingDiv = false;
                }).catch(function(res) {
                    $rootScope.handleErrors(res);
                });
        }

        $scope.verifyCompany = function(company_id) {
            console.log(company_id);
            $rootScope.loadingDiv = true;

            $http({
                    url: backendUrl + '/api/admin/companies/verify/' + company_id,
                    method: "POST",
                })
                .then(function(response) {
                        $rootScope.loadingDiv = false;
                        console.log(response);
                        $rootScope.msg = response.msg;
                        $window.location.reload();
                    },
                    function(response) {
                        $rootScope.handleErrors(response);
                    });
        }

        $scope.addJobByAdmin = function() {
            console.log($scope.newJob);
            if ($scope.ensureNonEmptyTargets()) {
                $rootScope.loadingDiv = true;
                var url = backendUrl + '/api/admin/jobs/add';
                $http({
                        url: url,
                        method: "POST",
                        data: $scope.newJob
                    })
                    .then(function(response) {
                            $scope.printMsg(response);
                            $timeout(function() {
                                $window.location = '/#/admin/jobs/add';
                            }, 2000);
                        },
                        function(response) {
                            $rootScope.handleErrors(response);
                        });
            }

        }
    }
]);