(function() {
    'use strict';

    define(['angular'], function(angular) {
        angular.module('wegoBackoffice.services.userService', [])
            .service('userService', function($http, $q, config) {

                var serviceBase = config.urlSecurityService + '/authn/';

                this.save = function(data, initial, newUser, userType) {
                    var url = config.urlSecurityService + '/users';

                    switch (userType) {
                        case 'COMMERCIAL':
                            delete data.dislikes;
                            delete data.likes;
                            break;
                        case 'BACKOFFICE':
                            delete data.dislikes;
                            delete data.likes;
                            break;
                        case 'WEGO_APP':
                            break;
                    }

                    if (newUser) {
                        delete data.repeatPassword;
                        return $http({
                            method: "POST",
                            url: url,
                            data: data
                        }).then(handleSuccess, handleError);
                    } else {
                        data = utils.deltaPatch(data, initial);
                        return $http({
                            headers: {
                                'Content-Type': 'application/json-patch+json'
                            },
                            method: "PATCH",
                            url: url + '/' + initial.username,
                            data: data
                        }).then(handleSuccess, handleError);
                    }
                };

                this.findUser = function(id) {
                    return $http({
                        method: "GET",
                        url: config.urlSecurityService + '/users/' + id
                    }).then(handleSuccess, handleError);
                };

                this.rolesUsers = function() {
                    return $http({
                        method: "GET",
                        url: config.urlDataServiceBase + ''
                    }).then(handleSuccess, handleError);
                };

                this.profilesUsers = function() {
                    return $http({
                        method: "GET",
                        url: config.urlNodeServiceBase + '/user/profiles/es'
                            //url: config.urlDataServiceBase + '/users/profiles/es'
                    }).then(handleSuccess, handleError);
                };

                this.list = function(page, filters, rows, userType) {
                    var criteria = prepareCriteria(page, filters, rows, userType);
                    return $http({
                        method: "POST",
                        url: config.urlSecurityService + '/users/search',
                        data: criteria

                    }).then(handleSuccess, handleError);
                };

                this.exportCSV = function(page, filters, rows) {
                    var criteria = prepareCriteria(page, filters, rows);
                    return $http({
                        method: "POST",
                        url: config.urlSecurityService + '/users/export_csv',
                        data: criteria

                    }).then(handleSuccess, handleError);
                };

                this.rolesUsers = function(userType) {
                    var url;
                    switch (userType) {
                        case 'BACKOFFICE':
                            url = config.urlDataServiceBase + '/roles';
                            break;
                        case 'WEGO_APP':
                            url = config.urlDataServiceBase + '/roles/user';
                            break;
                        case 'COMMERCIAL':
                            url = config.urlDataServiceBase + '/roles/profesional';
                            break;
                    }
                    return $http({
                        method: "GET",
                        url: url
                    }).then(handleSuccess, handleError);
                };

                this.delete = function(id) {
                    return $http({
                        method: "DELETE",
                        url: config.urlSecurityService + '/users/' + id
                    }).then(handleSuccess, handleError);
                };

                this.getTracking = function(filter, onSuccess, onError) {
                    var url = config.urlWeGoServicesBase + '/track/search';
                    $http({
                        url: url,
                        method: 'POST',
                        data: filter,
                        timeout: 30000
                    }).success(function(res) {
                        onSuccess(res);
                    }).error(function(err) {
                        onError(err);
                    });
                };

                this.rememberPassword = function(mail, onSuccess, onError) {
                    var url = serviceBase + 'rememberPassword';
                    $http({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            email: mail
                        }
                    }).success(function(res) {
                        onSuccess(res);
                    }).error(function(err) {
                        onError(err);
                    });
                };


                // ---
                // PRIVATE METHODS.
                // ---

                // I transform the error response, unwrapping the application dta from
                // the API response payload.
                function handleError(response) {
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (!response.status && !response.statusText) {
                        return ($q.reject("An unknown error occurred."));
                    }
                    // Otherwise, use expected error message.
                    return ($q.reject(response.status + ': ' + response.statusText));
                }
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess(response) {
                    return (response.data);
                }

                function prepareCriteria(page, filters, rows, type) {
                    var criteria = {};
                    if (!angular.isUndefined(filters) && filters !== null) {
                        if (filters.f_email > '')
                            criteria.email = filters.f_email;
                        if (filters.f_username > '')
                            criteria.username = filters.f_username;
                        if (filters.f_actived > '')
                            criteria.actived = filters.f_actived;
                        if (filters.f_enabled > '')
                            criteria.enabled = filters.f_enabled;
                    }
                    if (rows > '')
                        criteria.rows = rows;
                    if (type > '')
                        criteria.userType = type;
                    criteria.page = page;
                    return criteria;
                }

                return this;


            });
    });
}());
