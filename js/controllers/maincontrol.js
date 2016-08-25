app.controller('mainCtrl', ['$scope','$rootScope','$window','$http','$localStorage','Upload', function ($scope,$rootScope, $window,$http,$localStorage,Upload){
    $scope.fetchAll=function()
    {
            var req = {
            method: 'GET',
            url: 'http://localhost:9000/realbuyapi'
        };
        $http(req).then(function(res){
            console.log(res);
            if(res.status==200) {
                //$window.alert('Successfully REtreived');
                $scope.Properties = res.data.data;
                console.log($scope.Properties);
            }
        });  
    }
    
    if($localStorage.JWT){
        $scope.loggedIn=true;
        console.log('logged In');
    }
    $scope.showLogin = false;
    $scope.toggleLogin = function(){
         console.log($localStorage.JWT);
        $scope.showLogin = !$scope.showLogin;
    };
    $scope.showSignUp = false;
    $scope.toggleSignUp = function(){
        $scope.toggleLogin();
        $scope.showSignUp = !$scope.showSignUp;
    };
    
    $scope.user = {
      name : '',
      email : '',
      password : '',
      confirmPassword: '',
      phone : '',
      address : '',
      avatar : undefined
    };
    
    $scope.validateSignUpForm=function(){
        console.log($scope.user);
        $scope.signUp();
    };
    
    $scope.signUp=function(){
      $scope.toggleSignUp();
      Upload.upload({
      url: 'http://localhost:9000/realbuyapi/signup',
      data: {name: $scope.user.name,
			 email: $scope.user.email,
			 address : $scope.user.address,
			 phone : $scope.user.phone,
			 password : $scope.user.password,
			 avatar : $scope.user.avatar
			}
    }).then(function(response){
        if(response.status==200) {
                $window.alert('Registration Successful');
            }
        }, function(response){
          $window.alert('Registration failed');
      });
        
    };
    
    $scope.validateLoginForm=function(){
        console.log($scope.user);
        $scope.login();
    };
    
    $scope.login=function(){
      var req = {
            method: 'POST',
            url: 'http://localhost:9000/realbuyapi/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { 
                email : $scope.user.email,
                password : $scope.user.password
            }
        };
        $http(req).then(function(res){
            console.log(res);
            if(res.status==200){
                $localStorage.JWT=res.data.token;
                $scope.loggedIn=true;
                $scope.toggleLogin();
                 console.log('logged In');
                console.log($localStorage.JWT);
                $window.alert('Successfully Logged In');
            }
        });    
    };
    
    $scope.logout=function(){
        $scope.loggedIn=false;
        delete $localStorage.JWT;
    }
    
    $scope.checkLogin=function(){
        if(!$scope.loggedIn){
            $scope.toggleLogin();
        }
    };
    
}]);
 app.directive('login', function () {
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
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  }); 

app.directive('signup', function () {
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
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });