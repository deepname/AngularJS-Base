(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {

        /* Filters */

        angular.module('base.filters', ['base.services'])
            .filter('interpolate', ['version',
                function(version) {
                    return function(text) {
                        return String(text).replace(/\%VERSION\%/mg, version);
                    };
                }
            ]).filter('yesNo', function() {
                return function(input) {
                    return input ? 'fa fa-check' : 'fa fa-close';
                };
            }).filter('range', function() {
                /* 
                example to use:
                ng-repeat="d in [] | range:6"
                */
                return function(input, total) {
                    total = parseInt(total);

                    for (var i = 0; i < total; i++) {
                        input.push(i);
                    }
                    return input;
                };
            });
    });
})();
