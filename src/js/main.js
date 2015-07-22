var app = angular.module('tvmaker', ['ngMaterial']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('teal')
        .accentPalette('red');
});
