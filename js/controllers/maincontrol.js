app.controller('mainCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$window', '$log', '$http', '$localStorage', 'Upload', function($scope, $rootScope, $state, $stateParams, $location, $window, $log, $http, $localStorage, Upload) {
    $rootScope.$on("refreshProperties", function() {
        $scope.fetchAll();
    });
    $scope.fetchAll = function() {
        var req = {
            method: 'GET',
            headers: {
                'Authorization': $localStorage.JWT
            },
            url: 'http://10.3.1.187:9000/realbuyapi'
        };
        $http(req).then(function(res) {
            console.log(res);
            if (res.status == 200) {
                //$window.alert('Successfully REtreived');

                $scope.Properties = res.data.data;
                $scope.favourites = $scope.Properties.favourites;
                delete $scope.Properties.favourites;
                if ($localStorage.JWT) {
                    angular.forEach($scope.Properties, function(propertyCategory, key) {
                        angular.forEach(propertyCategory, function(property, key) {
                            if ($scope.favourites.indexOf(property._id) !== -1) {
                                property.favourite = true;
                            } else {
                                property.favourite = false;
                            }
                        });
                    });
                }
                console.log($scope.Properties);
                $scope.featuredActivePage = 0;
            }
        });
    };

    $scope.prevPage = function() {
        $scope.featuredActivePage--;
        $scope.gotoPage($scope.featuredActivePage);
    };

    $scope.nextPage = function() {
        $scope.featuredActivePage++;
        $scope.gotoPage($scope.featuredActivePage);
    };

    $scope.gotoPage = function(page) {
        var req = {
            method: 'GET',
            headers: {
                'Authorization': $localStorage.JWT
            },
            url: 'http://10.3.1.187:9000/realbuyapi/featured',
            params: {
                page: page
            }
        };
        $http(req).then(function(res) {
            console.log(res);
            if (res.status == 200) {
                if (res.data.data.length > 0) {
                    $scope.endFeaturedPage = false;
                    $scope.Properties.featured = res.data.data;
                    if ($localStorage.JWT) {
                        angular.forEach($scope.Properties.featured, function(property, key) {
                            if ($scope.favourites.indexOf(property._id) !== -1) {
                                property.favourite = true;
                            } else {
                                property.favourite = false;
                            }
                        });
                    }
                } else {
                    $scope.endFeaturedPage = true;
                    $scope.featuredActivePage--;
                }
            }

        });
    };


    $scope.toggleFavourite = function(selectedProperty) {
        selectedProperty.favourite = !selectedProperty.favourite;
        angular.forEach($scope.Properties, function(propertyCategory, key) {
            angular.forEach(propertyCategory, function(currentProperty, key) {
                if (currentProperty._id == selectedProperty._id) {
                    currentProperty.favourite = selectedProperty.favourite;
                }
            });
        });
        $scope.updateFavourite(selectedProperty);
    };

    $scope.updateFavourite = function(property) {
        var req = {
            method: 'PUT',
            url: 'http://10.3.1.187:9000/realbuyapi/favourite',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $localStorage.JWT
            },
            data: {
                pid: property._id,
                flag: property.favourite
            }
        };
        $http(req).then(function(res) {
            console.log(res);
            if (res.status == 200) {
                if (property.favourite)
                    $scope.favourites.push(property._id);
                else
                    $scope.favourites.pop(property._id);
            }
        });
    };

    if ($localStorage.JWT) {
        $scope.loggedIn = true;
        console.log('logged In');
    }
    $scope.showLogin = false;
    $scope.toggleLogin = function() {
        console.log($localStorage.JWT);
        $scope.user = {};
        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
        $scope.showLogin = !$scope.showLogin;
    };
    $scope.showSignUp = false;
    $scope.toggleSignUp = function() {
        $scope.signUpForm.$setPristine();
        $scope.signUpForm.$setUntouched();
        $scope.toggleLogin();
        $scope.showSignUp = !$scope.showSignUp;
    };

    $scope.user = {};

    $scope.validateSignUpForm = function() {
        $scope.signUp();
    };

    $scope.signUp = function() {
        Upload.upload({
            url: 'http://localhost:9000/realbuyapi/signup',
            data: {
                name: $scope.user.name,
                email: $scope.user.email,
                address: $scope.user.address,
                phone: $scope.user.phone,
                password: $scope.user.password,
                avatar: $scope.user.avatar
            }
        }).then(function(response) {
            if (response.status == 200) {
                $scope.user = {};
                $scope.signUpForm.$setPristine();
                $scope.signUpForm.$setUntouched();
                $scope.signUpServerError = undefined;
                $scope.toggleSignUp();
                $window.alert('Registration Successful');

            }
        }, function(response) {
            console.log(response);
            $scope.signUpServerError = response.data.message;
            $scope.user.email = undefined;
            $scope.user.password = undefined;
            $scope.user.confirmPassword = undefined;
            $scope.signUpForm.$setPristine();
            $scope.signUpForm.$setUntouched();
        });

    };


    $scope.validateLoginForm = function() {
        /*if($scope.loginForm.$valid){
            
        }
        else {
        //if form is not valid set $scope.addContact.submitted to true     
            $scope.loginForm.submitted=true;
        }*/
        $scope.loginServerError = '';
        console.log($scope.user);
        $scope.login();
    };

    $scope.login = function() {
        var req = {
            method: 'POST',
            url: 'http://10.3.1.187:9000/realbuyapi/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                email: $scope.user.email,
                password: $scope.user.password
            }
        };
        $http(req).then(function(res) {
            console.log(res);
            if (res.status == 200) {
                $localStorage.JWT = res.data.token;
                $scope.user = {};
                $scope.loggedIn = true;
                $scope.toggleLogin();
                console.log('logged In');
                console.log($localStorage.JWT);
                $scope.fetchAll();
                showLoginSuccessAlert();
            }
        }, function(res) {
            $scope.loginServerError = res.data.message;
        });
    };

    $scope.logout = function() {
        $scope.loggedIn = false;
        delete $localStorage.JWT;
        $scope.fetchAll();
    }

    $scope.checkLogin = function() {
        if (!$scope.loggedIn) {
            $scope.toggleLogin();
        }
    };

    $scope.recentTab = 1;
    $scope.setRecentTab = function(tab) {
        $scope.recentTab = tab;
        console.log(tab);
    };

    $scope.isSetRecentTab = function(tab) {
        return $scope.recentTab == tab;
    };

    $scope.search = {};
    $scope.setSearchTab = function(tab) {
        $scope.search.option = tab;
        console.log(tab);
    };

    $scope.isSetSearchTab = function(tab) {
        return $scope.search.option == tab;
    };

    $scope.area_ranges = [
        '< 1000 SQFT',
        '1000 - 5000 SQFT',
        '5000-10000 SQFT',
        '> 10000 SQFT'
    ];

    $scope.status_filters = ['Ready To Move', 'Under Construction'];
    // pagination in search
    $scope.currentPage = 0;
    $scope.pageSize = 4;                
    $scope.numberOfPages=function(){
        return Math.ceil($scope.filteredProperties.length/$scope.pageSize);                
    }

    $scope.searchButtonClick = function() {

        console.log($scope.search);
        var req = {
            method: 'GET',
            headers: {
                'Authorization': $localStorage.JWT
            },
            url: 'http://10.3.1.187:9000/realbuyapi/search',
            params: {
                option: $scope.search.option,
                keywords: $scope.search.keywords
            }
        };
        $http(req).then(function(res) {
            $scope.Properties.searchProperties = res.data.data;
            console.log($scope.Properties.searchProperties);
            if ($localStorage.JWT) {
                angular.forEach($scope.Properties.searchProperties, function(property, key) {
                    if ($scope.favourites.indexOf(property._id) !== -1) {
                        property.favourite = true;
                    } else {
                        property.favourite = false;
                    }
                });
            }
            $scope.search={};
            $scope.filteredProperties = $scope.Properties.searchProperties;
            $state.go('search');
        });
    };
    $scope.filter={};
    
    /*$scope.filterProperties=function(){
      $scope.filteredProperties = $scope.Properties.searchProperties;
      if($scope.filter.status){
          console.log($scope.filter.status);
          angular.forEach($scope.filteredProperties,function(property,key){
              if(property.availability!=$scope.filter.status){
                  console.log('yes');
                  delete property;
              }
          });
      }
      if($scope.filter.areaRange){
          console.log($scope.filter.areaRange);
          angular.forEach($scope.filteredProperties,function(property,key){
              switch($scope.filter.areaRange){
                  case '< 1000 SQFT': 
                      if(property.builtUpArea >= 1000){
                          delete property;
                      }
                      break;
                  case '1000 - 5000 SQFT':
                      if(property.builtUpArea < 1000 || property.builtUpArea >5000){
                          delete property;
                      }
                      break;
                  case '5000-10000 SQFT':
                      if(property.builtUpArea < 5000 || property.builtUpArea >10000){
                          delete property;
                      }
                      break;
                  case '> 10000 SQFT': 
                      if(property.builtUpArea < 10000){
                          delete property;
                      }
                      break;
              }
          });
    }
        console.log($scope.filteredProperties);
    };*/
    
    $scope.filterProperties=function(){
      $scope.filteredProperties = angular.copy($scope.Properties.searchProperties);
      console.log($scope.Properties.searchProperties);
      if($scope.filter.searchFilterTab){
          console.log('yes');
          for (var i = $scope.filteredProperties.length - 1; i >= 0; i--) {
              switch($scope.filter.searchFilterTab){
                  case 1: if($scope.filteredProperties[i].propertyType!='COMMERCIAL')
                                 $scope.filteredProperties.splice(i,1);
                          break;
                  case 2: if($scope.filteredProperties[i].propertyType!='FURNISHED HOMES')
                                 $scope.filteredProperties.splice(i,1);
                          break;
                  case 3: if($scope.filteredProperties[i].propertyType!='LAND AND PLOT')
                                 $scope.filteredProperties.splice(i,1);
                          break;
                  case 4: if($scope.filteredProperties[i].propertyType!='RENTAL')
                                 $scope.filteredProperties.splice(i,1);
                          break;
              }
          }
      }
      if($scope.filter.status){
          console.log('yes');
          console.log($scope.filter.status);
          for (var i = $scope.filteredProperties.length - 1; i >= 0; i--) {
              if($scope.filteredProperties[i].availability!=$scope.filter.status){
                  console.log('yes');
                  $scope.filteredProperties.splice(i,1);
              }
          }
      }
      if($scope.filter.areaRange){
          console.log('yes');
          console.log($scope.filter.areaRange);
           for (var i = $scope.filteredProperties.length - 1; i >= 0; i--) {
              switch($scope.filter.areaRange){
                  case '< 1000 SQFT': 
                      if($scope.filteredProperties[i].builtUpArea >= 1000){
                          $scope.filteredProperties.splice(i,1);
                      }
                      break;
                  case '1000 - 5000 SQFT':
                      if($scope.filteredProperties[i].builtUpArea < 1000 || $scope.filteredProperties[i].builtUpArea >5000){
                          $scope.filteredProperties.splice(i,1);
                      }
                      break;
                  case '5000-10000 SQFT':
                      if($scope.filteredProperties[i].builtUpArea < 5000 || $scope.filteredProperties[i].builtUpArea >10000){
                          $scope.filteredProperties.splice(i,1);
                      }
                      break;
                  case '> 10000 SQFT': 
                      if($scope.filteredProperties[i].builtUpArea < 10000){
                          $scope.filteredProperties.splice(i,1);
                      }
                      break;
              }
          }
    }
        console.log($scope.filteredProperties);
    };
    
    $scope.isSetSearchFilterTab = function(tab){
        return $scope.filter.searchFilterTab==tab;
    };
    
    $scope.setSearchFilterTab = function(tab){
        $scope.filter.searchFilterTab=tab;
        $scope.filterProperties();
    };



}]);
app.directive('login', function() {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});

app.directive('signup', function() {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content" id="signup-content">' +
            '<div class="modal-header" id="signup-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" id="signup-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);