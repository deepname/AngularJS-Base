define([], function() {
    return ['$scope',
        function($scope) {
            $scope.getYearDate = new Date().getFullYear();
            $scope.$apply();
        }
    ];
});
