(function() {

    'use strict';

    define(['angular', 'app'], function(angular, app) {

        return app.config(['$routeProvider', '$locationProvider',

            function($routeProvider, $locationProvider, $rootScope) {
                //$locationProvider.html5Mode(true);

                /*$locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });*/

                var secured = 'app/secured/sections/';

                //-- LOGIN --//
                $routeProvider.when('/login', {
                    templateUrl: 'app/sections/login/views/login.html',
                    controller: 'loginCtrl'
                });

                //-- ABOUT --//
                $routeProvider.when('/about', {
                    templateUrl: secured + 'about/views/about.html',
                    controller: 'aboutCtrl'
                });

                //-- USERS --//
                //-- backoffice --//
                $routeProvider.when('/userBack/list', {
                    templateUrl: secured + 'user/views/userList.html',
                    controller: 'userListCtrl'
                });
                $routeProvider.when('/userBack/create', {
                    templateUrl: secured + 'user/views/userEdit.html',
                    controller: 'userEditCtrl'
                });
                $routeProvider.when('/userBack/edit/:id', {
                    templateUrl: secured + 'user/views/userEdit.html',
                    controller: 'userEditCtrl'
                });
                //-- app --//
                $routeProvider.when('/userApp/list', {
                    templateUrl: secured + 'user/views/userList.html',
                    controller: 'userListCtrl'
                });
                $routeProvider.when('/userApp/create', {
                    templateUrl: secured + 'user/views/userEdit.html',
                    controller: 'userEditCtrl'
                });
                $routeProvider.when('/userApp/edit/:id', {
                    templateUrl: secured + 'user/views/userEdit.html',
                    controller: 'userEditCtrl'
                });
                //-- pro --//
                $routeProvider.when('/userPro/list', {
                    templateUrl: secured + 'user/views/userList.html',
                    controller: 'userListCtrl'
                });
                $routeProvider.when('/userPro/create', {
                    templateUrl: secured + 'user/views/userEdit.html',
                    controller: 'userEditCtrl'
                });
                $routeProvider.when('/userPro/edit/:id', {
                    templateUrl: secured + 'user/views/userEdit.html',
                    controller: 'userEditCtrl'
                });

                //-- DEFAULT --//
                $routeProvider.otherwise({
                    redirectTo: '/about'
                });

            }
        ]);

    });
})();
