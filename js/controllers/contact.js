app.controller('contactCtrl', function($scope,NgMap,$http, $window,$localStorage) {
    console.log($localStorage.JWT);
    NgMap.getMap().then(function(map) {
        console.log(map.getCenter())
    });
     $scope.customIcon = {
        "scaledSize": [29, 37],
        "url": "Images/Location_white.png"
    };
    $scope.name='';
    $scope.email='';
    $scope.phone='';
    $scope.message='';
    $scope.error='';
    $scope.validateInput=function() {
       var valid=true;
       var emailError='';
       var phoneError=''; 
       var emailReg = /^([\w-\.]+@([\w+\.])+[\w-]{1,4})?$/;
       var phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
       if (!emailReg.test($scope.email)||$scope.email=='') {
                emailError = 'Invalid email. ';
                console.log(emailError);
                valid=false;
        }
        if(!phoneReg.test($scope.phone)) {
            phoneError = 'Invalid Phone.';
            console.log(phoneError);
            valid=false;
        }
        if($scope.email==''||$scope.phone==''||$scope.name==''||$scope.message=='')
        {
                valid=false;
                $scope.error='All fields are required. ';
        }
        $scope.error+=emailError+phoneError;
        if(valid)
            $scope.postContactMessage();
            
    };
    $scope.postContactMessage = function()
    {
       var req = {
            method: 'POST',
            url: 'http://localhost:9000/realbuyapi/contact',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { 
                name: $scope.name,
                email : $scope.email,
                phone : $scope.phone,
                message : $scope.message
            }
        };
        $http(req).then(function(res){
            console.log(res);
            if(res.status==200)
                $window.alert('Successfully Posted');
        });  
    };

});