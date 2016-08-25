app.controller('HomeCtrl', function($scope,$localStorage){
console.log($localStorage.JWT);
$scope.myInterval = 3000;
  $scope.slides = [
    {
      image: './Images/carousel0.png',
      title: 'DesaiDD Valley',
      price: '80-90 Lakhs',
      area: '7,789 SQFT',
      bedroom: 5,
      bathroom: 5
    },
    {
      image: './Images/carousel2.png',
      title: 'Mariot',
      price: '100-120 Lakhs',
      area: '5,789 SQFT',
      bedroom: 5,
      bathroom: 4
    },
    {
      image: './Images/carousel3.png',
      title: 'Hill View Resort',
      price: '60-70 Lakhs',
      area: '8,658 SQFT',
      bedroom: 4,
      bathroom: 3
    },
    {
      image: './Images/carousel6.png',
      title: 'Copper Castle',
      price: '70-80 Lakhs',
      area: '6,542 SQFT',
      bedroom: 5,
      bathroom: 4
    }
  ];
  
});
