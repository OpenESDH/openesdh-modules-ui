    angular
        .module('openeApp.projectRooms')
        .factory('projectRoomsService', projectRoomsService);
    
    function projectRoomsService($http){
        
        return {
            siteExists: siteExists,
            createSite: createSite,
            getSites: getSites,
            getCaseSites: getCaseSites,
            getSite: getSite,
            getSiteDocuments: getSiteDocuments,
            getSiteDocumentsWithAttachments: getSiteDocumentsWithAttachments,
            updateCaseSite: updateCaseSite,
            closeSite: closeSite
        };
        
        function siteExists(shortName){
            return $http.get('/api/openesdh/site/' + shortName + '/exists').then(function(response){
                return response.data;
            });            
        }
        
        function getSites(){
            return $http.get('/api/openesdh/case/sites').then(function(response){
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
        
        function updateCaseSite(site){
            return $http.put('/api/openesdh/case/sites', site).then(function(response){
                return response;
            });
        }
        
        function getSiteDocumentsWithAttachments(shortName){
            return $http.get('/api/openesdh/case/sites/' + shortName + '/documents').then(function(response){
                return response.data;
            });
        }
        
        function closeSite(site){
            return $http.post('/api/openesdh/case/sites/close', site).then(function(response){
                return response.data;
            });
        }
        
    }