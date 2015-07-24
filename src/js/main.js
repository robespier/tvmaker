var app = angular.module('tvmaker', ['ngMaterial', 'LocalStorageModule']);

app.config(function($mdThemingProvider, localStorageServiceProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('teal')
        .accentPalette('red');

    localStorageServiceProvider
        .setPrefix('tvm');
});
