var app = angular.module('community');

app.controller('JobsController', ['$scope', '$rootScope', '$http', '$location', '$window', '$routeParams', '$timeout',
    function($scope, $rootScope, $http, $location, $window, $routeParams, $timeout) {

        $scope.jobAttrs = function() {
            $scope.types = [
                "Internship",
                "Part-time",
                "Full-time"
            ]
            $scope.newJob = {};
            $scope.newJob.targets = [];
            $rootScope.getUnis();
        }

        $scope.changeTargetUni = function() {
            var uni = JSON.parse($scope.target.uni);
            $scope.majors = uni.majors;
            $scope.years = uni.years;
            $scope.target.majors = null;
            $scope.target.years = null;
        }

        $scope.filterJobs = function() {
            if ($scope.filter.uni) {
                $scope.filter.uni_id = JSON.parse($scope.filter.uni)._id;
            }
            $scope.jobs = [];
            $scope.getAllJobs(1);
            jQuery(function() {
                jQuery('#filterModal').modal('toggle');
            });
        }

        $scope.changeFilterUni = function() {
            var uni = JSON.parse($scope.filter.uni);
            $scope.majors = uni.majors;
            $scope.years = uni.years;
        }

        $scope.clearTarget = function() {
            $scope.target = {};
            $scope.majors = [];
            $scope.years = [];
            $rootScope.error = null;
        }

        $scope.addTarget = function() {
            if (!$scope.target.uni || !$scope.target.majors || !$scope.target.years) {
                $rootScope.target_error = "Select a Uni and at least one major and a single year.";
            } else {
                var target = {};
                target.years = $scope.target.years;
                target.majors = $scope.target.majors;
                target.uni = JSON.parse($scope.target.uni)._id;
                $scope.newJob.targets.push(target);
                $rootScope.target_error = null;
                $scope.clearTarget();
                jQuery(function() {
                    jQuery('#targetModal').modal('toggle');
                });
            }
        }

        $scope.initJobsIndex = function() {
            $scope.jobs = [];
            $scope.page = 1;
            $scope.filter = {};

            $scope.switched = 0;
            $scope.fetchType = 0;
            $rootScope.getUnis();
            $scope.getAllJobs($scope.page);
        }

        $scope.ensureNonEmptyTargets = function() {
            if ($scope.newJob.targets.length == 0) {
                $rootScope.error = "Add at least one target.";
                $window.scrollTo(0, 0);
                return false;
            } else {
                $rootScope.error = null;
                return true;
            }
        }

        $scope.addJob = function() {
            if ($scope.ensureNonEmptyTargets()) {
                $rootScope.loadingDiv = true;
                var url = backendUrl + '/api/jobs/add';
                $http({
                        url: url,
                        method: "POST",
                        data: $scope.newJob
                    })
                    .then(function(response) {
                            $scope.printMsg(response);
                            $timeout(function() {
                                $window.location = '/#/jobs';
                            }, 2000);
                        },
                        function(response) {
                            $rootScope.handleErrors(response);
                        });
            }
        }

        $scope.nextPage = function() {
            if (!$scope.jobsEnded) {
                $scope.switched = 0;
                $scope.page++;
                $scope.getAllJobs($scope.page);
            }
        }

        $scope.getRecommended = function() {
            $scope.fetchType = 1;
            $scope.page = 1;
            $scope.switched = 1;
            $scope.jobs = [];
            $scope.filter = {};
            $scope.getAllJobs();
        }

        $scope.getAllJobs = function(page) {
            url = backendUrl;
            switch ($scope.fetchType) {
                case 0:
                    url += '/api/jobs/index/';
                    break;
                case 1:
                    url += '/api/jobs/recommended/';
                    break;
                case 2:
                    url += '/api/jobs/search/';
                    break;
            }
            $rootScope.loadingDiv = true;

            $http({
                method: 'GET',
                url: url,
                params: {
                    uni_id: $scope.filter.uni_id,
                    major: $scope.filter.major,
                    year: $scope.filter.year,
                    term: $scope.filter.term,
                    type: $scope.filter.type,
                    page: page
                }
            }).then(function successCallback(response) {
                $rootScope.loadingDiv = false;
                response.jobs = response.data.jobs;
                if ($scope.switched == 1) {
                    $scope.jobs = response.jobs;
                    $scope.switched = 0;
                } else {
                    $scope.jobs = $scope.jobs.concat(response.jobs);
                }
                $scope.total_jobs = $scope.jobs.length;
                if (response.jobs.length == 0) {
                    $scope.jobsEnded = true;
                } else {
                    $scope.jobsEnded = false;
                }
            }, function errorCallback(response) {
                $rootScope.handleErrors(response);
            });
        }

        $scope.searchJobs = function() {
            $scope.searchTerm = $scope.searchTerm.trim();
            if (!$scope.searchTerm) {
                $rootScope.error = "Empty search field.";
            } else {
                $scope.switched = 1;
                $scope.fetchType = 2;
                $scope.getAllJobs();

            }
        }
    }
]);