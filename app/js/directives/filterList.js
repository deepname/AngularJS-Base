(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {

        angular.module('base.directives.filterList', [])
            .directive('filterList', ['config', '$http', function(config, $http) {

                return {
                    restrict: 'EA',
                    transclude: true,
                    templateUrl: function(elem, attrs) {
                        return '/app/secured/sections/global/views/' + attrs.template + '.html';
                    },
                    link: function($scope, element, attrs, controller) {

                        var attr_param = JSON.parse(attrs.imodel);
                        var urlBase = config.urlServicesBase;

                        $scope.form_params = {
                            'action': attrs.action,
                            'method': attrs.method
                        };
                        $scope.content_params = attr_param;
                        $scope.show_form = false;

                        // mirar si se deben cargar datos dinamicos
                        $scope.content_params.forEach(function(e) {
                            if (e.hasOwnProperty('url')) {
                                $http({
                                    method: "GET",
                                    url: urlBase + e.url
                                }).then(function(response) {
                                    if (!angular.isUndefined(response.data)) {
                                        e.options = [];
                                        response.data.forEach(function(d) {
                                            if (angular.isUndefined(e.i18n)) {
                                                e.options.push({
                                                    'value': d[e.valueField],
                                                    'title': (d[e.titleField] == 'WeGoBcn' ? '_' : '') + d[e.titleField]
                                                });
                                            } else {
                                                e.options.push({
                                                    'value': d[e.valueField],
                                                    'title': (d[e.titleField][e.i18n] == 'WeGoBcn' ? '_' : '') + d[e.titleField][e.i18n]
                                                });
                                            }

                                        });
                                    }
                                });
                            }
                        });

                        $scope.generateJSON = function() {
                            $scope.generated_JSON = {};
                            $scope.content_params.forEach(function(e) {
                                if (e.value) {
                                    $scope.generated_JSON[e.name] = e.value;
                                }
                            });
                            $scope.filters = $scope.generated_JSON;
                        };

                        $scope.cleanJSON = function() {
                            $scope.content_params.forEach(function(e) {
                                if (e.value) {
                                    e.value = null;
                                }
                            });
                            $scope.filters = {
                                '^': '^'
                            };
                        };

                        $scope.introEvent = function(keyEvent) {
                            if (keyEvent.which === 13) {
                                event.preventDefault();
                                $scope.generateJSON();
                            }
                        };

                        $scope.toggleForm = function() {
                            $scope.show_form = !$scope.show_form;
                        };
                        // recuperar valores si el scope del controller los mantiene
                        if (!angular.isUndefined($scope.filters)) {
                            $scope.content_params.forEach(function(e) {
                                if ($scope.filters.hasOwnProperty([e.name])) {
                                    e.value = $scope.filters[e.name];
                                    $scope.show_form = true;
                                }
                            });
                        }
                    }
                };

            }]);

    });
})();
