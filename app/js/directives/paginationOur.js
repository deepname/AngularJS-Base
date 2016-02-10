(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {

        angular.module('base.directives.paginationOur', [])
            .directive('paginationOur', ['config', '$http', function(config, $http) {

                return {
                    restrict: 'E',
                    transclude: true,
                    templateUrl: 'app/secured/sections/global/views/paginationOur.html',
                    link: function($scope, el, attrs, ctrl) {
                        $scope.Math = window.Math;
                        $scope.range = function() {
                            var ret = [];
                            for (var i = 0; i < $scope.pageCount(); i++) {
                                if (i + 2 >= $scope.currentPage && i - 2 <= $scope.currentPage)
                                    ret.push(i);
                            }
                            return ret;
                        };

                        $scope.firstPage = function() {
                            $scope.currentPage = 0;
                        };

                        $scope.lastPage = function() {
                            $scope.currentPage = $scope.pageCount() - 1;
                        };

                        $scope.prevPage = function() {
                            if ($scope.currentPage > 0)
                                $scope.currentPage--;
                        };

                        $scope.prevPageDisabled = function() {
                            return $scope.currentPage === 0 ? "disabled" : "";
                        };

                        $scope.nextPage = function() {
                            if ($scope.currentPage < $scope.pageCount() - 1)
                                $scope.currentPage++;
                        };

                        $scope.nextPageDisabled = function() {
                            return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
                        };

                        $scope.pageCount = function() {
                            if (!angular.isUndefined($scope.page)) {
                                return Math.ceil($scope.page.totalSize / $scope.itemsPerPage);
                            }
                            return 0;
                        };

                        $scope.setPage = function(n) {
                            if (n >= 0 && n < $scope.pageCount()) {
                                $scope.currentPage = n;
                            }
                        };

                        $scope.optionsItemsPerPage = [{
                            value: 10
                        }, {
                            value: 20
                        }, {
                            value: 30
                        }, {
                            value: 40
                        }, {
                            value: 50
                        }, {
                            value: 100
                        }];
                    }
                };

            }]);

    });
})();
