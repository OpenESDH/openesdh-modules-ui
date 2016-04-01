    angular
        .module('openeApp.openeDocs')
        .factory('openeDocsService', openeDocsService);
    
    function openeDocsService($http){
        return {
            getTemplates: getTemplates,
            createDocument: createDocument
        };
        
        function getTemplates(extensions){
            var params = {
                    extensions: extensions
            }
            return $http.get('/api/openesdh/docs/templates', {params: params}).then(function(result){
                return result.data;
            });
        }
        /**
         * props - object containing the following properties:
         * 
         * destination - nodeRef of the target folder,
         * templateRef - nodeRef of the template,
         * doc_type - nodeRef of the document type,
         * doc_category - nodeRef of the document category,
         * title,
         * description
         */
        function createDocument(props){
            return $http.post('/api/openesdh/docs', null, {params: props}).then(function(result){
                return result.data;
            });
        }
    }