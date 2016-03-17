angular
        .module('openeApp.google.docs')
        .factory('googleDocsCheckInActionService', GoogleDocsCheckInActionService);
function GoogleDocsCheckInActionService(googleDocsService) {

    var service = {
        execute: execute,
        executeFileAction: executeFileAction,
        executeCaseDocAction: executeCaseDocAction
    };
    return service;

    function execute(nodeRef, $scope, onSuccess, onError) {
        googleDocsService.saveContent($scope, nodeRef)
                .then(onSuccess, onError);
    }

    function executeFileAction(file, $scope, onSuccess, onError) {
        execute(file.nodeRef, $scope, onSuccess, onError);
    }

    function executeCaseDocAction(doc, $scope, onSuccess, onError) {
        execute(doc.mainDocNodeRef, $scope, onSuccess, onError);
    }
}