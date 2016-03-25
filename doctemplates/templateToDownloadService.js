
angular
        .module('openeApp.doctemplates')
        .factory('templateToDownloadService', templateToDownloadService);

function templateToDownloadService(officeTemplateService, FileSaver) {

    return {
        execute: execute
    };

    function execute(template, caseId, fieldData) {
        return officeTemplateService.fillTemplate(template.nodeRef, caseId, fieldData).then(function(result) {
            var extension = result.zip ? '.zip' : '.pdf';
            var fileName = template.name.split('.').slice(0, -1).join('.');
            FileSaver.saveAs(
                    result.blob,
                    fileName + extension
                    );
        });
    }
}