'use strict';
app.controller('addPropertyCtrl', ['$scope', '$rootScope', '$localStorage', '$window', 'NgMap', 'Upload', function($scope, $rootScope, $localStorage, $window, NgMap, Upload) {
    $scope.initFirst = function() {
        $scope.property = {};
        $scope.property.error = {};
        $scope.property.validBasicInfo = false;
        $scope.property.validDetails = false;
    };
    $scope.numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'];
    $scope.units = ['SQFT', 'SQM'];
    $scope.ownerships = ['Freehold', 'Leasehold', 'Co-operative Societies', 'Power of Attorney'];
    $scope.uploadPic = function(file) {
        if (file) {
            $scope.property.photo = file;
            $scope.property.validBasicInfo = true;
            if ($scope.property.saleType === undefined) {
                $scope.property.error.saleType = "Please choose a sale type";
                $scope.property.validBasicInfo = false;
            }
            if ($scope.property.propertyType === undefined) {
                $scope.property.error.propertyType = "Please choose a property type";
                $scope.property.validBasicInfo = false;
            }
            if ($scope.property.address === undefined || $scope.property.address == '' || $scope.property.city == undefined || $scope.property.city == '' || $scope.property.name === undefined || $scope.property.name == '') {
                $scope.property.error.location = "All fields are required";
                $scope.property.validBasicInfo = false;
            }
        } else {
            $scope.property.error.saleType = "All fields are required."
        }
        if ($scope.property.validBasicInfo) {
            $scope.property.error = {};
            $scope.addPropertyTab = 2;
        }
    };

    $scope.onFileSelect = function(file) {
        if (file[0] === undefined) {
            $scope.property.photo = undefined;
            $scope.property.fileName = undefined;
            $scope.property.error.photo = "The file is too large. Maximum size is 2MB. Please choose another file.";
            console.log($scope.property.error.photo);
        } else {
            $scope.property.error.photo = undefined;
            $scope.property.fileName = file[0].name;
            console.log($scope.property.fileName);
        }
    };

    $scope.validateForm = function() {
        $scope.property.validDetails = true;
        if ($scope.property.price === undefined || $scope.property.price == '' || $scope.property.bathrooms === undefined || $scope.property.bedrooms === undefined) {
            $scope.property.error.details = "All fields are required";
            $scope.property.validDetails = false;
        }
        if ($scope.property.carpetArea === undefined || $scope.property.carpetArea == '' || $scope.property.builtUpArea === undefined || $scope.property.builtUpArea == '' || $scope.property.builtUpUnit === undefined || $scope.property.carpetUnit === undefined) {
            $scope.property.error.area = "Please specify carpet area and built-up area with units";
            $scope.property.validDetails = false;
        } else {
            var regex_num = /^\d+$/;
            if (!regex_num.test($scope.property.builtUpArea) || !regex_num.test($scope.property.carpetArea)) {
                $scope.property.error.area = "Please enter Valid input for Carpet and BuiltUp Areas";
                $scope.property.validDetails = false;
            }
        }
        if ($scope.property.transactionType === undefined || $scope.property.propertyFloor === undefined || $scope.property.totalFloors === undefined || $scope.property.ownership === undefined) {
            $scope.property.error.floors = "All fields are required";
            $scope.property.validDetails = false;
        }
        if ($scope.property.availability === undefined || $scope.property.description === undefined || $scope.property.totalFloors === undefined || $scope.property.ownership === undefined) {
            $scope.property.error.description = "All fields are required";
            $scope.property.validDetails = false;
        }
        if ($scope.property.validDetails && $scope.property.validBasicInfo) {
            /* if($scope.property.carpetUnit=='SQM'){
                 $scope.property.carpetArea = $scope.property.carpetArea/0.092903; // convert to SQFT
             }
             if($scope.property.builtUpUnit=='SQM'){
                 $scope.property.builtUpArea = $scope.property.builtUpArea/0.092903; // convert to SQFT
             }*/
            $scope.addProperty();
        } else
            $window.alert("Please check the form");
    };
    $scope.$on('gmPlacesAutocomplete::placeChanged', function() {
        console.log($scope.property.city.getPlace());
        $scope.property.address = $scope.property.city.getPlace().formatted_address;
        var location = $scope.property.city.getPlace().geometry.location;
        $scope.property.lat = location.lat();
        $scope.property.lng = location.lng();
        //$scope.property.name = $scope.property.city.getPlace().name;
        console.log($scope.property.lat);
        console.log($scope.property.lng);
        $scope.$apply();
    });

    $scope.addProperty = function() {
        Upload.upload({
            url: 'http://10.3.1.187:9000/realbuyapi/addProperty',
            headers: {
                'Authorization': $localStorage.JWT
            },
            data: {
                saleType: $scope.property.saleType,
                propertyType: $scope.property.propertyType,
                name: $scope.property.name,
                address: $scope.property.address,
                lng: $scope.property.lng,
                lat: $scope.property.lat,
                price: $scope.property.price,
                bathrooms: $scope.property.bathrooms,
                bedrooms: $scope.property.bedrooms,
                availability: $scope.property.availability,
                description: $scope.property.description,
                photo: $scope.property.photo,
                builtUpArea: $scope.property.builtUpArea,
                carpetArea: $scope.property.carpetArea,
                propertyFloor: $scope.property.propertyFloor,
                totalFloors: $scope.property.totalFloors,
                transactionType: $scope.property.transactionType,
                ownership: $scope.property.ownership
            }
        }).then(function(response) {
            if (response.status == 200) {
                $scope.initFirst();
                
                $rootScope.$emit("refreshProperties", {});
                showAddPropertySuccessAlert();
                $scope.addPropertyTab = 1;
            }
        }, function(response) {
            if (response.status == 401) {
                showAddPropertyFailureAlert();
            }
        });
    };

    $scope.addPropertyTab = 1;
    $scope.setAddPropertyTab = function(tab) {
        $scope.addPropertyTab = tab;
        console.log(tab);
    };

    $scope.isSetAddPropertyTab = function(tab) {
        return $scope.addPropertyTab == tab;
    };

    /* 
    $scope.showMap = false;
    $scope.toggleMap = function(){
        $scope.showMap = !$scope.showMap;
    };
    $scope.loc={};
    
     $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    console.log('location', $scope.place.geometry.location);
    $scope.loc=$scope.place.geometry.location;
    $scope.map.setCenter($scope.place.geometry.location);
  };
     
     $scope.placeMarker=function(){
         $scope.loc.lattitude=$scope.loc.lat();
         $scope.loc.longitude=$scope.loc.lng();
     };
     
     $scope.getPos=function(event){
         console.log("hi");
        $scope.loc.lattitude=event.latLng.lat();
        $scope.loc.longitude=event.latLng.lng();     
     };
    
    NgMap.getMap().then(function(map) {
    $scope.map = map;
  });
    */
}]);

/*
app.directive('popupMap', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog" id="map_width">' + 
            '<div class="modal-content" id="popupMap-content">' + 
              '<div class="modal-header" id="popupMap-header">' + 
                '<img src="Images/close_button.png" data-dismiss="modal" aria-hidden="true" id="map_close_button"></button>' +
              '</div>' + 
              '<div class="modal-body" id="popupMap-body" ng-transclude></div>' + 
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
*/