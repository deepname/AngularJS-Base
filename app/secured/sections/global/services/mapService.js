(function() {
    'use strict';

    define(['angular'], function(angular) {
        angular.module('wegoBackoffice.services.mapService', [])
            .service('mapService', function($http, $q, config) {

                this.fireCallback = function(callback) {
                    var args = Array.prototype.slice.call(arguments);
                    var fn = args.shift();

                    if (typeof fn === 'function') {
                        fn.apply(this, args);
                    }
                };

                this.loadScript = function(urls, onSuccess, onFailure) {
                    // Get the scripts url in order
                    var self = this;
                    var src = urls.shift();

                    if (typeof src === 'undefined') {
                        self.fireCallback(onSuccess);

                    } else {
                        var head = document.getElementsByTagName('head')[0];
                        var script = document.createElement('script');

                        // When loaded do a recursive call
                        script.onload = function() {
                            self.loadScript(urls, onSuccess, onFailure);
                        };
                        // When error fire the callback error function
                        script.onerror = function() {
                            self.fireCallback(onFailure);
                        };

                        //Set the URL and insert script in DOM
                        script.setAttribute('src', src);
                        head.appendChild(script);
                    }
                };

                this.loadGoogleMapsApi = function(language, onSuccess, onFailure) {
                    var self = this;
                    var mapsUrl = [
                        'http://maps.google.com/maps/api/js?sensor=true&language=' + language,
                        'libraries=places,geometry',
                        'callback=mapsCallback'
                    ].join('&');

                    // Load if not did it already
                    if (typeof window.google === 'undefined' || window.google === null) { //window.google.maps
                        self.loadScript(
                            [mapsUrl],
                            function mapsLoadSuccess() {
                                console.log('maps successfully loaded. waiting for callback');
                            },
                            function mapsLoadFailure() {
                                self.fireCallback(onFailure);
                            }
                        );

                        //callback function when gMaps lib is loaded,
                        window.mapsCallback = function() {
                            console.log('mapsCallback');
                            self.fireCallback(onSuccess);
                            window.mapsCallback = null;
                        };

                    } else {
                        self.fireCallback(onSuccess);
                    }
                };


                return this;
            });
    });
}());
