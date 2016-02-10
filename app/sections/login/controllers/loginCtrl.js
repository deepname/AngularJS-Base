define([], function() {
    return ['$scope', '$http', '$location', '$rootScope', 'authService', 'socialService',
        function($scope, $http, $location, $rootScope, authService, socialService) {

            $rootScope.isLoading = false;

            $scope.credentials = {
                username: '',
                password: '',
                rememberMe: false
            };

            $scope.login = function(credentials) {
                authService.login(credentials.username, credentials.password, credentials.rememberMe).then(function(authData) {
                    if (!authData) {
                        $scope.loginError = true;
                        $scope.loginErrMsg = 'Unable to login';
                        return;
                    }

                    $location.path('/about');
                });
            };

            //Request password reset
            $scope.rememberPassword = function(credentials) {
                authService.rememberPassword(credentials.username,
                    function onSuccess(res) {
                        $scope.successRemember = true;
                        $scope.dontRemember = false;
                        $scope.rememberMsg = 'Te hemos enviado un enlace a tu dirección de correo electrónico con las instrucciones' +
                            ' para restablecer tu contraseña.';
                    },
                    function onError(err) {
                        $scope.successRemember = false;
                        $scope.rememberMsg = 'Ha habido un error, por favor inténtalo de nuevo.';
                        console.error(err);
                    }
                );
            };

            //Submit handler (login / reset pass)
            $scope.submitHandler = function(credentials) {
                if ($scope.dontRemember) {
                    $scope.rememberPassword(credentials);
                } else {
                    $scope.login(credentials);
                }
            };

            $scope.loadingView = true;
            $rootScope.isLoading = false;
            // because this has happened asynchroneusly we've missed
            // Angular's initial call to $apply after the controller has been loaded
            // hence we need to explicityly call it at the end of our Controller constructor

            $scope.$apply();
        }
    ];
});
