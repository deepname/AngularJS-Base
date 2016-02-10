define([], function() {
	return ['$scope', '$rootScope', '$route', '$timeout', '$filter', '$location', 'config', 'userService',
		function($scope, $rootScope, $route, $timeout, $filter, $location, config, userService){


			var userType = '';
			$scope.url = $route.current.$$route.originalPath.split('/')[1];
			switch ($scope.url) {
				case 'userBack':
					userType = 'BACKOFFICE';
					$scope.userType = 'Backoffice';
					break;
				case 'userApp':
					userType = 'WEGO_APP';
					$scope.userType = 'App';
					break;
				case 'userPro':
					userType = 'COMMERCIAL';
					$scope.userType = 'Commercial';
					break;
			}

			var requiredRoles = [config.roles.admin];

			if (angular.isUndefined($rootScope.referrer) ||
				$rootScope.referrer === null ||
				$rootScope.referrer.indexOf('user') < 0 ||
				angular.isUndefined($rootScope.filtersListContent) ||
				$rootScope.filtersListContent === null) {
				$rootScope.filtersListContent = {};
			}
			$scope.filters = $rootScope.filtersListContent || {};

			$scope.list = function(page, userType) {
				userService.list(page, $rootScope.filtersListContent, $scope.itemsPerPage, userType).then(
					function(data) {
						$rootScope.isLoading = false;
						$scope.page = data;
					},
					function(errorMessage) {
						$rootScope.isLoading = false;
						console.error(errorMessage);
					}
				);
			};

			if (angular.isUndefined($scope.currentPage))
				$scope.currentPage = $scope.getPage('users');

			$scope.itemsPerPage = 10;
			$scope.page = {};

			$scope.$watch("filters", function(newValue, oldValue) {
				if (Object.keys(newValue).length) {
					$scope.currentPage = 0;
					$rootScope.filtersListContent = newValue;
					$scope.list($scope.currentPage, userType);
				}
			});

			$scope.$watch("currentPage", function(newValue, oldValue) {
				if (newValue > 0) {
					$scope.savePage('users', newValue);
				}
				$scope.list(newValue, userType);
			});

			$scope.delete = function(id, msg) {
				if ($rootScope.checkHasRole(requiredRoles)) {
					if (confirm(msg)) {
						$rootScope.isLoading = true;
						userService.delete(id).then(
							function(data) {
								$rootScope.isLoading = false;
								if ($scope.page.totalSize - parseInt($scope.page.totalSize / 10) * 10 == 1)
									$scope.currentPage--;
								setTimeout(function() {
									$scope.list($scope.currentPage, userType);
									$scope.updateScope('show_loadPage', 'false');
								}, 1000);
							},
							function(errorMessage) {
								$rootScope.isLoading = false;
								console.error(errorMessage);
							}
						);
					}
				}
			};

			$scope.createElement = function(url) {
				if ($rootScope.checkHasRole(requiredRoles)) {
					$location.path('/' + url + '/create');
				}
			};

			$scope.editElement = function(id, url) {
				$location.path('/' + url + '/edit/' + id);
			};

			$scope.exportCSV = function() {
				$rootScope.isLoading = true;
				userService.exportCSV('-1', $rootScope.filtersListContent, $scope.itemsPerPage).then(
					function(data) {
						var dateToday = $rootScope.getfullDate();
						var hiddenElement = document.createElement('a');
						hiddenElement.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(data);
						hiddenElement.target = '_blank';
						hiddenElement.download = 'users_' + dateToday + '.csv';
						hiddenElement.click();
						$rootScope.isLoading = false;
					},
					function(errorMessage) {
						$rootScope.isLoading = false;
						console.error(errorMessage);
					}
				);
			};
			
			
			$scope.$apply();
		}
	];
});