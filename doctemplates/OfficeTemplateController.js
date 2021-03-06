angular
        .module('openeApp.doctemplates')
        .controller('OfficeTemplateController', OfficeTemplateController);

function OfficeTemplateController($mdDialog, $translate, officeTemplateService) {
    var vm = this;

    vm.getTemplates = getTemplates;
    vm.deleteTemplate = deleteTemplate;
    vm.getTemplate = getTemplate;
    vm.getThumbnail = getThumbnail;
    vm.getFileExtension = getFileExtension;
    vm.uploadNewTemplate = uploadTemplate;

    activate();

    function activate() {
        getTemplates();
    }

    function getTemplates() {
        return officeTemplateService.getTemplates().then(function(templates) {
            vm.templates = templates;
        });
    }

    function getThumbnail(nodeRef) {
        return officeTemplateService.getCardViewThumbnail(nodeRef);
    }

    function getFileExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    function deleteTemplate(ev, template) {
        var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('DOC_TEMPLATES.TEMPLATE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_TEMPLATE', {title: template.title}))
                .targetEvent(ev)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));

        $mdDialog.show(confirm).then(function() {
            officeTemplateService.deleteTemplate(template.nodeRef).then(function(response) {
                return getTemplates();
            });
        });
        ev.stopPropagation();
    }

    function getTemplate(nodeRef) {
        return officeTemplateService.getTemplate(nodeRef).then(function(template) {
            return template;
        });
    }

    function uploadTemplate() {
        showDialog(NewCaseDocumentDialogController).then(function(response) {
            console.log("==> Response from dialog:", response);
            officeTemplateService.uploadTemplate(response).then(function(response) {
                console.log("==> Response from dialog Service:", response);
                return getTemplates();
            });
        });
    }

    function showDialog(controller, locals) {
        if (!locals) {
            locals = {
                newTemplateVersion: false
            };
        }
        return $mdDialog.show({
            controller: NewCaseDocumentDialogController,
            templateUrl: 'app/src/modules/doctemplates/view/uploadDialog.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            locals: locals
        });
    }

    function NewCaseDocumentDialogController($scope, $mdDialog, caseDocumentsService) {
        caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints) {
            $scope.documentTypes = documentConstraints.documentTypes;
            $scope.documentCategories = documentConstraints.documentCategories;
        });

        $scope.templateProperties = {
            majorVersion: "false",
            title: '',
            doc_type: null,
            doc_category: null,
            description: ''
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.upload = function() {
            var response = {
                fileToUpload: $scope.fileToUpload,
                templateProperties: $scope.templateProperties
            };
            $mdDialog.hide(response);
        };
    }
}