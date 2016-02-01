    angular
        .module('openeApp.cases')
        .factory('projectRoomsService', projectRoomsService);
    
    function projectRoomsService($http){
        
        return {
            siteExists: siteExists
        };
        
        function siteExists(shortName){
            return $http.get('/api/openesdh/site/' + shortName + '/exists').then(function(response){
                return response.data;
            });            
        }
        
    }