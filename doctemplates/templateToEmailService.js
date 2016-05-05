angular
        .module('openeApp.doctemplates')
        .factory('templateToEmailService', TemplateToEmailService);

function TemplateToEmailService($mdDialog, $translate, APP_CONFIG) {
    var service = {
        execute: execute
    };
    return service;

    function execute(template, caseId, fieldData, targetFolderRef) {
        return $mdDialog.show({
            templateUrl: 'app/src/modules/doctemplates/view/templateToEmailDialog.html',
            controller: TemplateToEmailController,
            controllerAs: 'vm',
            clickOutsideToClose: true,
            locals: {
                caseId: caseId,
                templateNodeRef: template.nodeRef,
                fieldData: angular.extend(fieldData,
                        {
                            'email.subject': $translate.instant('DOC_TEMPLATES.DEFAULT_EMAIL_SUBJECT', {appName: APP_CONFIG.appName}),
                            'email.message': $translate.instant('DOC_TEMPLATES.DEFAULT_EMAIL_TEXT', {caseId: caseId})
                        }),
                targetFolderRef: targetFolderRef
            }
        });
    }

    function TemplateToEmailController(officeTemplateService, notificationUtilsService, caseId, templateNodeRef, fieldData, targetFolderRef) {
        var vm = this;

        vm.cancel = cancel;
        vm.fillToEmail = fillToEmail;
        vm.fieldData = fieldData;

        function fillToEmail() {
            officeTemplateService
                    .fillAndSendToEmail(templateNodeRef, caseId, vm.fieldData, targetFolderRef)
                    .then($mdDialog.hide);
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
}