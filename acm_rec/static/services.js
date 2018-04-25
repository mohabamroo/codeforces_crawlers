angular.module('bachelor')
    .factory('AuthService', ['$q', '$timeout', '$http', '$rootScope', 'AuthToken',
        function($q, $timeout, $http, $rootScope, AuthToken) {
            var user = null;

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register,
                getUser: getUser
            });

            function isLoggedIn() {
                if (AuthToken.getToken()) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return $http.get(backendUrl + '/api/user/getStatus')
                    .success(function(data) {
                        if (data.status == true) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .error(function(data) {
                        return false;
                    });
            }

            function getUser() {
                var deferred = $q.defer();
                if (AuthToken.getToken()) {
                    $http.post(backendUrl + '/api/user/currentUser').success(function(data) {
                        deferred.resolve(data.user);
                    }).error(function(data) {
                        $q.reject({ msg: "User has no token." });
                    });
                } else {
                    $q.reject({ msg: "User has no token." });
                }
                return deferred.promise;
            }

            function login(user_credentials) {
                var url = backendUrl + '/api/auth/token/obtain/';
                // create a new instance of deferred
                var deferred = $q.defer();
                $http({
                        url: url,
                        method: "post",
                        withCredentials: true,
                        data: user_credentials
                    })
                    .then(function(response) {
                        AuthToken.setToken(response.data.access);
                        AuthToken.setRefreshToken(response.data.refresh);
                        deferred.resolve();
                    }, function(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function logout() {

                var deferred = $q.defer();

                AuthToken.setToken();
                isLoggedIn();
                deferred.resolve();


                return deferred.promise;

            }

            function register(user_data) {

                var url = backendUrl + '/api/users/register/';
                // create a new instance of deferred
                var deferred = $q.defer();
                $http({
                        url: url,
                        method: "post",
                        data: user_data
                    })
                    .then(function(response) {
                        deferred.resolve();
                    }, function(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;

            }

        }
    ])

.factory('AuthToken', function($window) {
    var authTokenFactroy = {};

    authTokenFactroy.setToken = function(token) {
        if (token)
            $window.localStorage.setItem('access_token', token);
        else
            $window.localStorage.removeItem('access_token');
    }

    authTokenFactroy.setRefreshToken = function(token) {
        if (token)
            $window.localStorage.setItem('refresh_token', token);
        else
            $window.localStorage.removeItem('refresh_token');
    }

    authTokenFactroy.getToken = function(token) {
        return $window.localStorage.getItem('access_token', token);
    }

    authTokenFactroy.getRefreshToken = function(token) {
        return $window.localStorage.getItem('refresh_token', token);
    }
    return authTokenFactroy;
})

// attaching the user token with each request
.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory = {};
    authInterceptorsFactory.request = function(config) {
        var token = AuthToken.getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    }

    return authInterceptorsFactory;
})

.service('multipartForm', ['$http', '$window', '$rootScope', function($http, $window, $rootScope) {
    this.post = function(uploadUrl, data) {
        var fd = new FormData();
        for (var key in data) {
            console.log(key + " => " + data[key]);
            fd.append(key, data[key]);
        }
        $http.post(uploadUrl, fd, {
                transformRequest: angular.indentity,
                headers: { 'Content-Type': undefined }
            }).success(function(response) {
                console.log(response)
                $rootScope.msg = response.msg;
                setTimeout(function() {
                    $window.location.reload();
                }, 1000);

            })
            .error(function(response) {
                $rootScope.error = "";
                response.errors.forEach(function(errror) {
                    $rootScope.error += error.msg;
                });
            });
    }
}]);