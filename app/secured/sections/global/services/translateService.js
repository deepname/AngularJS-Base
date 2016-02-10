(function () {
    'use strict';

    define(['angular'], function (angular) {
        angular.module('wegoBackoffice.services.translateService', [])

            .service('translateService', function ($http, $q, config) {

                function htmlToPlaintext(text) {
                    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
                }

                /*
                * @param  data       {Object}    Object with the fields to be translated
                * @param  from       {String}    Source language, like 'es' or 'en'
                * @param  from       {String}    Target language, like 'es' or 'en'
                * @param  onSuccess  {Function}  Success callback
                * @param  onError    {Function}  Error callback
                * @return transRes   {Object}    Translated fields
                */
                this.autoTranslate = function(data, from, to, onSuccess, onError){

                    var browserTranslateKey = 'AIzaSyAF5Q5TXx00exQ2bxF0cgZWlirQ9SKatTk';
                    var urlBase = 'https://www.googleapis.com/language/translate/v2?key='+browserTranslateKey+'&source='+from+'&target='+to+'&q=';
                    var promises = {}, transRes = {};

                    angular.forEach(data, function(value, field){
                        promises[field] = $http.get(urlBase + htmlToPlaintext(value));
                    });

                    $q.all(promises).then(function(result){
                        angular.forEach(result, function(value, key){
                            transRes[key] = result[key].data && result[key].data.data && result[key].data.data.translations[0].translatedText ? result[key].data.data.translations[0].translatedText : '';
                        });
                    }).catch(function(err){
                        onError(err);

                    }).finally(function(){
                       onSuccess(transRes);
                    });
                };

                return this;
                
            });
    });
}());