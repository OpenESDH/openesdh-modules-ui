
angular
        .module('openeApp.google.docs')
        .factory('googleDocsCancelActionService', GoogleDocsCancelActionService);
function GoogleDocsCancelActionService(googleDocsService) {

    var service = {
        executeFileAction: executeFileAction
    };
    return service;

    function executeFileAction(file, $scope, onSuccess, onError) {
        googleDocsService.discardContent($scope, file.nodeRef)
                .then(onSuccess, onError);
    }
}