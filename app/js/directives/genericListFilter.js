(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {

        angular.module('base.directives.genericListFilter', [])
            .directive('genericListFilter', ['config', '$http', function(config, $http) {

                return {
                    restrict: 'E',
                    transclude: true,
                    templateUrl: function(elem, attrs) {
                        return 'app/secured/sections/global/views/' + attrs.template + '.html';
                    },
                    //                scope: {
                    //                  imodel: '=imodel'
                    //              },
                    link: function($scope, element, attrs, controller) {

                        var scope_var = attrs.imodel;

                        $scope.$watch(scope_var, function(newValue, oldValue) {
                            if (newValue) {

                                $scope.form_params = {
                                    'action': attrs.action,
                                    'method': attrs.method
                                };
                                $scope.content_params = newValue;
                                $scope.show_form = false;

                                // mirar si se deben cargar datos dinamicos
                                $scope.content_params.forEach(function(e) {
                                    if (e['url'] !== null) {
                                        $http({
                                            method: "GET",
                                            url: e.url
                                        }).then(function(response) {
                                            if (!angular.isUndefined(response.data)) {
                                                e.options = [];
                                                response.data.forEach(function(d) {
                                                    //                                              e.options.push({
                                                    //                                                    'value': d[e.valueField],
                                                    //                                                    'title': d[e.titleField]
                                                    //                                                });
                                                    name = d["name"];
                                                    if (d["name"]["es"]) {
                                                        name = d["name"]["es"];
                                                    }
                                                    e.options.push({
                                                        'value': d["id"],
                                                        'title': (name == 'WeGoBcn' ? '_' : '') + name
                                                    });

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
