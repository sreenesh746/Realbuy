var app = angular.module('realBuyApp', ['ui.bootstrap','ngMap','ngStorage','ui.router','ngFileUpload','gm']);
app.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /index
      //$urlRouterProvider.otherwise('/')
      $stateProvider
        .state('recent_commercial', {
            url: ('/recent-properties'),
           views: {
      'recent_ui_view': {
        templateUrl: 'partials/commercial.html'
       // controller: 'addPropertyCtrl'
      }
    }
        })
        
          
        .state('recent_furnished', {
            //url: ('/recent-properties'),
           views: {
     'recent_ui_view': {
        templateUrl: 'partials/furnished.html'
       // controller: 'addPropertyCtrl'
      }
    }
        })
      
        .state('recent_land_and_plot', {
           //url: ('/recent-properties'),
           views: {
      'recent_ui_view': {
        templateUrl: 'partials/landAndPlot.html'
       // controller: 'addPropertyCtrl'
      }
    }
        })
      
        .state('recent_rental', {
            //url: ('/recent-properties'),
           views: {
     'recent_ui_view': {
        templateUrl: 'partials/rental.html'
       // controller: 'addPropertyCtrl'
      }
    }
        })
      
        .state('add_basic_info', {
          url: ('/add-property'),
             views: {
      'add_property_ui_view': {
        templateUrl: 'partials/addpropertybasic.html'
      // controller: 'addPropertyCtrl'
      }
    }
    })
      
     .state('add_details', {
          //url: ('/add-property'),
             views: {
      'add_property_ui_view': {
        templateUrl: 'partials/addpropertydetails.html'
       // controller: 'addPropertyCtrl'
      }
    }
    })
          
    });