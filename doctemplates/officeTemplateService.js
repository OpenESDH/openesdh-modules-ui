
angular
        .module('openeApp.doctemplates')
        .factory('officeTemplateService', officeTemplateService);

function officeTemplateService($http, alfrescoNodeUtils, ALFRESCO_URI, notificationUtilsService) {

    var lastFetch = 0;

    return {
        getTemplates: getTemplates,
        deleteTemplate: deleteTemplate,
        getTemplate: getTemplate,
        fillTemplate: fillTemplate,
        fillTemplateToCaseFolder: fillTemplateToCaseFolder,
        fillAndSendToEmail: fillAndSendToEmail,
        fillAndSendToAddo: fillAndSendToAddo,
        uploadTemplate: uploadTemplate,
        getCardViewThumbnail: getCardViewThumbnail
    };

    function getTemplates() {
        return $http.get('/api/openesdh/officetemplates').then(function(response) {
            return response.data;
        });
    }

    function getTemplate(nodeRef) {
        return $http.get('/api/openesdh/officetemplates/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function(response) {
            return response.data;
        });
    }

    /**
     * Deletes a template given its noderef
     * @param nodeRef
     * @returns {*}
     */
    function deleteTemplate(nodeRef) {
        return $http.delete('/api/openesdh/officeDocTemplate/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri).then(function(response) {
            return response.data;
        });
    }

    /**
     * Fill the given template with the field data.
     *
     * The return value is a promise which returns a Blob containing
     * the filled in template.
     * @param nodeRef
     * @param caseId
     * @param fieldData
     * @returns {*}
     */
    function fillTemplate(nodeRef, caseId, fieldData) {
        return _fill("/fill", nodeRef, caseId, fieldData)
                .then(function(response) {
                    return {
                        blob: new Blob([response.data], {
                            type: response.headers('Content-Type')
                        }),
                        zip: response.headers('Content-Type').indexOf('application/zip') > -1
                    };
                });
    }

    function fillTemplateToCaseFolder(nodeRef, caseId, fieldData, targetFolderRef) {
        
        return _fillToFolder('', nodeRef, caseId, fieldData, targetFolderRef);
    }

    function fillAndSendToEmail(nodeRef, caseId, fieldData, targetFolderRef) {
        return _fillToFolder('/fillToEmail', nodeRef, caseId, fieldData, targetFolderRef);
    }

    function fillAndSendToAddo(nodeRef, caseId, fieldData, targetFolderRef) {
        return _fillToFolder('/fillToAddo', nodeRef, caseId, fieldData, targetFolderRef);
    }
    
    function _fillToFolder(endpoint, nodeRef, caseId, fieldData, targetFolderRef){
        return $http.post('/api/openesdh/template/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/case/" + caseId 
                    + '/folder/' + alfrescoNodeUtils.processNodeRef(targetFolderRef).uri + endpoint,
                {fieldData: fieldData},
                {responseType: 'arraybuffer'}
        ).then(function(response) {
            return true;
        });
    }

    function _fill(endpoint, nodeRef, caseId, fieldData) {
        return $http.post('/api/openesdh/template/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + "/case/" + caseId + endpoint,
                {fieldData: fieldData},
                {responseType: 'arraybuffer'}
        );
    }

    function uploadTemplate(formData) {
        var tmplFileData = new FormData();
        tmplFileData.append("filedata", formData.fileToUpload);
        tmplFileData.append("filename", formData.fileToUpload.name);
        angular.forEach(formData.templateProperties, function(value, key) {
            tmplFileData.append(key, value);
        });

        return $http.post('/api/openesdh/officeDocTemplate', tmplFileData, {
            transformRequest: angular.identity, headers: {'Content-Type': undefined}
        }).then(function(response) {
            return response.data;
        });
    }

    function getTime() {
        var cur = new Date().getTime();
        if (cur - lastFetch > 5000)
            lastFetch = cur;
        return lastFetch;
    }

    function getCardViewThumbnail(nodeRef, thumbnailName) {
        var nodeRefAsLink = nodeRef.replace(":/", ""),
                noCache = "&noCache=" + getTime(),
                force = "c=force";
        return ALFRESCO_URI.webClientServiceProxy + "/api/node/" + nodeRefAsLink + "/content/thumbnails/" + (thumbnailName ? thumbnailName : "cardViewThumbnail") + "?" + force + noCache;
    }
}