define([], function() {
    return ['$scope', '$rootScope', '$location',
        function($scope, $rootScope, $location) {

            $scope.oneAtATime = true;

            $rootScope.appSections = {
                dashboard: {
                    name: 'Dashboard',
                    path: '/about',
                    icon: 'fa-tachometer'
                },
                sales: {
                    name: 'Sales',
                    icon: 'fa-shopping-cart',
                    children: [{
                        name: 'Business deals',
                        path: '/sales/business_deals/list'
                    }, {
                        name: 'Comercial areas',
                        path: '/sales/comercial_areas/edit'
                    }, {
                        name: 'Companies (pro)',
                        path: '/sales/companies_pro/list'
                    }, {
                        name: 'Trademarks',
                        path: '/trademarks/list'
                    }]
                },
                content: {
                    name: 'Contents',
                    icon: 'fa-pencil-square-o',
                    children: [{
                        name: 'Contents',
                        path: '/content/list'
                    }, {
                        name: 'Categories',
                        path: '/category/list'
                    }, {
                        name: 'Features',
                        children: [{
                            name: 'Features',
                            path: '/features/feature/list'
                        }, {
                            name: 'Profile',
                            path: '/features/profile/list'
                        }, {
                            name: 'Profile order',
                            path: '/features/profile/order'
                        }, {
                            name: 'Group',
                            path: '/features/group/list'
                        }]
                    }, {
                        name: 'Synopsis',
                        path: '/synopsis/list'
                    }, {
                        name: 'Influencers',
                        path: '/influencer/list'
                    }, {
                        name: 'Plan',
                        children: [{
                            name: 'Predefined plans',
                            path: '/plan/predefined_plan/list'
                        }, {
                            name: 'Plan templates',
                            path: '/plan/plan_templates/list'
                        }, {
                            name: 'Plan template types',
                            path: '/plan/plan_template_types/list'
                        }, {
                            name: 'Plan names',
                            path: '/plan/plan_names/list'
                        }]
                    }]
                },
                simulators: {
                    name: 'Simulators',
                    icon: 'fa-empire',
                    children: [{
                        name: 'Shake plan',
                        path: '/simulators/shake_plan'
                    }, {
                        name: 'Bcn search',
                        path: '/simulators/bcn_search'
                    }, {
                        name: 'Social login',
                        path: '/simulators/social_login'
                    }]
                },
                users: {
                    name: 'Users',
                    icon: 'fa-user',
                    children: [{
                        name: 'Users backoffice',
                        path: '/userBack/list'
                    }, {
                        name: 'Users app',
                        path: '/userApp/list'
                    }, {
                        name: 'Users pro',
                        path: '/userPro/list'
                    }]
                },
                statistics: {
                    name: 'Statistics',
                    icon: 'fa-bar-chart',
                    children: [{
                        name: 'Content',
                        children: [{
                            name: 'Content by category',
                            path: '/statistics/content_category'
                        }, {
                            name: 'Content by features',
                            path: '/statistics/content_features'
                        }, {
                            name: 'Content by profile',
                            path: '/statistics/content_profile'
                        }, {
                            name: 'Content by day',
                            path: '/statistics/content_week_days'
                        }, {
                            name: 'Active content',
                            path: '/statistics/active_content'
                        }]
                    }, {
                        name: 'Plan matrix',
                        path: '/simulators/plan_matrix'
                    }, {
                        name: 'Comercial',
                        children: [{
                            name: 'Comercial list',
                            path: '/generic_list/list/comercial_list?view=Content'
                        }]
                    }, {
                        name: 'Marketing',
                        children: [{
                            name: 'Newsletter list',
                            path: '/generic_list/list/newsletter_list?view=Newsletter'
                        }]
                    }]
                },
                mapping: {
                    name: 'Mapping',
                    icon: 'fa-sitemap',
                    children: [{
                        name: 'Features',
                        path: '/mapping/feature'
                    }, {
                        name: 'Categories',
                        path: '/mapping/category'
                    }]
                },
                pied_piper: {
                    name: 'Pied piper',
                    icon: 'fa-pied-piper-alt',
                    children: [{
                        name: 'Curiosity',
                        path: '/curiosity/list'
                    }, {
                        name: 'Advertising',
                        path: '/advertising/list'
                    }]
                },
                configuration: {
                    name: 'Configuration',
                    icon: 'fa-wrench',
                    children: [{
                        name: 'Templates emails',
                        path: '/email_template/list'
                    }, {
                        name: 'Configuration services',
                        path: '/configuration_services/list'
                    }, {
                        name: 'Generic list',
                        path: '/generic_list/config'
                    }, {
                        name: 'Landmark map',
                        path: '/landmark_map'
                    }, {
                        name: 'Travel tips',
                        path: '/travel_tips/list'
                    }, {
                        name: 'Task manager',
                        path: '/task_manager'
                    }]
                }
            };

            $rootScope.sidebarCollapsed = false;

            //Go to sidebar's section
            $scope.goToSection = function(path) {
                if ($rootScope.sidebarCollapsed) {
                    $rootScope.sidebarCollapsed = false;
                }
                $location.path(path);
            };

            $scope.$apply();
        }
    ];
});
