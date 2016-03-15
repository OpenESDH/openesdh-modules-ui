
angular
        .module('openeApp.google.docs')
        .factory('googleDocsResumeActionService', GoogleDocsResumeActionService);
function GoogleDocsResumeActionService(googleDocsService) {

    var service = {
        executeFileAction: executeFileAction
    };
    return service;

    function executeFileAction(file, $scope, onSuccess, onError) {
        googleDocsService.resumeEditing($scope, file);
    }
}