angular
        .module('openeApp.google.docs')
        .factory('googleDocsResumeActionService', GoogleDocsResumeActionService);
function GoogleDocsResumeActionService(googleDocsService) {

    var service = {
        execute: execute,
        executeFileAction: executeFileAction,
        executeCaseDocAction: executeCaseDocAction
    };
    return service;
    
    function execute(editorURL, $scope, onSuccess, onError) {
        googleDocsService.resumeEditing($scope, editorURL);
    }
    
    function executeFileAction(file, $scope, onSuccess, onError) {
        execute(file.gd2.editorURL, $scope, onSuccess, onError);
    }
    
    function executeCaseDocAction(doc, $scope, onSuccess, onError) {
        execute(doc.mainDoc.editorURL, $scope, onSuccess, onError);
    }

}