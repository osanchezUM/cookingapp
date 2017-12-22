'use strict';

angular.module('confusionApp')

        .directive("fileread", [function () {
            return {
                scope: {
                    fileread: "="
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        var reader = new FileReader();
                        reader.onload = function (loadEvent) {
                            scope.$apply(function () {
                                scope.fileread = loadEvent.target.result;
                            });
                        }
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    });
                }
            }
        }])







        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );

                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
            
            $scope.sendFeedback = function() {
                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    feedbackFactory.getFeedback().save($scope.feedback, 
                        function(response){
                            $scope.invalidChannelSelection = false;
                            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                            $scope.feedback.mychannel="";
                            $scope.feedbackForm.$setPristine();
                            console.log($scope.feedback);
                        }, function(response){
                            console.log('Not saved');
                        }
                    );
                }
            };
            
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
                .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.dishComment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.dishComment.date = new Date().toISOString();
                console.log($scope.dishComment);
                
                $scope.dish.comments.push($scope.dishComment);
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                $scope.dishComment = {rating:5, comment:"", author:"", date:""};
            };

        }])

        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory){
            
            $scope.showLeader = false;
            $scope.leaderMessage="Loading ...";

            corporateFactory.getLeaders().query()
                .$promise.then(
                function(response){
                    $scope.leaders = response;
                    $scope.showLeader = true;
                },
                function(response) {
                    $scope.leaderMessage = "Error: "+response.status + " " + response.statusText;
                }
            );

        }])








        // implement the IndexController and About Controller here
        .controller('IndexController', ['$rootScope', '$scope', '$state', 'recipeFactory', 'favouriteFactory', 
                                        function($rootScope, $scope, $state, recipeFactory, favouriteFactory){
            $scope.showRecipes = false;
            $scope.loadingMessage= "Loading ...";
            $scope.favourites = [];

            $scope.seeDetail = function(num){
                var params = {"id":num};
                $state.go('app.recipedetails', params);
            };
            
            recipeFactory.getRecipes().query().$promise.then(
                function(response){
                    $scope.recipes = response;
                    $scope.showRecipes = true;
                },
                function(response) {
                    $scope.loadingMessage = "Error: "+response.status + " " + response.statusText;
                }
            );
                                            
            //console.log("(Favourites) getFavourites (get by username): " + $rootScope.username);
            
            if (typeof $rootScope.username != 'undefined'){
                favouriteFactory.getFavourites().get({username:$rootScope.username}).$promise.then(
                    function(response){
                        //console.log(response);
                        $scope.favourites = response.recipes.map(function(r){
                            return r._id;
                        });
                    },
                    function(response) {
                        // This happens when there are no favourites for the user
                        console.log("Error: "+response);
                    }
                );
            }
            
            //console.log($scope.favourites);
            
            
            $scope.addFavourite = function(recipeId){
                var fav = {username:$scope.username, recipeId: recipeId};
                favouriteFactory.getFavourites().update({username:$scope.username}, fav).$promise.then(
                    function(response){
                        $state.go('app', {}, {reload: true});
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
                );
            };

        }])


        .controller('RecipeDetailController', ['$scope', '$stateParams', 'recipeFactory', 
                                               function($scope, $stateParams, recipeFactory) {
            $scope.showRecipe = false;
            $scope.message="Loading ...";
            
            $scope.recipe = recipeFactory.getRecipes().get({id:$stateParams.id})
                .$promise.then(
                function(response){
                    $scope.recipe = response;
                    $scope.recipe.ingredientList = $scope.recipe.ingredients.split(";");
                    $scope.recipe.directionList = $scope.recipe.directions.split(";");
                    $scope.showRecipe = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
        }])


        .controller('RecipeEditController', ['$scope', '$state', '$stateParams', 'recipeFactory', 
                                             function($scope, $state, $stateParams, recipeFactory) {
            $scope.showRecipe = false;
            $scope.message = "Loading ...";
            $scope.showFileError = false;
            $scope.levels = ["easy", "medium", "hard"];
            
            $scope.recipe = recipeFactory.getRecipes().get({id:$stateParams.id})
                .$promise.then(
                function(response){
                    $scope.recipe = response;
                    $scope.recipe.ingredientList = $scope.recipe.ingredients.split(";");
                    $scope.recipe.directionList = $scope.recipe.directions.split(";");
                    if (!$scope.recipe.author){
                        $scope.recipe.author = noAuthor;
                    }
                    $scope.allKeywords = recipeFactory.getTags();
                    $scope.showRecipe = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            
            $scope.saveRecipe = function(){
                if (isValidImage($scope.recipe.image)){
                    recipeFactory.getRecipes().update({id:$scope.recipe._id}, $scope.recipe).$promise.then(
                        function(response){
                            $state.go('app.recipedetails', {"id":$scope.recipe._id});
                        },
                        function(response) {
                            $scope.message = "Error: "+response.status + " " + response.statusText;
                        }
                    );
                }else{
                    $scope.showFileError = true;
                }
            };
            
        }])


        .controller('RecipeNewController', ['$scope', '$state', 'recipeFactory', 
                                            function($scope, $state, recipeFactory) {
            $scope.showRecipe = true;
            $scope.message = "Loading ...";
            $scope.showFileError = false;
            $scope.levels = ["easy", "medium", "hard"];
            $scope.allKeywords = recipeFactory.getTags();
            $scope.recipe = {
                name: "",
                description: "",
                servings: 4,
                time: 10,
                level: "easy",
                keywords: [],
                author:$scope.username, 
                image: recipeFactory.getDefaultRecipeImage(),
                ingredients: "",
                directions: ""
            };
            
            /*
            function toDataURL(url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        callback(reader.result);
                    }
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', url);
                xhr.responseType = 'blob';
                xhr.send();
            }
            toDataURL('images/newrecipe.jpg', function(dataUrl) {
                $scope.recipe.image = dataUrl;
            });
            console.log($scope.recipe);
            */
            

            $scope.saveRecipe = function(){
                if (isValidImage($scope.recipe.image)){
                    recipeFactory.getRecipes().save($scope.recipe).$promise.then(
                        function(response){
                            $state.go('app.recipedetails', {"id":response._id});
                        },
                        function(response) {
                            $scope.message = "Error: "+response.status + " " + response.statusText;
                        }
                    );
                }else{
                    $scope.showFileError = true;
                }
            };
            
            

        }])


        // 
        .controller('MyRecipesController', ['$rootScope', '$scope', '$state', 'recipeFactory', 
                                            function($rootScope, $scope, $state, recipeFactory){                                 
            $scope.showRecipes = false;
            $scope.loadingMessage= "Loading ...";

            $scope.seeDetail = function(recipeId){
                $state.go('app.recipedetails', {"id":recipeId});
            };
            
            $scope.addRecipe = function(){
                $state.go('app.recipenew', {});
            };
            
            $scope.editRecipe = function(recipeId){
                $state.go('app.recipeedit', {"id":recipeId});
            };
            
            $scope.deleteRecipe = function(recipeId){
                //console.log(recipeId);
                recipeFactory.getRecipes().delete({id:recipeId}).$promise.then(
                    function(response){
                        $state.go('app.myrecipes', {}, {reload: true});
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
                );
            };
            
            //console.log("(MyRecipes) getRecipes (query by author): " + $rootScope.username);

            recipeFactory.getRecipes().query({author:$rootScope.username}).$promise.then(
                function(response){
                    $scope.recipes = response;
                    $scope.showRecipes = true;
                },
                function(response) {
                    $scope.loadingMessage = "Error: "+response.status + " " + response.statusText;
                }
            );

        }])


        // 
    .controller('FavouritesController', ['$rootScope', '$scope', '$state', 'favouriteFactory', function($rootScope, $scope, $state, favouriteFactory){
            $scope.showRecipes = false;
            $scope.loadingMessage= "Loading ...";
            
            $scope.deleteFavourite = function(recipeId){
                var fav = {username:$rootScope.username, recipeId: recipeId};
                favouriteFactory.getFavourites().delete(fav).$promise.then(
                    function(response){
                        $state.go('app.favourites', {}, {reload: true});
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
                );
            };
            
            favouriteFactory.getFavourites().get({username:$rootScope.username}).$promise.then(
                function(response){
                    $scope.recipes = response.recipes;
                    $scope.showRecipes = true;
                },
                function(response) {
                    $scope.loadingMessage = "Error: "+response.status + " " + response.statusText;
                }
            );
            
        }])


        .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', 
                                        function ($scope, ngDialog, $localStorage, AuthFactory) {

            $scope.loginData = $localStorage.getObject('userinfo','{}');
            
            /*
            if (!$scope.loginData.hasOwnProperty('username')){
                $scope.loginData.username = 'test';
                $scope.loginData.password = 'test';
            }
            */

            $scope.doLogin = function() {
                if($scope.rememberMe)
                    $localStorage.storeObject('userinfo',$scope.loginData);

                AuthFactory.login($scope.loginData);

                ngDialog.close();

            };

        }])


        .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', 
                                         function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

             $rootScope.state = $state;

             $scope.loggedIn = false;
             $scope.username = '';

             if(AuthFactory.isAuthenticated()) {
                 $scope.loggedIn = true;
                 $scope.username = AuthFactory.getUsername();
                 $rootScope.loggedIn = true;
                 $rootScope.username = AuthFactory.getUsername();
             }

             $scope.openLogin = function () {
                 ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
             };

             $scope.logOut = function() {
                 AuthFactory.logout();
                 $scope.loggedIn = false;
                 $scope.username = '';
                 $rootScope.loggedIn = false;
                 $rootScope.username = '';
                 $state.go('app', {}, {reload: true});
             };

             $rootScope.$on('login:Successful', function () {
                 $scope.loggedIn = AuthFactory.isAuthenticated();
                 $scope.username = AuthFactory.getUsername();
                 $rootScope.loggedIn = AuthFactory.isAuthenticated();
                 $rootScope.username = AuthFactory.getUsername();
                 $state.go('app', {}, {reload: true});
             });

            /*
             $rootScope.$on('registration:Successful', function () {
                 $scope.loggedIn = AuthFactory.isAuthenticated();
                 $scope.username = AuthFactory.getUsername();
             });
            */
            

        }])

;


function isValidImage(imageStr){
    var size = (imageStr.length - 25) * 6 / 8 / 1024;
    if (size > 0 && size <= 50 && (
        imageStr.indexOf("image/png") != -1 || 
        imageStr.indexOf("image/jpg") != -1 || 
        imageStr.indexOf("image/jpeg") != -1 || 
        imageStr.indexOf("image/gif") != -1 )
       ){
       return true; 
    }else{
        return false;
    }
}
