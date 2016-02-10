(function() {
    'use strict';
    define(['app'], function(app) {
        var value = {
            useAuthTokenHeader: true,
            servicesTimeout: 30000,
            urlServicesBase: '/someBaseUrl/',
            week: {
                "1": {
                    'id': 1,
                    'name': 'Monday',
                    'short': 'Mon',
                    'initial': 'Mo'
                },
                "2": {
                    'id': 2,
                    'name': 'Tuesday',
                    'short': 'Tue',
                    'initial': 'Tu'
                },
                "3": {
                    'id': 3,
                    'name': 'Wednesday',
                    'short': 'Wed',
                    'initial': 'We'
                },
                "4": {
                    'id': 4,
                    'name': 'Thursday',
                    'short': 'Thu',
                    'initial': 'Th'
                },
                "5": {
                    'id': 5,
                    'name': 'Friday',
                    'short': 'Fri',
                    'initial': 'Fr'
                },
                "6": {
                    'id': 6,
                    'name': 'Saturday',
                    'short': 'Sat',
                    'initial': 'Sa'
                },
                "7": {
                    'id': 7,
                    'name': 'Sunday',
                    'short': 'Sun',
                    'initial': 'Su'
                }

            },
            hoursInDay: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                16: 0,
                17: 0,
                18: 0,
                19: 0,
                20: 0,
                21: 0,
                22: 0,
                23: 0
            },
            roles: {
                admin: 'ROLE_ADMIN'
            }
        };
        app.value('config', value);
    });
})();
