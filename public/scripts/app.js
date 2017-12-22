'use strict';

angular.module('confusionApp', ['ui.router', 'ngResource', 'ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'IndexController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'                  
                    }
                }
            })

            // route for the menu page
            .state('app.menu', {
                url: 'menu',
                views: {
                    'content@': {
                        templateUrl : 'views/menu.html',
                        controller  : 'MenuController'
                    }
                }
            })

            // route for the recipe details page
            .state('app.recipedetails', {
                url: 'recipe/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/recipedetail.html',
                        controller  : 'RecipeDetailController'
                   }
                }
            })
    
            // route for the recipe edit page
            .state('app.recipeedit', {
                url: 'recipe/:id/edit',
                views: {
                    'content@': {
                        templateUrl : 'views/recipeedit.html',
                        controller  : 'RecipeEditController'
                    }
                }
            })
    
            // route for the new recipe page
            .state('app.recipenew', {
                url: 'create',
                views: {
                    'content@': {
                        templateUrl : 'views/recipeedit.html',
                        controller  : 'RecipeNewController'
                    }
                }
            })
    
        // route for my recipes
        .state('app.myrecipes', {
            url: 'myrecipes',
            views: {
                'content@': {
                    templateUrl : 'views/myrecipes.html',
                    controller  : 'MyRecipesController'
                }
            }
        })
    
        // route for my favourite recipes
        .state('app.favourites', {
            url: 'favourites',
            views: {
                'content@': {
                    templateUrl : 'views/favourites.html',
                    controller  : 'FavouritesController'
                }
            }
        })
    
        // route for the login page
        .state('app.login', {
            url: 'login',
            views: {
                'content@': {
                    templateUrl : 'views/login.html',
                    controller  : 'LoginController'
                }
            }
        })
    
        ;
    
        $urlRouterProvider.otherwise('/');
    })
;
