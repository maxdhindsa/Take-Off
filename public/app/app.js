angular.module('app',['appRoutes','mainCtrl','authenticationService'])


.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})



