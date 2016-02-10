(function() {

    'use strict';

    define(['angular', 'services'], function(angular) {

        /* Controllers */

        return angular.module('base.controllers', ['base.services'])
            /* Sample controller where service is being used
             .controller('MyCtrl1', ['$scope', 'version',
             function($scope, version) {
             $scope.scopedAppVersion = version;
             }
             ])*/

        // More involved example where controller is required from an external file

        //--- LOGIN ---//
        .controller('loginCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector, $rootScope) {
                $rootScope.sassFile = 'login';
                require(['../sections/login/controllers/loginCtrl'], function(loginCtrl) {
                    $injector.invoke(loginCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ])

        //--- NAVBAR TOP ---//
        .controller('navbarTopCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector) {
                require(['../secured/sections/modules/controllers/navbarTopCtrl'], function(navbarTopCtrl) {
                    $injector.invoke(navbarTopCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ])

        //--- SIDEBAR ---//
        .controller('sidebarCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector) {
                require(['../secured/sections/modules/controllers/sidebarCtrl'], function(sidebarCtrl) {
                    $injector.invoke(sidebarCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ])

        //--- FOOTER ---//
        .controller('footerCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector) {
                require(['../secured/sections/modules/controllers/footerCtrl'], function(footerCtrl) {
                    $injector.invoke(footerCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ])

        //--- ABOUT ---//
        .controller('aboutCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector, $rootScope) {
                $rootScope.sassFile = 'about';
                require(['../secured/sections/about/controllers/aboutCtrl'], function(aboutCtrl) {
                    $injector.invoke(aboutCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ])

        //--- USER ---//
        .controller('userListCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector, $rootScope) {
                $rootScope.sassFile = 'userList';
                require(['../secured/sections/user/controllers/userListCtrl'], function(userListCtrl) {
                    $injector.invoke(userListCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ])

        .controller('userEditCtrl', ['$scope', '$injector', '$rootScope',
            function($scope, $injector, $rootScope) {
                $rootScope.sassFile = 'userEdit';
                require(['../secured/sections/user/controllers/userEditCtrl'], function(userEditCtrl) {
                    $injector.invoke(userEditCtrl, this, {
                        '$scope': $scope
                    });
                });
            }
        ]);
    });

})();
