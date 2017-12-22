'use strict';

angular.module('confusionApp')
        //.constant("baseURL","http://localhost:3000/")
		.constant("baseURL","http://cooking-app.herokuapp.com/")
		
        .factory('$localStorage', ['$window', function ($window) {
            return {
                store: function (key, value) {
                    $window.localStorage[key] = value;
                },
                get: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                remove: function (key) {
                    $window.localStorage.removeItem(key);
                },
                storeObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function (key, defaultValue) {
                    return JSON.parse($window.localStorage[key] || defaultValue);
                }
            }
        }])


    .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){

        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;


        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.login = function(loginData) {

            $resource(baseURL + "users/login")
                .save(loginData,
                      function(response) {
                storeUserCredentials({username:loginData.username, token: response.token});
                $rootScope.$broadcast('login:Successful');
            },
                      function(response){
                isAuthenticated = false;

                var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Login Unsuccessful</h3></div>' +
                    '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                    '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                    </div>'

                ngDialog.openConfirm({ template: message, plain: 'true'});
            }

                     );

        };

        authFac.logout = function() {
            $resource(baseURL + "users/logout").get(function(response){
            });
            destroyUserCredentials();
        };

        authFac.isAuthenticated = function() {
            return isAuthenticated;
        };

        authFac.getUsername = function() {
            return username;  
        };

        loadUserCredentials();

        return authFac;

    }])
    

        .service('favouriteFactory', ['$resource', 'baseURL', function($resource, baseURL) {

            this.getFavourites = function(){
                return $resource(baseURL+"favourites/:username", null,  {'update':{method:'PUT'}});
            };

        }])

		
		.service('recipeFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    
            this.getRecipes = function(){
                return $resource(baseURL+"recipes/:id", null,  {'update':{method:'PUT' }});
            };
            
            this.getTags = function(){
                var tags = [
                    "breakfast", "lunch", "dinner", "brunch", "drink", "cocktail", "meal", "dessert",
                    "healthy", "fat",  "vegan", "sweet", "hot", "cold", "fresh",
                    "cake", "stew", "salad", "roasted", "grilled", "baked", "fried",
                    "meat", "fish", "vegetables", "chocolate", "fruit", "potato", "cheese",
                    "mexican", "chinese", "spanish"
                ];
                return tags;
            };
            
            this.getDefaultRecipeImage = function(){
                return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBoRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAARAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMC4xMwAA/9sAQwAqHSAlIBoqJSIlLy0qMj9pRD86Oj+BXGFMaZmGoJ6WhpORqL3yzaiz5bWRk9L/1eX6/////6PL///////y/////9sAQwEtLy8/Nz98RER8/66Trv///////////////////////////////////////////////////////////////////8AAEQgBLAHCAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8Ap780+NJGPyg0mnRiWQ7j0raSJVHAoAoxWjtyxqylmF5q2BgUvagCrjHFDLkU5+GppNADF+VqlBFQvSK9AFgnimU3dRuoAep+YVYPI4qizYGRVZb6RXK8EUAau1jS7TVBb6T+7T/tUjdqALopdwHU1nmWQ96PmPVqALck6qOtVWkLNUbDApqt81AE4yKaeTQx+Wkj5oAax5qWIcUeXuaplTYKAGPaLP8Aeqrd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";
            };

                        
        }])




		
        .service('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    
            this.getDishes = function(){
                return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
            };

            this.getPromotions = function(){
                return $resource(baseURL+"promotions/:id",null,  {'update':{method:'PUT' }});
            };
                        
        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    
            var corpfac = {};
    
            corpfac.getLeaders = function(){
                return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
            };
    
            return corpfac;
    
        }])

        .service('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL) {

            this.getFeedback = function(){
                return $resource(baseURL+"feedback/:id",null,  {'update':{method:'PUT' }});
            };

        }])

;
