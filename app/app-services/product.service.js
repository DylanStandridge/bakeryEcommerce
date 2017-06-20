(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProductService', Service);

    //these services make HTTP requests and since they are the product services the requests go to the server, not mongoskin under the API directory
    
    function Service($http, $q) {
        var service = {};

        service.GetProducts = GetProducts;
        service.remove = remove;
        service.removepic = removepic;

        return service;
        
         function removepic(product){
            return $http.delete('/app/removepic/' + product.url).then(handleSuccess, handleError);
        }
        function remove(_id){
            return $http.delete('/app/deleteone/' + _id).then(handleSuccess, handleError);
        }
        function GetProducts(){
            return $http.get('/app/allproducts').then(handleSuccess, handleError);
        }

        // Handles the data based upon fail or success...
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
        
    }

})();
