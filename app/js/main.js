(function() {

    'use strict';

    require.config({
        paths: {
            /* beautify preserve:start */
            jquery               : '../../bower_components/jquery/dist/jquery.min',
            jqueryUi             : '../../bower_components/jqueryui/jquery-ui.min',
            angular              : '../../bower_components/angular/angular',
            angularRoute         : '../../bower_components/angular-route/angular-route',
            angularAnimate       : '../../bower_components/angular-animate/angular-animate.min',
            requirejs            : '../../bower_components/requirejs/require',
            text                 : '../../bower_components/requirejs-text/text',
            config               : '../js/config',
            bootstrap            : '../../bower_components/bootstrap.min',
            angularBootstrap     : '../../bower_components/angular-bootstrap/ui-bootstrap',
            utils                : '../js/utils/utils'
            /* beautify preserve:end */
        },
        shim: {
            angular: {
                'exports': 'angular',
                'deps': ['jquery']
            },
            jqueryUi: {
                deps: ['jquery']
            },
            angularRoute: {
                deps: ['angular']
            },
            angularAnimate: {
                deps: ['angular']
            },
            requirejs: {
                deps: ['angular']
            },
            config: {
                deps: ['angular']
            },
            bootstrap: {
                deps: ['jquery']
            },
            angularBootstrap: {
                deps: ['angular']
            },
            angularBootstrapTpls: {
                deps: ['angular', 'angularBootstrap']
            },
            utils: {
                deps: []
            }
        },
        priority: [
            "angular"
        ],
        waitSeconds: 15
    });

    //http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
    window.name = "NG_DEFER_BOOTSTRAP!";

    require([
        'jquery',
        'jqueryUi',
        'angular',
        'angularRoute',
        'angularAnimate',
        'requirejs',
        'app',
        'routes',
        'config',
        'bootstrap',
        'angularBootstrap',
        'angularBootstrapTpls',
        'utils'
    ], function(jquery, jqueryUi, angular, angularRoute, angularAnimate, angularFilter, requirejs, app,
        routes, config, bootstrap, angularBootstrap, angularBootstrapTpls, utils) {

        var $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function() {
            angular.resumeBootstrap([app.name]);
        });
    });
})();
