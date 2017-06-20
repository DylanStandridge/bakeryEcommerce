
(function () {
    'use strict';

    angular
        .module('app')
        .controller('admin.adminctrl', Controller);
    
    
    function Controller(UserService, ProductService, $scope,$http, $state, $stateParams,$window,FlashService) {
        //initialize random variables
        var vm = this;
        vm.user = null;
        vm.remove = remove;
        vm.removepic = removepic;
        vm.cats = [" ","Pies", "Cakes", "Cookies", "Breads", "Other Goodies"];
        vm.filters = vm.cats[0];
        initController();
        prods();
        
        //checks to see if its the admin for ng-show in the view
        $scope.admin = function(data){
        if (data == "bakeadmin")
            return true;
        else
            return false;
            };
        // grabs the current user to validate that its the admin through Userservice
        function initController() {
            // get current user
            UserService.GetCurrent()
                .then(function (user) {
                vm.user = user;
               if (vm.user.username !== 'bakeadmin')  {
                $window.location ='/';
        } 
            })
            .catch(function(error){
                 $window.location ='/';   
                   })
        }
        // grabs the products to view from Product Service
        function prods(){
            ProductService.GetProducts().then(function (productlist){
                vm.productlist = productlist;
            })
        }
        // removes the product in the db with ProductService
        function remove(product) {
            ProductService.remove(product._id)
                .then(function () {   
                })
                .catch(function (error) {
                    FlashService.Error(error);
                })  
            
        }
        // removes the products picture through calling my ProductService
        function removepic(product){
            console.log(product)
        ProductService.removepic(product)
                    .then(function() {
                     FlashService.Success(product.name);
                    }) 
                     .catch(function (error) {
                            FlashService.Error(error);
                        });
          
       
    }
}})();