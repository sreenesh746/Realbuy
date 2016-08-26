'use strict';
app.controller('addPropertyCtrl', ['$scope','$rootScope','$localStorage','$window', 'Upload', function ($scope,$rootScope,$localStorage, $window, Upload) {
    $scope.initFirst=function(){
    $scope.property= {
        saleType: '',
        propertyType: '',
        lat : '',
        lng : '',
        city:'',
        address: '',
        name: '',
        price: '',
        bathrooms: '',
        bedrooms: '',
        builtUpArea: '',
        builtUpUnit: '',
        carpetArea: '',
        carpetUnit: '',
        transactionType: '',
        propertyFloor: '',
        totalFloors: '',
        ownership: '',
        availability: '',
        description: '',
        photo: undefined,
        fileName : ''
    };
    };
    $scope.numbers = ['0','1','2','3','4','5','6','7','8','9','10','10+'];
    $scope.units = ['Square Feet','Square Meter'];
    $scope.ownerships = ['Freehold', 'Leasehold', 'Co-operative Societies', 'Power of Attorney'];
    $scope.uploadPic = function(file) {
        $scope.property.photo=file;
        console.log($scope.property.photo);
    };
    
    $scope.onFileSelect=function(file){
        $scope.property.fileName = file[0].name;
        console.log($scope.property.fileName);
    };
    
    $scope.validateForm= function() {
      console.log($scope.property); 
      $scope.addProperty();
    };
    $scope.$on('gmPlacesAutocomplete::placeChanged', function() {
        console.log($scope.property.city.getPlace());
      $scope.property.address=$scope.property.city.getPlace().formatted_address;
      var location = $scope.property.city.getPlace().geometry.location;
      $scope.property.lat = location.lat();
      $scope.property.lng = location.lng();
      $scope.property.name = $scope.property.city.getPlace().name;
      console.log($scope.property.lat);
      console.log($scope.property.lng);
      $scope.$apply();
  });
    
    $scope.addProperty=function(){
      Upload.upload({
      url: 'http://localhost:9000/realbuyapi/addProperty',
	  headers : {'Authorization':$localStorage.JWT},
      data: {saleType: $scope.property.saleType,
			 propertyType: $scope.property.propertyType,
			 name : $scope.property.name,
			 address : $scope.property.address,
			 lng : $scope.property.lng,
			 lat : $scope.property.lat,
			 price : $scope.property.price,
			 bathrooms : $scope.property.bathrooms,
			 bedrooms : $scope.property.bedrooms,
			 availability : $scope.property.availability,
			 description : $scope.property.description,			
			 photo: $scope.property.photo,
			 builtUpArea: $scope.property.builtUpArea,
			 carpetArea: $scope.property.carpetArea,
			 propertyFloor: $scope.property.propertyFloor,
             totalFloors: $scope.property.totalFloors,
			 transactionType: $scope.property.transactionType,
			 ownership: $scope.property.ownership
			}
    }).then(function(response){
        if(response.status==200) {
                $window.alert('Property Added');
                $rootScope.$emit("refreshProperties", {});
            }
        }, function(response){
          if(response.status==401) {
               $window.alert('Login to Add property');
          }
      });
    };
}]);