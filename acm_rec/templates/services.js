angular.module('community')
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

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: backendUrl + '/api/user/signin',
                    withCredentials: true,
                    data: JSON.stringify({ username: username, password: password })
                }).then(function mySuccess(response) {
                    console.log(response.data);
                    isLoggedIn();
                    if (response.data.token != null) {
                        AuthToken.setToken(response.data.token);
                        // console.log("token: "+response.data.token);
                        user = response.data.user;
                        deferred.resolve();
                    } else {
                        user = false;
                        deferred.reject();
                    }
                }, function myError(response) {
                    console.log("error: " + response);
                    deferred.reject();
                });
                /*$http.post(backendUrl+'/api/user/signin',
                  {username: username, password: password})
                  .success(function (data, status) {
                    isLoggedIn();
                    if(data.token!=null) {
                      AuthToken.setToken(data.token);
                      console.log("token: "+data.token);
                      user = data.user;
                      deferred.resolve();
                    } else {
                      user = false;
                      deferred.reject();
                    }
                  })
                  .error(function (data) {
                    user = false;
                    deferred.reject();
                  });
                */
                return deferred.promise;

            }

            function logout() {

                var deferred = $q.defer();

                $http.post(backendUrl + '/api/user/logout')
                    .success(function(data) {
                        isLoggedIn();
                        user = false;
                        console.log(data);
                        AuthToken.setToken();
                        deferred.resolve();
                    })
                    .error(function(data) {
                        user = false;
                        deferred.reject();
                    });

                return deferred.promise;

            }

            function register(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                $http.post(backendUrl + '/user/register', { username: username, password: password })
                    .success(function(data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    .error(function(data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

        }
    ])

.factory('AuthToken', function($window) {
    var authTokenFactroy = {};

    authTokenFactroy.setToken = function(token) {
        if (token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');
    }

    authTokenFactroy.getToken = function(token) {
        return $window.localStorage.getItem('token', token);
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