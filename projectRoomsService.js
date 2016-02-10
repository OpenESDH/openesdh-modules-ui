    angular
        .module('openeApp.projectRooms')
        .factory('projectRoomsService', projectRoomsService);
    
    function projectRoomsService($http){
        
        return {
            siteExists: siteExists,
            createSite: createSite,
            getCaseSites: getCaseSites,
            getSite: getSite,
            getSiteDocuments: getSiteDocuments
        };
        
        function siteExists(shortName){
            return $http.get('/api/openesdh/site/' + shortName + '/exists').then(function(response){
                return response.data;
            });            
        }
        
        function createSite(caseSite){
            return $http.post('/api/openesdh/case/sites', caseSite).then(function(response){
                return response;
            });
        }
        
        function getCaseSites(caseId){
            return $http.get('/api/openesdh/case/' + caseId + '/sites').then(function(response){
                return response.data;
            });
        }
        
        function getSite(shortName){
            return $http.get('/api/openesdh/sites/' + shortName).then(function(response){
                return response.data;
            });
        }
        
        function getSiteDocuments(shortName){
            return $http.get('/api/openesdh/sites/' + shortName + '/documents').then(function(response){
                return response.data;
            });
        }
        
    }