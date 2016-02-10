define([], function() {
	return ['$scope', '$rootScope', '$location',
		function($scope, $rootScope, $location) {

			$scope.cops = 1;
			$scope.image = 'http://upload.wikimedia.org/wikipedia/commons/f/f6/HAL9000.svg';

			$scope.activeSpecialMode = function() {
				switch ($scope.cops) {
					case 5:
						$rootScope.isSpecialMode = 'hacker';
						break;
				}
				$scope.cops++;
			};

			$rootScope.isLoading = false;

			$scope.$apply();
		}
	];
});