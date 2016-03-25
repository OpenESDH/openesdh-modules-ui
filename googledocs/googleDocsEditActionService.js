angular
        .module('openeApp.google.docs')
        .factory('googleDocsEditActionService', GoogleDocsEditActionService);
function GoogleDocsEditActionService(googleDocsService) {

    var service = {
        execute: execute,
        executeFileAction: executeFileAction,
        executeCaseDocAction: executeCaseDocAction,
        executeDocAttachmentAction: executeDocAttachmentAction,
    };
    return service;

    function execute(nodeRef, mimetype, onSuccess, onError, $scope) {
        if (googleDocsService.isSupportedFormat(mimetype)) {
            googleDocsService
                    .uploadContent($scope, nodeRef)
                    .then(onSuccess, onError);
        }

    }
    function executeFileAction(file, onSuccess, onError, $scope) {
        execute(file.nodeRef, file.cm.content.mimetype, onSuccess, onError, $scope);
    }

    function executeCaseDocAction(doc, onSuccess, onError, $scope) {
        execute(doc.mainDocNodeRef, doc.fileMimeType, onSuccess, onError, $scope);
    }

    function executeDocAttachmentAction(attachment, onSuccess, onError, $scope) {
        execute(attachment.nodeRef, attachment.mimetype, onSuccess, onError, $scope);
    }

}