
angular
        .module('openeApp.google.docs')
        .factory('googleDocsCheckInActionService', GoogleDocsCheckInActionService);
function GoogleDocsCheckInActionService(googleDocsService) {

    var service = {
        executeFileAction: executeFileAction
    };
    return service;

    function executeFileAction(file, $scope, onSuccess, onError) {
        googleDocsService
                .saveContent($scope, file.nodeRef)
                .then(onSuccess, onError);
    }
}