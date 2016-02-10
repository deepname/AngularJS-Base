(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {

        angular.module('base.directives.genericListView', [])
            .directive('genericListView', ['config', '$http', function(config, $http) {

                return {
                    restrict: 'E',
                    transclude: true,
                    templateUrl: function(elem, attrs) {
                        console.log('generic list');
                        return 'app/secured/sections/generic_list/views/' + attrs.template + '.html';
                    },
                    link: function($scope, element, attrs, controller) {}
                };

            }]);

    });
})();
