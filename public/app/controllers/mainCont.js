angular.module('mainCtrl', [])
    .controller('MainController', function($rootScope, $location, Auth) {
        var vm = this;

        vm.loggedIn = false;

        vm.doLogin = function() {
            vm.processing = true;

            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function(data) {
                    vm.processing = false;
                    $rootScope.city1 = (data[Object.keys(data)[0]]);
                    $rootScope.city2 = (data[Object.keys(data)[1]]);
                    $location.path('/result');
            })
        }

        vm.doLogout= function () {
            Auth.logout();
            //redirect user to home
            $location.path('/logout');
        }
    });
