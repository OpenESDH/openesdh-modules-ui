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

    function CreateDocumentFromTemplateDialogController($scope, $mdDialog, casePartiesService, officeTemplateService,
            notificationUtilsService, FileSaver, caseId, docsListCtrl, templateToEmailService) {
        var vm = this;

        $scope.vm = vm;

        vm.template = null;
        vm.parties = [];

        vm.cancel = cancel;
        vm.alert = msg;
        vm.fillTemplate = fillTemplate;
        vm.fillAndSaveToCase = fillAndSaveToCase;
        vm.fillAndSendToEmail = fillAndSendToEmail;
        vm.fieldData = {};
        vm.fieldData['receivers'] = [];

        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = contactsQuerySearch;

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

            casePartiesService.getCaseParties(caseId).then(function(response) {
                vm.parties = response.map(function(item) {
                    return angular.extend(item,
                            {
                                _displayName: angular.lowercase(item.displayName)
                            });
                });
            });
        }

        function fillTemplate() {
            officeTemplateService.fillTemplate(vm.template.nodeRef, caseId, vm.fieldData).then(function(result) {
                var extension = result.zip ? '.zip' : '.pdf';
                var fileName = vm.template.name.split('.').slice(0, -1).join('.');
                FileSaver.saveAs(
                        result.blob,
                        fileName + extension
                        );
            });
        }

        function fillAndSaveToCase() {
            officeTemplateService.fillTemplateToCase(vm.template.nodeRef, caseId, vm.fieldData).then(function(response) {
                notificationUtilsService.notify("Success!");
                docsListCtrl.reloadDocuments();
                $mdDialog.hide();
            });
        }

        function fillAndSendToEmail() {
            templateToEmailService.showDialog(vm.template.nodeRef, caseId, vm.fieldData)
                    .then(function(response) {
                        notificationUtilsService.notify("Success!");
                        docsListCtrl.reloadDocuments();
                    });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function msg(text) {
            alert(text);
        }

        function contactsQuerySearch(query) {
            var results = query ? vm.parties.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(party) {
                return (party._displayName.indexOf(lowercaseQuery) > -1 ||
                        party.contactId.indexOf(lowercaseQuery) > -1);
            };
        }
    }
}