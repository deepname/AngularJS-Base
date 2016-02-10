(function() {

    'use strict';

    define([
        'angular',
        'filters',
        'services',
        'directives',
        'controllers',
        '../sections/login/services/authService',
        '../secured/sections/user/services/userService',
        'directives/contentSearch',
        'directives/filterList',
        'directives/uiSortable',
        'directives/genericListView',
        'directives/genericListFilter',
        'directives/paginationOur'

    ], function(angular, filters, services, directives, controllers, bootbox) {
        // Declare app level module which depends on filters, and services
        var app = angular.module(
            'base', [
                'ngRoute',
                'ngAnimate',
                'angular.filter',
                'ui.bootstrap',
                'ngAutocomplete',
                'base.services',
                'base.filters',
                'base.directives',
                'base.controllers',
                'base.directives.contentSearch',
                'base.directives.filterList',
                'base.directives.genericListFilter',
                'base.directives.genericListView',
                'base.directives.paginationOur',
                'base.directives.uiSortable',
                'base.services.authService',
                'base.services.userService'
            ]);

        /*
         * Application configuration
         */
        app.config(function($compileProvider, $httpProvider, googleClientProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
        });


        //Config needed for ui sortable directive (feature order drag-n-drop)
        app.value('uiSortableConfig', {});


        /*
         * Application init
         */
        app.run(['$rootScope', 'webStorage', '$location', 'authService', '$window', '$http', '$timeout',
            function($rootScope, webStorage, $location, authService, $window, $http, $timeout) {

                $rootScope.errorMessage = '--';
                $rootScope.successMessage = '--';
                $rootScope.show_loadPage = false;

                $rootScope.sideBarBig = true;

                var checkAuth = function(path) {

                    if (path == '/login') {
                        delete $rootScope.authData;
                        $window.localStorage.removeItem('loginData');
                    }

                    //Check auth
                    var authData = JSON.parse($window.localStorage.getItem('loginData'));
                    if (authData) {
                        $rootScope.authToken = authData.token;
                        $rootScope.authData = authData;
                        $rootScope.lastTPage = [];
                        $http.defaults.headers.common['X-Auth-Token'] = authData.token;

                        authService.checkToken(authData.token).then(function(tokenValid) {
                            if (tokenValid) {
                                //$location.path(path);
                            } else {
                                $location.path("/login");
                                delete $rootScope.authData;
                                $window.localStorage.removeItem('loginData');
                            }
                        });


                    } else {
                        delete $rootScope.authData;
                        $window.localStorage.removeItem('loginData');
                        $location.path("/login");
                    }
                };
                checkAuth($location.path());


                //Save current page for lists
                $rootScope.lasTPage = {};
                $rootScope.savePage = function(page, num, notAuto) {
                    if (notAuto === true) {
                        $rootScope.lasTPage[page] = num;
                    }
                };

                //Get last page for lists
                $rootScope.getPage = function(page) {
                    return $rootScope.lasTPage[page] ? $rootScope.lasTPage[page] : 0;
                };

                //Save search filters
                $rootScope.savedFilters = {};
                $rootScope.saveFilters = function(section, filters) {
                    $rootScope.savedFilters[section] = angular.copy(filters);
                };

                //Get search filters
                $rootScope.getFilters = function(section) {
                    return $rootScope.savedFilters[section] ? $rootScope.savedFilters[section] : {};
                };


                //Actions when starting location change
                $rootScope.$on('$locationChangeStart', function() {
                    checkAuth($location.path());
                    $rootScope.isLoading = true;
                });


                //Check if secured section
                $rootScope.securedSection = function() {
                    return $location.path() != '/login';
                };

                //check user roles
                $rootScope.checkHasRole = function(requiredRoles, onModal) {
                    if ($rootScope.authData) {
                        onModal = typeof onModal !== 'undefined' ? onModal : true;
                        var userRoles = $rootScope.authData.roles;
                        var matches = _.intersection(userRoles, requiredRoles);
                        if (matches.length) {
                            //USER HAS AT LEAST ONE OF THE REQUIRED PERMISSIONS
                            return true;
                        } else {
                            //USER DOES NOT HAVE ANY OF THE REQUIRED PERMISSIONS
                            if (onModal) {
                                /*
                                 $rootScope.toggleMessageModal('Atención!', 'No tienes permisos para realizar esta acción', [{
                                 text: 'Entendido',
                                 callback: null
                                 }]);
                                 */
                            }
                            return false;
                        }
                    }
                };

                //Show success/error messages, loading...
                $rootScope.updateScope = function(variable, value) {
                    $rootScope[variable] = value;
                };

                //Message/confirm modal
                $rootScope.messageModalShown1 = false;
                $rootScope.messageModalShown2 = false;

                $rootScope.toggleMessageModal = function(title, message, actions) {
                    //data
                    $rootScope.modalTitle = title;
                    $rootScope.modalMessage = message;
                    $rootScope.modalActions = actions;
                    //toggle
                    $rootScope.messageModalShown1 = !$rootScope.messageModalShown1;
                    $timeout(function() {
                        $rootScope.messageModalShown2 = !$rootScope.messageModalShown2;
                    }, 100);
                };

                //close modal
                $rootScope.closeMessageModal = function() {
                    $rootScope.messageModalShown = false;
                    $timeout(function() {
                        $rootScope.messageModalShown2 = !$rootScope.messageModalShown2;
                        $timeout(function() {
                            $rootScope.messageModalShown1 = !$rootScope.messageModalShown1;
                            $rootScope.modalTitle = null;
                            $rootScope.modalMessage = null;
                            $rootScope.modalActions = null;
                        }, 100);
                    }, 300);
                };
            }
        ]);

        return app;
    });
})();
