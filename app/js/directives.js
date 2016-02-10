(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {
        /* Directives */
        angular.module('base.directives', ['base.services'])

        .directive('appVersion', ['version',
            function(version) {
                return function(scope, elm, attrs) {
                    elm.text(version);
                };
            }
        ])

        .directive('navbarTop', function() {
            return {
                restrict: 'EA',
                controller: 'navbarTopCtrl',
                templateUrl: 'app/secured/sections/modules/views/navbar-top.html'
            };
        })

        .directive('footer', function() {
            return {
                restrict: 'EA',
                controller: 'footerCtrl',
                templateUrl: 'app/secured/sections/modules/views/footer.html'
            };
        })

        .directive('sidebarLeft', function() {
            return {
                restrict: 'EA',
                scope: false,
                controller: 'sidebarCtrl',
                templateUrl: 'app/secured/sections/modules/views/sidebar-left.html',
            };
        })

        .directive('messageModal', function() {
            return {
                restrict: 'EA',
                templateUrl: 'app/secured/sections/modules/views/message-modal.html',
                scope: {
                    modalTitle: '@',
                    modalMessage: '@',
                    modalActions: '='
                },
                replace: true,
                link: function(scope, elem, attrs) {
                    scope.modalBody = attrs.modalBody;
                    scope.modalTitle = attrs.modalTitle;
                    scope.theActions = attrs.theActions;
                }
            };
        })

        .directive('formContentCommon', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/secured/sections/global/views/form-content-i18n.html',
                scope: {
                    content: '=content',
                    language: '='
                },
                link: function($scope, element, attrs) {
                    $scope.directiveLang = attrs.language;
                    $scope.$watch('$parent.management.content.influencer.id', function() {
                        /* desabilitado hasta nueva orden
                         if ($scope.$parent.management.content.influencer.id === 'timeout' || $scope.$parent.management.content.influencer.id === 'restalo')
                         $scope.directiveDisabled = true;
                         */
                        $scope.directiveDisabled = false;
                    });
                }
            };
        })

        .directive('formSynopsisCommon', function() {
            return {
                restrict: 'EA',
                templateUrl: 'app/secured/sections/global/views/form-synopsis-i18n.html',
                scope: {
                    synopsis: '=content'
                },
                link: function($scope, element, attrs) {}
            };
        })

        .directive('multilingualName', function() {
            return {
                restrict: 'EA',
                templateUrl: 'app/secured/sections/global/views/multilingual-name.html',
                scope: {
                    content: '=content',
                    language: '='
                },
                link: function($scope, element, attrs) {
                    $scope.directiveLang = attrs.language;
                }
            };
        });
    });
})();
