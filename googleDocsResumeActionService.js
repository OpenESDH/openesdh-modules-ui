angular
        .module('openeApp.google.docs')
        .factory('googleDocsResumeActionService', GoogleDocsResumeActionService);
function GoogleDocsResumeActionService(googleDocsService) {

    var service = {
        execute: execute,
        executeFileAction: executeFileAction,
        executeCaseDocAction: executeCaseDocAction,
        executeDocAttachmentAction: executeDocAttachmentAction
    };
    return service;

    function execute(editorURL, mimetype, onSuccess, onError, $scope) {
        if (googleDocsService.isSupportedFormat(mimetype)) {
            googleDocsService.resumeEditing($scope, editorURL);
        }
    }

    function executeFileAction(file, onSuccess, onError, $scope) {
        execute(file.gd2.editorURL, file.cm.content.mimetype, onSuccess, onError, $scope);
    }

    function executeCaseDocAction(doc, onSuccess, onError, $scope) {
        execute(doc.mainDoc.editorURL, doc.fileMimeType, onSuccess, onError, $scope);
    }

    function executeDocAttachmentAction(attachment, onSuccess, onError, $scope) {
        execute(attachment.otherProps.gd2_editorURL, attachment.mimetype, onSuccess, onError, $scope);
    }

}