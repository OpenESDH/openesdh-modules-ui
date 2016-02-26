angular
        .module('openeApp.doctemplates')
        .factory('createDocumentFromTemplateDialogService', CreateDocumentFromTemplateDialogService);

function CreateDocumentFromTemplateDialogService($mdDialog) {
    var service = {
        showDialog: execute
    };
    return service;

    function execute(caseId, docsListCtrl) {
        return $mdDialog.show({
            templateUrl: 'app/src/modules/doctemplates/view/createDocumentFromTemplateDialog.html',
            controller: CreateDocumentFromTemplateDialogController,
            controllerAs: 'vm',
            clickOutsideToClose: true,
            locals: {
                caseId: caseId,
                docsListCtrl: docsListCtrl
            }
        });
    }

    function CreateDocumentFromTemplateDialogController($scope, $filter, $mdDialog, caseDocumentFileDialogService,
            casePartiesService, officeTemplateService, sessionService, caseService, contactsService, alfrescoNodeUtils,
            caseId, docsListCtrl) {
        var vm = this;

        $scope.vm = vm;

        vm.caseId = caseId;
        vm.template = null;
        vm.receiver = null;
        vm.parties = [];

        vm.cancel = cancel;
        vm.alert = msg;
        vm.fillAndSaveToCase = fillAndSaveToCase;
        vm.fieldData = {};
        vm.fieldData['case.id'] = caseId;

        activate();

        function activate() {
            $scope.$watch(function(scope) {
                return vm.template;
            }, function(newValue, oldValue) {
                if (newValue) {
                    officeTemplateService.getTemplate(newValue.nodeRef).then(function(template) {
                        vm.currentTemplate = template;
                    });
                }
            });

            $scope.$watch(function(scope) {
                return vm.receiver;
            }, function(newValue, oldValue) {
                if (newValue) {
                    vm.fieldData["receiver.nodeRefId"] = newValue.nodeRef;
                }
            });

            casePartiesService.getCaseParties(caseId).then(function(response) {
                vm.parties = response;
            });
        }

        function fillAndSaveToCase(template, fieldData) {
            officeTemplateService.fillTemplate(template.nodeRef, fieldData).then(function(blob) {
                var uniqueStr = new Date().getTime();
                // Convert the Blob to a File
                // (http://stackoverflow.com/a/29390393)
                blob.lastModifiedDate = new Date();
                blob.name = template.name.split('.').slice(0, -1).join(".") + "-" + uniqueStr + ".pdf";
                return caseDocumentFileDialogService.uploadCaseDocument(docsListCtrl.docsFolderNodeRef, blob).then(function(result) {
                    docsListCtrl.reloadDocuments();
                    $mdDialog.hide(result);
                });
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
        
        function msg(text) {
            alert(text);
        }
    }
}