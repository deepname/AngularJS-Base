define([], function() {
    return ['$scope', '$http', '$routeParams', 'config', '$location', '$timeout', '$filter', '$route',
        'userService', 'featureService', 'companiesService', '$rootScope', 'contentService', 'profilesService',
        function($scope, $http, $routeParams, config, $location, $timeout, $filter, $route,
            userService, featureService, companiesService, $rootScope, contentService, profilesService) {

            if ($routeParams.id) {
                $scope.showRememberBtn = true;
            } else {
                $scope.showRememberBtn = false;
            }

            var userType = '';

            $scope.newUser = false;
            $scope.sexTypes = ['MALE', 'FEMALE'];
            $scope.languages = ['es', 'en', 'ca'];
            $scope.mealTime = ['H1200_1900', 'H1330_2100'];

            $scope.url = $route.current.$$route.originalPath.split('/')[1];

            $scope.maxDate = new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDate());

            $scope.dateOptions = {
                startingDay: 1,
                maxDate: $scope.maxDate,
                formatDay: 'dd',
                formatMonth: 'MMMM',
                formatYear: 'yyyy'
            };

            switch ($scope.url) {
                case 'userBack':
                    userType = 'BACKOFFICE';
                    $scope.userType = userType;
                    $scope.listPath = 'userBack';
                    break;
                case 'userApp':
                    userType = 'WEGO_APP';
                    $scope.userType = userType;
                    $scope.listPath = 'userApp';
                    break;
                case 'userPro':
                    userType = 'COMMERCIAL';
                    $scope.userType = userType;
                    $scope.listPath = 'userPro';
                    break;
            }

            $scope.findCountries = function() {
                contentService.findCountries().then(function(data) {
                    $scope.cities = data;
                });
            };

            $scope.ratingStates = [{
                stateOn: 'glyphicon-ok-sign',
                stateOff: 'glyphicon-ok-circle'
            }, {
                stateOn: 'glyphicon-star',
                stateOff: 'glyphicon-star-empty'
            }, {
                stateOn: 'glyphicon-heart',
                stateOff: 'glyphicon-ban-circle'
            }, {
                stateOn: 'glyphicon-heart'
            }, {
                stateOff: 'glyphicon-off'
            }];

            $scope.trackingFilter = {
                userId: $routeParams.id,
                date: "13/04/2015",
                fromHour: "08:00",
                toHour: "21:00"
            };
            $scope.markerIcon = '/app/resources/img/street_guy.png';
            $scope.markerIconFirst = '/app/resources/img/street_guy_first.png';
            $scope.markerIconLast = '/app/resources/img/street_guy_last.png';
            $scope.languagesList = [{
                alias: 'es',
                name: 'Castellano'
            }, {
                alias: 'ca',
                name: 'Catalán'
            }, {
                alias: 'en',
                name: 'Inglés'
            }];
            $scope.mapOpts = {};
            $scope.mapOpts.center = '41.3856007,2.1676469';
            var infoWindow;
            $timeout(function() {
                setTimeout(function() {
                    $scope.updateScope('show_loadPage', 'false');
                    $scope.$apply();
                }, 700);
            });

            $scope.user = {
                profile: {
                    likesAlias: [],
                    dislikesAlias: []
                }
            };

            $scope.sliderOpts = {
                min: 0,
                max: 100
            };

            $scope.profilesPerPage = 10;
            $scope.profileCurrentPage = 0;
            $scope.profileFilters = {};

            $scope.profileSliders = [];

            /*** PUBLIC FUNCTIONS *********************************/
            $scope.findById = function(id) {
                userService.findUser(id).then(
                    function(data) {
                        $rootScope.isLoading = false;
                        $scope.user = data;

                        var myRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
                        var urlToValidate = $scope.user.profile.avatar;
                        $scope.user.profile.avatar = myRegExp.test(urlToValidate) ? $scope.user.profile.avatar : config.urlUtilitiesAppService + '/' + $scope.user.profile.avatar;

                        var birthdate = $scope.user.profile.birthdate || $scope.maxDate;

                        $scope.dt = new Date(birthdate);

                        $scope.initial = angular.copy($scope.user);

                        if ($scope.user.userType === 'WEGO_APP') {
                            $scope.match($scope.featuresProfile, 'likesAlias');
                            $scope.match($scope.featuresProfile, 'dislikesAlias');
                            $scope.findProfiles();
                        }
                    },
                    function(errorMessage) {
                        $rootScope.isLoading = false;
                        $scope.updateScope('errorMessage', errorMessage);
                        $timeout(function() {
                            $scope.updateScope('errorMessage', '--');
                        }, 3000);
                    }
                );
            };

            //Get all profiles list
            $scope.findProfiles = function(page, filters, rows) {
                profilesService.list(page, filters, rows).then(
                    function(data) {
                        $rootScope.isLoading = false;
                        $scope.allProfiles = data.list;

                        angular.forEach($scope.allProfiles, function(profile, i) {
                            $scope.profileSliders.push({
                                alias: profile.id,
                                name: profile.name,
                                min: 0,
                                max: 50
                            });
                        });
                    },
                    function(errorMessage) {
                        $rootScope.isLoading = false;
                        console.error(errorMessage);
                    }
                );
            };

            $scope.resetIncludes = function() {
                $scope.user = angular.copy($scope.initial);
            };

            $scope.onChecked = function(feature, toggle) {
                var found = $filter('filter')($scope.featuresProfile, {
                    id: feature.id
                }, true)[0];
                found[toggle] = feature.active ? true : false;
            };

            $scope.match = function(array, element) {
                array.forEach(function(value, index) {
                    if ($scope.user.profile[element].indexOf(value.alias) > -1) {
                        value.active = true;
                        value[element] = true;
                    }
                });
            };

            $scope.validate = function() {
                angular.element("#repetPassword").change(function() {
                    if (angular.element(this).val() === angular.element("#passwd").val()) {
                        angular.element(this).removeClass('ng-invalid');
                        if (!$scope.newUserForm.$invalid)
                            $scope.newUserForm.$invalid = false;
                    } else {
                        angular.element(this).addClass('ng-invalid');
                        $scope.newUserForm.$invalid = true;
                    }
                });
            };

            $scope.submit = function() {
                $scope.updateScope('show_loadPage', 'true');
                if ($scope.userType === 'WEGO_APP') {
                    $scope.user.profile.birthdate = $scope.dt.getTime();

                    var selectedLikes = $filter('filter')($scope.featuresProfile, true);

                    selectedLikes.forEach(function(entry) {
                        if (entry.likes) {
                            $scope.user.profile.likesAlias.push(entry.alias);
                        } else {
                            $scope.user.profile.dislikesAlias.push(entry.alias);
                        }
                    });

                } else {
                    delete $scope.user.likesAlias;
                    delete $scope.user.dislikesAlias;
                }

                $scope.user.userType = $scope.userType;

                angular.forEach($scope.profile, function(value, key) {
                    $scope.user.equalizer[$scope.profile[key].alias] = $scope.profile[key].rate.now / 10;
                });

                userService.save($scope.user, $scope.initial, $scope.newUser, $scope.userType).then(
                    function(data) {
                        if ($scope.newUser) {
                            $scope.updateScope('successMessage', 'Creado correctamente');
                            $location.path($scope.listPath + '/list');

                        } else {
                            $scope.updateScope('successMessage', 'Modificado correctamente');
                            $timeout(function() {
                                $scope.updateScope('successMessage', '--');
                                $scope.updateScope('show_loadPage', 'false');
                                $location.path($scope.listPath + '/list');
                            }, 3000);
                        }
                    },
                    function(errorMessage) {
                        var errMsg;
                        if (errorMessage == 'ALREADY_EXISTING') {
                            errMsg = 'Username already registered';
                        } else {
                            errMsg = errorMessage;
                        }
                        $scope.updateScope('show_loadPage', 'false');
                        $scope.updateScope('errorMessage', errMsg);
                        /*$timeout(function() {
                         $scope.updateScope('errorMessage', '--');
                         }, 3000);*/
                        console.warn(errMsg);
                    }
                );
            };

            $scope.findProfileFeatures = function() {
                featureService.featureSearch('PROFILE').then(
                    function(data) {
                        $scope.featuresProfile = data;
                        if ($routeParams.id) {
                            $scope.findById($routeParams.id);
                        } else {
                            $scope.newUser = true;
                            $rootScope.isLoading = false;
                        }
                    },
                    function(errorMessage) {
                        $scope.updateScope('errorMessage', errorMessage);
                        $timeout(function() {
                            $scope.updateScope('errorMessage', '--');
                        }, 3000);
                        console.warn(errorMessage);
                    }
                );
            };

            $scope.userRoles = function(userType) {
                userService.rolesUsers(userType).then(
                    function(data) {
                        $scope.roles = data.Roles.Role;
                    },
                    function(errorMessage) {
                        $scope.updateScope('errorMessage', errorMessage);
                        $timeout(function() {
                            $scope.updateScope('errorMessage', '--');
                        }, 3000);
                        console.warn(errorMessage);
                    }
                );
            };

            $scope.initTimePicker = function(id) {
                angular.element('#' + id).timepicker({
                    minuteStep: 1,
                    disableFocus: true,
                    showSeconds: false,
                    use24hours: true,
                    showMeridian: false
                });

                angular.element(document).on('blur', '#' + id, function() {
                    var that = angular.element('#' + id);
                    if (that.val() < 1000) that.val('0' + that.val());
                });
            };

            $scope.initDataRangePicker = function(id) {
                $timeout(function() {
                    angular.element('#' + id).datepicker({
                        format: "dd/mm/yyyy",
                        weekStart: 1,
                        language: "es",
                        multidateSeparator: "/",
                        forceParse: false,
                        calendarWeeks: true,
                        autoclose: true,
                        todayHighlight: true
                    });
                }, 500);
            };

            $scope.pickers = {
                birthday: angular.element('#user-birthdate'),
                //timeFrom: angular.element('#fromHour'),
                //timeTo: angular.element('#toHour')
            };

            $scope.$watch('pickers.birthday', function() {
                if ($scope.pickers.birthday.size()) {
                    $scope.initDataRangePicker('user-birthdate');
                }
            });

            //Check filter fields
            $scope.checkFields = function() {
                //Check date
                $timeout(function() {
                    var d = angular.element('#validFrom').val();
                    if (d !== '') {
                        $scope.trackingFilter.date = d;
                        //SEND QUERY
                    }
                }, 500);
                //check time-range
                $timeout(function() {
                    var from = angular.element('#fromHour').val();
                    var to = angular.element('#toHour').val();
                    if (from !== '') {
                        $scope.trackingFilter.fromHour = from;
                    }
                    if (to !== '') {
                        $scope.trackingFilter.toHour = to;
                    }
                    $scope.getTracking($scope.trackingFilter);
                }, 500);
            };

            //Map initialization
            $scope.$on('mapInitialized', function(event, map) {
                $scope.objMapa = map;
            });

            $scope.setMidPoint = function(userTracking) {
                var midPoint = userTracking[Math.floor(userTracking.length / 2)];
                $scope.mapOpts = {
                    center: midPoint
                };
            };

            //Get user's background tracking
            $scope.getTracking = function(filter) {
                userService.getTracking(filter,
                    function onSuccess(data) {
                        $scope.userTracking = [];
                        if (data.length) {
                            angular.forEach(data, function(value, key) {
                                $scope.userTracking.push([value.latitude, value.longitude]);
                            });
                            $scope.setMidPoint($scope.userTracking);

                        } else {
                            $rootScope.toggleMessageModal('¡Atención!', 'No se han obtenido puntos para la fecha y el horario seleccionado. ¡Prueba con otros!', [{
                                text: 'Entendido',
                                callback: null
                            }]);
                        }
                    },
                    function onError(err) {
                        console.log(err);
                    });
            };

            //Draw fake track to test functionality
            $scope.fakeTrack = function() {
                $scope.userTracking = [
                    ['41.38672625940192', '2.1700143814086914'],
                    ['41.38633988406815', '2.168598175048828'],
                    ['41.38585691167223', '2.1672892570495605'],
                    ['41.38696774281958', '2.1656370162963867'],
                    ['41.388159047887086', '2.164134979248047'],
                    ['41.38917324986403', '2.1626973152160645'],
                    ['41.390734768007086', '2.160615921020508'],
                    ['41.39189380876859', '2.1622681617736816'],
                    ['41.39281136804956', '2.1613025665283203'],
                    ['41.39401866316113', '2.16306209564209'],
                    ['41.39500057998363', '2.1617531776428223'],
                    ['41.39791404915381', '2.165851593017578']
                ];
                $scope.setMidPoint($scope.userTracking);
            };


            $scope.showWindow = function(event, marker) {
                if (infoWindow) {
                    infoWindow.close();
                }
                infoWindow = new google.maps.InfoWindow();
                var center = new google.maps.LatLng(marker.latitude, marker.longitude);
                var time = new Date(marker.timestamp);
                infoWindow.setContent(
                    '<p><h5>Position:<b> ' + marker.latitude + ', ' + marker.longitude + '</b></h5></p>' +
                    '<p><h5>Altitud:<b> ' + marker.altitude + ' Speed:<b> ' + marker.speed + '</b></b></h5></p>' +
                    '<p><h5>Accuracy:<b> ' + marker.accuracy + '</b></h5></p>' +
                    '<p><h5>Time:<b> ' + time.getHours() + ' : ' + time.getMinutes() + '</b></h5></p>'
                );
                infoWindow.setPosition(center);
                infoWindow.open($scope.objMapa);
            };

            //Get all companies
            $scope.getCompanies = function(page, filters, rows) { //page, filters, rows
                companiesService.getAll(page, filters, rows).then(
                    function(data) {
                        $scope.companiesList = data;
                    },
                    function(err) {
                        console.error(err);
                    }
                );
            };

            $scope.rememberUserPass = function(email) {
                userService.rememberPassword(email,
                    function onSuccess(res) {
                        $scope.successRemember = true;
                        $scope.rememberMsg = 'Hemos enviado un enlace a la dirección de correo electrónico con las instrucciones' +
                            ' para restablecer la contraseña.';
                    },
                    function onError(err) {
                        $scope.successRemember = false;
                        $scope.rememberMsg = 'Ha habido un error, por favor inténtalo de nuevo.';
                        console.error(err);
                    }
                );
            };


            if (userType === 'COMMERCIAL') {
                $scope.getCompanies(0, {}, 10);
            }
            $scope.findProfileFeatures();
            $scope.findProfiles();
            $scope.findCountries();
            $scope.userRoles($scope.userType);


            $scope.$apply();
        }
    ];
});
