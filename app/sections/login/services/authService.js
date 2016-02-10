(function() {
    'use strict';

    define(['angular'], function(angular) {
        angular.module('wegoBackoffice.services.authService', ['ngCookies'])
            .service('authService', function($http, $rootScope, $cookieStore, $window, config) {

                //var serviceBase = config.urlServicesBase + 'security/authn',
                var serviceBase = config.urlSecurityService + '/authn/',
                    factory = {
                        loginPath: '/login',
                        user: {
                            isAuthenticated: false,
                            roles: null
                        }
                    };


                factory.login = function(username, password, rememberMe) {
                    return $http.post(serviceBase + 'backoffice/login', {
                        username: username,
                        password: password
                    }).then(
                        function(result) {
                            $rootScope.authData = result.data;

                            $window.localStorage.setItem('loginData', JSON.stringify(result.data));

                            //Cookie if rememberMe is enabled
                            if (rememberMe) {
                                $cookieStore.put('authData', result.data);
                            }

                            changeAuth(true);
                            return result.data;
                        },
                        function(error) {

                            changeAuth(false);
                        });
                };


                factory.checkToken = function(token) {
                    return $http.get(serviceBase + 'check/' + token).then(
                        function(result) {
                            return JSON.parse(result.data);
                        },
                        function(error) {
                            return false;
                        });
                };

                factory.hasRole = function(role) {
                    if ($rootScope.authData === undefined || $rootScope.authData.roles === undefined) {
                        return false;
                    }
                    return ($rootScope.authData.roles.indexOf(role) >= 0);
                };


                factory.logout = function() {
                    changeAuth(false);
                    delete $rootScope.authData;
                    delete $rootScope.authToken;
                    $window.localStorage.removeItem('loginData');
                };

                factory.redirectToLogin = function() {
                    $rootScope.$broadcast('redirectToLogin', null);
                };

                function changeAuth(loggedIn) {
                    factory.user.isAuthenticated = loggedIn;
                    $rootScope.$broadcast('loginStatusChanged', loggedIn);
                }


                factory.rememberPassword = function(mail, onSuccess, onError) {
                    var url = serviceBase + 'rememberPassword';
                    $http({
                            method: 'POST',
                            url: url,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            transformRequest: function(obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: {
                                email: mail
                            }
                        })
                        .success(function(res) {
                            onSuccess(res);
                        })
                        .error(function(err) {
                            onError(err);
                        });
                };


                return factory;
            });
    });
}());
