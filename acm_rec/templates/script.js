var backendUrl = "https://localhost:6003";
backendUrl = "";

angular.module('clubs', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/clubs', {
            templateUrl: '/views/clubs/allClubs.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/viewprofile/:id', {
            templateUrl: '/views/clubs/clubprofile.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/allmembers/:id', {
            templateUrl: '/views/clubs/viewAllMembers.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/members/:id/:subId', {
            templateUrl: '/views/clubs/editMembers.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/members/:id', {
            templateUrl: '/views/clubs/editMembers.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/edit/:id', {
            templateUrl: '/views/clubs/editStructure.html',
            controller: 'ClubsController',
            access: { restricted: true }
        })
        .when('/club/addEvent', {
            templateUrl: '/views/clubs/addEvent.html',
            controller: 'ClubsController',
            access: { restricted: true }
        })
        .when('/club/settings/form/', {
            templateUrl: '/views/clubs/form.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/form/apply/:id', {
            templateUrl: '/views/clubs/formApply.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })
        .when('/club/applicants/:filter', {
            templateUrl: '/views/clubs/applicants.html',
            controller: 'ClubsController',
            access: { restricted: false }
        })

}]);

angular.module('users', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/signin', {
            templateUrl: '/views/general/sign_in.html',
            controller: 'mainController',
            access: { restricted: false }
        })
        .when('/signup', {
            templateUrl: '/views/general/sign_up.html',
            controller: 'mainController',
            access: { restricted: false }
        })
        .when('/search/:searchterm', {
            templateUrl: '/views/general/search.html',
            controller: 'mainController',
            access: { restricted: false }
        })
        .when('/student/viewprofile/:id', {
            templateUrl: '/views/users/normalprofile.html',
            controller: 'userController',
            access: { restricted: false }
        })
        .when('/student/editprofile/:id', {
            templateUrl: '/views/users/profile.html',
            controller: 'userController',
            access: { restricted: true }
        })
}]);

angular.module('companies', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/company/viewprofile/:id', {
            templateUrl: '/views/companies/profile.html',
            controller: 'companiesController',
            access: { restricted: false }
        })
        .when('/company/editprofile/:id', {
            templateUrl: '/views/companies/updateProfile.html',
            controller: 'companiesController',
            access: { restricted: false }
        })
        .when('/company/addBranch/', {
            templateUrl: '/views/companies/addBranch.html',
            controller: 'companiesController',
            access: { restricted: true }
        })
        .when('/company/getCodes/:id', {
            templateUrl: '/views/companies/showCodes.html',
            controller: 'companiesController',
            access: { restricted: true }
        })
        .when('/company/getAnalytics/:id', {
            templateUrl: '/views/companies/analytics.html',
            controller: 'companiesController',
            access: { restricted: true }
        })
}]);

angular.module('offers', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/offers/addOffer/:id', {
            templateUrl: '/views/offers/addOffer.html',
            controller: 'OffersController',
            access: { restricted: true }
        })
        .when('/offers/', {
            templateUrl: '/views/offers/offersIndex.html',
            controller: 'OffersController',
            access: { restricted: true }
        })
        .when('/qr', {
            templateUrl: '/views/general/qr.html',
            controller: 'QRController',
            access: { restricted: false }
        });
}]);

angular.module('admin', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/admin/viewprofile/:id', {
            templateUrl: '/views/admin/dashboard.html',
            controller: 'AdminController',
            access: { restricted: true }
        })
        .when('/admin/jobs/add', {
            templateUrl: '/views/admin/add_job.html',
            controller: 'AdminController',
            access: { restricted: true }
        })
        .when('/admin/viewCompanies', {
            templateUrl: '/views/admin/companies.html',
            controller: 'AdminController',
            access: { restricted: true }
        });
}]);

angular.module('events', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/events', {
            templateUrl: '/views/events/home.html',
            controller: 'eventsController',
            access: { restricted: true }
        })
}]);

angular.module('jobs', [], ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/jobs/add/:company_id', {
            templateUrl: '/views/jobs/add.html',
            controller: 'JobsController',
            access: { restricted: true }
        })
        .when('/jobs/', {
            templateUrl: '/views/jobs/index.html',
            controller: 'JobsController',
            access: { restricted: true }
        })
        .when('/jobs/recommended', {
            templateUrl: '/views/jobs/index.html',
            controller: 'JobsController',
            access: { restricted: true }
        })
}]);

// var app = angular.module('community', ['ngRoute', 'ja.qr', 'webcam',
//     'bcQrReader', 'ngFileUpload', 'clubs', 'users', 'companies', 'offers', 'events', 'admin'
// ]);

var app = angular.module('community', ['ngRoute', 'ja.qr', 'webcam',
    'bcQrReader', 'ngFileUpload', 'users', 'companies', 'offers', 'admin', 'jobs'
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/offers/offersIndex.html',
            controller: 'OffersController',
            access: { restricted: true }
        })

    $httpProvider.interceptors.push('AuthInterceptors');

    // to remove # from url, useless backend urls!
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

}]);


app.run(function($rootScope, $location, $route, $window, AuthService) {
    $rootScope.$watch(AuthService.isLoggedIn(), function() {
        AuthService.getUser().then(function(currentUser) {
            $rootScope.currentUser = currentUser;
            if (currentUser != null)
                $rootScope.userStatus = true;
            else
                $rootScope.userStatus = false;

        });
    });

    $rootScope.$on('$routeChangeStart',
        function(event, next, current) {
            $rootScope.updateWidth();
            $rootScope.error = null;
            $rootScope.msg = null;
            $rootScope.backgroundDiv = false;
            AuthService.getUserStatus()
                .then(function() {
                    if (next && next.access && next.access.restricted && !AuthService.isLoggedIn()) {
                        $window.location.assign('/#/signin');
                    }
                });
        });

    $rootScope.$on('$viewContentLoaded', function() {
        // $rootScope.updateWidth();
        $rootScope.updateDateInputs();
        //Here your view content is fully loaded !!
    });
});

app.directive('exit', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 27) {
                console.log("exit key");
                // scope.$apply(function (){
                //     scope.$eval(attrs.myEnter);
                // });

                event.preventDefault();
            }
        });
    };
});