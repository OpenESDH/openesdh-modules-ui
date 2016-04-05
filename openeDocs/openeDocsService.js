    angular
        .module('openeApp.openeDocs')
        .factory('openeDocsService', openeDocsService);
    
    function openeDocsService($http, alfrescoUploadService, alfrescoNodeUtils){
        return {
            getTemplates: getTemplates,
            getTemplatesFolderRef: getTemplatesFolderRef, 
            createDocument: createDocument,
            uploadTemplate: uploadTemplate,
            updateTemplate: updateTemplate
        };
        
        function getTemplates(extensions){
            var params = {};
            if(extensions != undefined && extensions.length > 0){
                params.extensions = extensions;
            }
            return $http.get('/api/openesdh/docs/templates', {params: params}).then(function(result){
                return result.data;
            });
        }
        
        function getTemplatesFolderRef(){
            return $http.get('/api/openesdh/docs/templates/folder').then(function(result){
                return result.data.nodeRef;
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
        
        function uploadTemplate(templateFile, templatesFolder, templateProps){
            return alfrescoUploadService.uploadFile(templateFile, templatesFolder, templateProps);
        }
        
        function updateTemplate(templateRef, props){
            return $http.put('/api/openesdh/docs/template/' + alfrescoNodeUtils.processNodeRef(templateRef).uri, null, {params: props});
        }
    }