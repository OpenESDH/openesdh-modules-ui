
angular
        .module('openeApp.doctemplates')
        .factory('templateToCaseService', templateToCaseService);

function templateToCaseService(officeTemplateService) {

    return {
        execute: execute
    };

    function execute(template, caseId, fieldData, targetFolderRef) {
        return officeTemplateService.fillTemplateToCaseFolder(template.nodeRef, caseId, fieldData, targetFolderRef);
    }
}