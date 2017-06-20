
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);
    
    
    function Controller(UserService, ProductService, $scope,$http, $state, $stateParams,$window,FlashService) {
        //initialize variables 
        var vm = this;
        vm.user = null;
        vm.cats = [" ","Pies", "Cakes", "Cookies", "Breads", "Other Goodies"];
        vm.filters = vm.cats[0];
        
        //initialize user for that warm greeting!
        initController();
        //grab the products so your user isnt bored!
        prods();
        function initController() {
            // get current user
            UserService.GetCurrent()
                .then(function (user) {
                vm.user = user;
                })
                .catch(function(error){
                      vm.loggedin = "Not logged in";
                })
        }
        
        function prods(){
            ProductService.GetProducts().then(function (productlist){
                vm.productlist = productlist;
            })
        }
        
    

}})();