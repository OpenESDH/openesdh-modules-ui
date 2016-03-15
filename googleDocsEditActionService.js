
angular
        .module('openeApp.google.docs')
        .factory('googleDocsEditActionService', GoogleDocsEditActionService);
function GoogleDocsEditActionService(googleDocsService) {

    var service = {
        executeFileAction: executeFileAction
    };
    return service;

    function executeFileAction(file, $scope, onSuccess, onError) {
        googleDocsService
                .uploadContent($scope, file.nodeRef)
                .then(onSuccess, onError);
    }
}