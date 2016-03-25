
angular
        .module('openeApp.doctemplates')
        .factory('templateToCaseService', templateToCaseService);

function templateToCaseService(officeTemplateService) {

    return {
        execute: execute
    };

    function execute(template, caseId, fieldData) {
        return officeTemplateService.fillTemplateToCase(template.nodeRef, caseId, fieldData);
    }
}