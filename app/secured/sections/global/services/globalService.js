(function() {
    'use strict';

    define(['angular'], function(angular) {
        angular.module('wegoBackoffice.services.globalService', [])
            .service('globalService', function($http, $q, config, $rootScope, $timeout) {


                this.convertToArray = function(data) {
                    if (!angular.isUndefined(data) && data !== null) {
                        return angular.isArray(data) ? data : new Array(data);
                    } else {
                        return [];
                    }
                };

                this.validateRequiredFields = function(form, fieldsWithMessages) {
                    if (!form.$valid) {
                        var errors = form.$error;
                        if (typeof errors.required === 'object') {
                            var firstError = errors.required[0];
                            var message;
                            for (var i = 0; i < fieldsWithMessages.length; i++) {
                                var fieldName = fieldsWithMessages[i];
                                var errorNameCleaned = firstError.$name.replace(/({{.*}})/g, ''); //Removes possibles brackets. Some input names could be like "description{{directiveLang}}", and we need name to be like "description"
                                if (fieldName.name === errorNameCleaned) {
                                    message = fieldName.message;
                                    break;
                                }
                            }

                            if (message) {
                                $rootScope.updateScope('errorMessage', '--');
                                $rootScope.updateScope('errorMessage', message);
                                $timeout(function() {
                                    $rootScope.updateScope('errorMessage', '--');
                                }, 6000);

                                return false;
                            }

                        } else {
                            return true;
                        }

                    } else {
                        return true;
                    }
                };


                return this;

            });
    });
}());
