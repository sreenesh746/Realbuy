var app = angular.module('realBuyApp', ['ui.bootstrap','ngMap','ngStorage','ui.router','ngFileUpload','gm']);
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("home");
    $stateProvider
    .state('home', {
        url: "/home",
        templateUrl: 'partials/main.html'
    })

    .state('search', {
        url: '/search',
        templateUrl: 'partials/search.html'
    })
});

/*
app.factory('searchProperty',function($rootScope){
    var searchedProperty = {};
    searchedProperty.properties = undefined;

    searchedProperty.prepForBroadcast = function(propertyList) {
        this.properties = propertyList;
        this.broadcastItem();
    };

    searchedProperty.broadcastItem = function() {
        $rootScope.$broadcast('handleSearch');
    };

    return searchedProperty;
    
});*/