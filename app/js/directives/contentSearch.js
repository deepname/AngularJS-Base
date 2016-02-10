(function() {

    'use strict';

    define(['angular', 'services'], function(angular, services) {


        angular.module('base.directives.contentSearch', [])
            .directive('contentSearch', [
                function() {
                    return {
                        restrict: 'AE',
                        templateUrl: 'app/secured/sections/global/views/contentRoutesModal.html',
                        scope: false,
                        controller: 'contentSearchModuleController'
                    };
                }
            ])
            .controller("contentSearchModuleController", ['$scope', 'contentService', '$rootScope', '$timeout', '$location', '$filter', 'FileUploader', 'config', 'translateService', '$route',
                function($scope, contentService, $rootScope, $timeout, $location, $filter, FileUploader, config, translateService, $route) {

                    $scope.itemsPerPage = 10;
                    $scope.currentPage = 0;
                    $scope.page = {};
                    $scope.urlStaticImage = '/images/content/';
                    $scope.filters = {};

                    $scope.routeContents = [];


                    $scope.resetContent = function() {
                        $scope.editingRouteContent = {
                            "_id": guidGenerator(),
                            "name": null,
                            "i18n": {
                                "es": {},
                                "en": {},
                                "ca": {}
                            },
                            "imagesURLs": [],
                            "mainImageURL": null,
                            "address": {},
                            "location": {},
                            "order": null
                        };

                        function guidGenerator() {
                            var S4 = function() {
                                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                            };
                            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                        }
                    };


                    //Filters changes watcher
                    $scope.$watch('filters', function() {
                        if ($scope.filters) {
                            $scope.listFull($scope.currentPage, $scope.filters, parseInt($scope.itemsPerPage));
                        } else {
                            $scope.filters = {};
                        }
                    });

                    //List filtered (or not) content
                    $scope.listFull = function(page) {
                        if ($rootScope.showModalContent) {
                            contentService.listFull(page, $scope.filters, parseInt($scope.itemsPerPage))
                                .then(
                                    function(data) {
                                        $scope.page = data;
                                        $scope.contentSearchResults = data.list;
                                        $scope.showResultsList = true;
                                        if ($('.assoc-list').scrollTop() > 0) {
                                            $('.assoc-list').animate({
                                                scrollTop: 0
                                            }, 300);
                                        }
                                    },
                                    function(errorMessage) {
                                        console.error(errorMessage);
                                    }
                                );
                        }
                    };

                    //Page change watcher
                    $scope.$watch("currentPage", function(newValue, oldValue) {
                        if (newValue > -1) {
                            if (newValue >= 0) {
                                $scope.savePage('content', newValue);
                            }
                            $scope.listFull(newValue, $scope.filters, parseInt($scope.itemsPerPage));
                        }
                    });

                    //Disable main scroll when opening edition modal
                    var disableMainScroll = function() {
                        if (!$('body').hasClass('noscroll')) {
                            $('body').addClass('noscroll');
                        }
                        if (!$('ng-view').hasClass('noscroll')) {
                            $('ng-view').addClass('noscroll');
                        }
                    };

                    //Enable main scroll when closing edition modal
                    var enableMainScroll = function() {
                        $('ng-view').removeClass('noscroll');
                        $('body').removeClass('noscroll');
                    };


                    //Add/remove existing route content handler
                    $scope.existingContentHandler = function(content) {
                        var matches = 0;
                        $scope.routeContents.forEach(function(val, i) {
                            if (val._id == content._id) {
                                matches++;
                            }
                        });
                        if (matches > 0) {
                            $scope.deleteExistingContentFromRoute(content);
                        } else {
                            $scope.addExistingContentToRoute(content);
                        }
                    };


                    //Add existing content to route from content search
                    $scope.addExistingContentToRoute = function(content) {
                        var contentToAdd = {
                            "_id": content._id,
                            "name": content.name,
                            "i18n": content.content.i18n,
                            "imagesURLs": content.content.imagesURLs,
                            "mainImageURL": content.content.mainImageURL,
                            "address": content.content.address,
                            "location": content.location
                        };

                        if (!$scope.routeContents) $scope.routeContents = [];
                        $scope.routeContents.push(contentToAdd);
                    };

                    //Delete existing content from route
                    $scope.deleteExistingContentFromRoute = function(content) {
                        $scope.routeContents.forEach(function(val, i) {
                            if (val._id == content._id) {
                                $scope.routeContents.splice(i, 1);
                            }
                        });
                    };


                    //Edit route content
                    $scope.editRouteContent = function(content) {
                        disableMainScroll();
                        $scope.editingRouteContent = angular.copy(content);
                        $scope.resetMapOpts(true);
                        $scope.resetImgUploader();
                        $scope.showEditionBox = true;
                        $scope.editionBoxIsEdition = true;
                    };


                    //Close content edition
                    $scope.closeEditionContent = function(saveChanges) {
                        if ($scope.editionBoxIsEdition) {

                            if (saveChanges) {
                                if ($scope.routeContents && $scope.routeContents.length) {
                                    $scope.routeContents.forEach(function(content, i) {
                                        if (content._id == $scope.editingRouteContent._id) {
                                            $scope.routeContents[i] = angular.copy($scope.editingRouteContent);
                                        }
                                    });
                                } else {
                                    $scope.routeContents.push($scope.editingRouteContent);
                                }
                            }

                        } else {
                            if (saveChanges) {
                                if (!$scope.editingRouteContent.name || $scope.editingRouteContent.name == '') {
                                    $scope.toggleMessageModal('Atención!', 'Debes especificar un nombre antes de guardar.', [{
                                        text: 'Entendido',
                                        callback: null
                                    }]);
                                    return false;
                                }
                                $scope.editingRouteContent.location = {
                                    lat: $scope.editingMapOpts.marker.latitude,
                                    lon: $scope.editingMapOpts.marker.longitude
                                };

                                delete $scope.editingRouteContent.address.fullAddress;
                                $scope.routeContents.push($scope.editingRouteContent);
                            }
                        }

                        enableMainScroll();
                        $scope.showEditionBox = false;
                    };


                    //New route content
                    $scope.createRouteContent = function() {
                        disableMainScroll();
                        $scope.resetContent();
                        $scope.resetMapOpts(false);
                        $scope.resetImgUploader();
                        $scope.showEditionBox = true;
                        $scope.editionBoxIsEdition = false;
                    };


                    //Check if added to route
                    $scope.isRouteContent = function(contentID) {
                        var matches = 0;
                        if ($scope.routeContents && $scope.routeContents.length) {
                            $scope.routeContents.forEach(function(content, i) {
                                if (contentID == content._id) {
                                    matches++;
                                }
                            });
                        }
                        return matches > 0;
                    };


                    //Define map variable
                    $scope.map2 = null, $scope.marker2 = null, $scope.geocoder2 = null;
                    var acBounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng(41.341634, 2.097015),
                        new google.maps.LatLng(41.448903, 2.230568)
                    );

                    $scope.$on('mapInitialized', function(evt, evtMap) {
                        $scope.map2 = evtMap;
                        $scope.marker2 = $scope.map2.markers[0];

                        //Run geocoder
                        $scope.geocoder2 = new google.maps.Geocoder();

                        //Listener for updating when marker has been dragged
                        google.maps.event.addListener($scope.marker2, 'dragend', function() {
                            $scope.updateMapDrag();
                        });
                    });

                    //Set/Reset map opts
                    $scope.resetMapOpts = function(isEdition) {
                        if (isEdition) {
                            if ($scope.editingRouteContent.address) {
                                $scope.editingMapOpts = {
                                    marker: {
                                        latitude: $scope.editingRouteContent.location.lat,
                                        longitude: $scope.editingRouteContent.location.lon
                                    },
                                    streetName: $scope.editingRouteContent.address.streetName,
                                    streetNum: $scope.editingRouteContent.address.streetNumber,
                                    fullAddress: $scope.editingRouteContent.address.googleAddress,
                                    zipCode: $scope.editingRouteContent.address.postalCode,
                                    bounds: acBounds
                                };
                            }

                        } else {
                            $scope.editingMapOpts = {
                                marker: {
                                    latitude: '',
                                    longitude: ''
                                },
                                streetNum: '',
                                streetName: '',
                                fullAddress: '',
                                zipCode: '',
                                bounds: acBounds
                            };
                        }
                    };


                    //Get street name from coords
                    $scope.getStreetName2 = function() {
                        var latlon = new google.maps.LatLng($scope.editingMapOpts.marker.latitude, $scope.editingMapOpts.marker.longitude);
                        $scope.geocoder2.geocode({
                            'latLng': latlon
                        }, function(res, status) {
                            if (status == google.maps.GeocoderStatus.OK) {

                                if (res[0]) {
                                    var firstRes = res[0];
                                    if (firstRes.address_components) {
                                        var parts = firstRes.address_components;
                                        getMapParts(firstRes, parts);
                                    }
                                }
                            } else {
                                $rootScope.toggleMessageModal('Atención!', 'Ha habido un error: ' + status, [{
                                    text: 'Entendido',
                                    callback: null
                                }]);
                            }
                        });
                    };

                    var getMapParts = function(allInfo, parts) {
                        //Get full address
                        if (allInfo.formatted_address) {
                            $scope.editingMapOpts.fullAddress = allInfo.formatted_address;
                        }
                        allInfo.address_components.forEach(function(e, i) {
                            if (parts[i].types) {
                                parts[i].types.forEach(function(f, j) {
                                    //get street number
                                    if (parts[i].types[j] == 'street_number') {
                                        $scope.editingMapOpts.streetNum = parts[i].long_name;
                                    }
                                    //get street name
                                    if (parts[i].types[j] == 'route') {
                                        $scope.editingMapOpts.streetName = parts[i].long_name;
                                    }
                                    //get locality
                                    if (parts[i].types[j] == 'locality') {
                                        $scope.editingMapOpts.city = parts[i].long_name;
                                    }
                                    //Get zipcode
                                    if (parts[i].types[j] == 'postal_code') {
                                        $scope.editingMapOpts.zipCode = parts[i].long_name;
                                    }
                                });
                            }
                        });

                        if (!$scope.editingRouteContent.address) {
                            $scope.editingRouteContent.address = {};
                        }
                        $scope.editingRouteContent.address.fullAddress = $scope.editingMapOpts.fullAddress;
                        $scope.editingRouteContent.address.postalCode = $scope.editingMapOpts.zipCode;
                        $scope.editingRouteContent.address.streetName = $scope.editingMapOpts.streetName;
                        $scope.editingRouteContent.address.streetNumber = $scope.editingMapOpts.streetNum;
                    };


                    //Get coordinates and other info from google's autocomplete result
                    var getCoordsFromStreet = function() {
                        if ($scope.editingAcObject.details.address_components) {
                            if ($scope.editingAcObject.details.address_components) {
                                var parts = $scope.editingAcObject.details.address_components;
                                getMapParts($scope.editingAcObject.details, parts);
                            }
                        }
                        $scope.editingMapOpts.marker = {
                            latitude: $scope.editingAcObject.details.geometry.location.lat(),
                            longitude: $scope.editingAcObject.details.geometry.location.lng()
                        };
                        $scope.map2.panTo(new google.maps.LatLng($scope.editingAcObject.details.geometry.location.lat(), $scope.editingAcObject.details.geometry.location.lng()));
                    };

                    var clearMapCombo = function() {
                        $scope.editingRouteContent.content.address.region = '';
                        $scope.editingRouteContent.content.address.city = '';
                        $scope.editingRouteContent.content.address.streetType = '';
                    };

                    //Editing autocomplete watcher
                    var count = 0;
                    $scope.editingAcObject = {};
                    $scope.$watch('editingAcObject.details', function() {
                        if (count >= 1) {
                            getCoordsFromStreet();
                            //clearMapCombo();
                        }
                        count++;
                    });


                    //Close modal confirm selected contents
                    $scope.confirmRouteContents = function() {
                        $rootScope.showModalContent = false;
                        $timeout(function() {
                            $scope.contentSearchResults = '';
                            $scope.crQuery = '';
                            $('input[name=query]').val('');
                            $scope.showResultsList = false;
                        }, 400);
                        $scope.$emit('closingModal', $scope.routeContents);
                    };


                    //Ask user for confirmation before uploading new images
                    $scope.finishImgUploadProcessRoute = function() {
                        $rootScope.toggleMessageModal('Confirmar', '¿Estás seguro de subir estas imágenes?', [{
                            text: 'Cancelar',
                            callback: cancelUpload
                        }, {
                            text: 'Confirmar',
                            callback: confirmUpload
                        }]);

                        function confirmUpload() {

                            if (!$scope.management.route) {
                                $scope.management.route = [];
                            }

                            if (!$scope.editionBoxIsEdition) {
                                $scope.closeEditionContent(true);
                            }

                            if ($scope.routeContents && $scope.routeContents.length) {
                                $scope.management.route = angular.copy($scope.routeContents);
                            } else {
                                $scope.addExistingContentToRoute($scope.editingRouteContent);
                            }

                            $scope.management.route.forEach(function(routeContent, i) {
                                if ($scope.editingRouteContent._id == routeContent._id) {
                                    routeContent.uploadImages = angular.copy($scope.editingRouteContent.uploadImages);
                                }
                                routeContent.order = i + 1;
                            });

                            $rootScope.closeMessageModal();
                            $rootScope.isLoading = true;
                            contentService.save($scope.management).then(
                                function(data) {
                                    $rootScope.isLoading = false;
                                    $scope.resetImgUploader();
                                    enableMainScroll();
                                    $scope.showEditionBox = false;

                                    var contentID = data._id ? data._id : (data.id ? data.id : '');

                                    if ($scope.modificate) {
                                        $route.reload();
                                    } else {
                                        $location.path('/content/edit/' + contentID);
                                    }

                                },
                                function(err) {
                                    $rootScope.isLoading = false;
                                    $scope.resetImgUploader();
                                    enableMainScroll();
                                    $scope.showEditionBox = false;
                                    if (err.data && err.data.map) {
                                        var msg;
                                        if (err.data.map.name && err.data.map.name == 'NotNull') {
                                            msg = 'El campo "name" no puede estar vacío.';
                                        } else if (err.data.map.name && err.data.map.name == 'ALREADY_EXISTING') {
                                            msg = 'Ya existe un contenido con este nombre.';
                                        }
                                        $scope.updateScope('errorMessage', msg);
                                        $timeout(function() {
                                            $scope.updateScope('errorMessage', '--');
                                        }, 3000);
                                    }
                                    console.error(err);
                                });
                        }

                        function cancelUpload() {
                            uploader2.clearQueue();
                            $scope.editingRouteContent.uploadImages = [];
                            $rootScope.closeMessageModal();
                        }
                    };



                    //Autotranslate for route contents
                    var isRouteTranslating = false;
                    $scope.routeAutoTranslate = function(from, to) {
                        if (!isRouteTranslating) {
                            var data = {};
                            isRouteTranslating = true;

                            if ($scope.editingRouteContent.i18n[from]) {

                                if ($scope.editingRouteContent.i18n[from].title &&
                                    $scope.editingRouteContent.i18n[from].title !== '') {
                                    data.title = $scope.editingRouteContent.i18n[from].title;
                                } else {
                                    $rootScope.toggleMessageModal('Atención!', 'El campo "title" está vacío', [{
                                        text: 'Entendido',
                                        callback: null
                                    }]);
                                    isRouteTranslating = false;
                                    return false;
                                }

                                if ($scope.editingRouteContent.i18n[from].shortDescription &&
                                    $scope.editingRouteContent.i18n[from].shortDescription !== '') {
                                    data.shortDescription = $scope.editingRouteContent.i18n[from].shortDescription;
                                } else {
                                    $rootScope.toggleMessageModal('Atención!', 'El campo "short description" está vacío', [{
                                        text: 'Entendido',
                                        callback: null
                                    }]);
                                    isRouteTranslating = false;
                                    return false;
                                }

                                if ($scope.editingRouteContent.i18n[from].description &&
                                    $scope.editingRouteContent.i18n[from].description !== '') {
                                    data.description = $scope.editingRouteContent.i18n[from].description;
                                } else {
                                    $rootScope.toggleMessageModal('Atención!', 'El campo "description" está vacío', [{
                                        text: 'Entendido',
                                        callback: null
                                    }]);
                                    isRouteTranslating = false;
                                    return false;
                                }

                                if ($scope.editingRouteContent.i18n[from].howToArrive &&
                                    $scope.editingRouteContent.i18n[from].howToArrive !== '') {
                                    data.howToArrive = $scope.editingRouteContent.i18n[from].howToArrive;
                                } else {
                                    $rootScope.toggleMessageModal('Atención!', 'El campo "howToArrive" está vacío', [{
                                        text: 'Entendido',
                                        callback: null
                                    }]);
                                    isRouteTranslating = false;
                                    return false;
                                }

                                if ($scope.editingRouteContent.i18n[from].timetable &&
                                    $scope.editingRouteContent.i18n[from].timetable !== '') {
                                    data.timetable = $scope.editingRouteContent.i18n[from].timetable;
                                }

                                $rootScope.isLoading = true;

                                //call
                                translateService.autoTranslate(data, from, to,
                                    function onSuccess(res) {
                                        $rootScope.isLoading = false;
                                        $scope.editingRouteContent.i18n[to].title = res.title ? res.title : '';
                                        $scope.editingRouteContent.i18n[to].shortDescription = res.shortDescription ? res.shortDescription : '';
                                        $scope.editingRouteContent.i18n[to].description = res.description ? res.description : '';
                                        $scope.editingRouteContent.i18n[to].howToArrive = res.howToArrive ? res.howToArrive : '';
                                        $scope.editingRouteContent.i18n[to].timetable = res.timetable ? res.timetable : '';
                                        isRouteTranslating = false;
                                    },
                                    function onError(err) {
                                        $rootScope.isLoading = false;
                                        console.error(err);
                                        $scope.updateScope('errorMessage', err);
                                        isRouteTranslating = false;
                                        $timeout(function() {
                                            $scope.updateScope('errorMessage', '--');
                                        }, 3000);
                                    }
                                );
                            }
                        }
                    };


                    //Enable/disable scroll when content search modal is closed/open
                    $scope.$watch('showModalContent', function() {
                        if ($scope.showModalContent === true) {
                            disableMainScroll();
                        } else {
                            enableMainScroll();
                        }
                    });


                    //Copy editing content name to  its title field
                    $scope.editingContentNameChanging = function(name) {
                        if (!$scope.editingRouteContent.i18n) {
                            $scope.editingRouteContent.i18n = {
                                es: {
                                    title: name
                                },
                                ca: {
                                    title: name
                                },
                                en: {
                                    title: name
                                }
                            };
                        } else {
                            $scope.editingRouteContent.i18n.ca.title = name;
                            $scope.editingRouteContent.i18n.es.title = name;
                            $scope.editingRouteContent.i18n.en.title = name;
                        }
                    };



                    //---------------- IMG UPLOADER STUFF --------------- //
                    var uploader2;
                    $scope.resetImgUploader = function() {
                        uploader2 = $scope.uploader2 = new FileUploader({
                            url: config.urlUtilitiesService + '/file/upload',
                            headers: {
                                'X-Auth-Token': $scope.authToken
                            },
                            formData: [{
                                category: 'content'
                            }]
                        });
                        // FILTERS
                        uploader2.filters.push({
                            name: 'customFilter',
                            fn: function(item /*{File|FileLikeObject}*/ , options) {
                                return this.queue.length < 10;
                            }
                        });

                        // CALLBACKS
                        uploader2.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                            //console.info('onWhenAddingFileFailed', item, filter, options);
                        };
                        uploader2.onAfterAddingFile = function(fileItem) {
                            //console.info('onAfterAddingFile', fileItem);
                        };
                        uploader2.onAfterAddingAll = function(addedFileItems) {
                            //console.info('onAfterAddingAll', addedFileItems);
                        };
                        uploader2.onBeforeUploadItem = function(item) {
                            //console.info('onBeforeUploadItem', item);
                        };
                        uploader2.onProgressItem = function(fileItem, progress) {
                            //console.info('onProgressItem', fileItem, progress);
                        };
                        uploader2.onProgressAll = function(progress) {
                            //console.info('onProgressAll', progress);
                        };
                        uploader2.onSuccessItem = function(fileItem, response, status, headers) {
                            if (!$scope.editingRouteContent.uploadImages) {
                                $scope.editingRouteContent.uploadImages = [];
                            }
                            $scope.editingRouteContent.uploadImages.push(response.id);
                            console.info('onSuccessItem', fileItem, response, status, headers);
                        };
                        uploader2.onErrorItem = function(fileItem, response, status, headers) {
                            console.info('onErrorItem', fileItem, response, status, headers);
                        };
                        uploader2.onCancelItem = function(fileItem, response, status, headers) {
                            console.info('onCancelItem', fileItem, response, status, headers);
                        };
                        uploader2.onCompleteItem = function(fileItem, response, status, headers) {
                            console.info('onCompleteItem', fileItem, response, status, headers);
                        };
                        uploader2.onCompleteAll = function() {
                            console.info('onCompleteAll');
                            $scope.finishImgUploadProcessRoute();
                        };
                    };

                    //Init uploader
                    $scope.resetImgUploader();

                }
            ]);


    });
})();
