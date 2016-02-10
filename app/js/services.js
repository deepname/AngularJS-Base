(function() {

    'use strict';

    define(['angular'], function(angular) {

        /* Services */

        angular.module('base.services', [])

        .value('version', '0.20.0')

        .service('httpInterceptorXAuth', function($q, $rootScope, $location) {
            return {
                'request': function(req) {
                    if ($rootScope.loginData) {
                        req.headers['X-Auth-Token'] = $rootScope.loginData.token;
                    } else {
                        if ($location.path() != '/signup') {
                            $location.path('/login');
                            $location.replace();
                        }
                    }
                    return req || $q.when(req);
                }
            };
        })

        .service('userUnauthorizedInterceptor', function($q, $rootScope, webStorage, $location) {
            return {
                'response': function(response) {
                    // do something on success
                    return response || $q.when(response);
                },

                'responseError': function(response) {
                    // do something on error
                    var status = response.status;
                    if (status === 404 || status === 500 || status === 503) {
                        var errMsg;
                        switch (status) {
                            case 404:
                                errMsg = 'The requested URL was not found.';
                                break;
                            case 500:
                                errMsg = 'Sorry, there was an error. Please try again.';
                                break;
                            case 503:
                                errMsg = 'Service temporarily unavailable.';
                                break;
                        }
                        alert(response.status + ': ' + errMsg);
                        return;
                    }
                    if (status === 401 || status === 403) {
                        var currentPath = window.location.href;
                        if (currentPath.indexOf('login') > -1 || currentPath.indexOf('signup') > 1) {
                            //do nothing, wrong username or pass
                            console.log('do nothing');
                        } else {
                            alert('Session has expired');
                            webStorage.local.add('isSessionExpired', true);
                            $location.path('/login');
                            $location.replace();
                            return;
                        }
                    }
                    // otherwise
                    return $q.reject(response);
                }
            };
        })

        .service('translationService', function($resource) {
            this.getTranslation = function($rootScope, language, onErrorLoadLanguage) {
                var langFilePath = 'app/resources/translation/translation_' + language + '.json';
                $resource(langFilePath).get(
                    function(data) {
                        $rootScope.translation = data;
                    },
                    function(err) {
                        onErrorLoadLanguage();
                    }
                );
            };
        });
    });
})();
