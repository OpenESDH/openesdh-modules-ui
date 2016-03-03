angular
        .module('openeApp.doctemplates')
        .provider('createDocumentFromTemplateDialogService', CreateDocumentFromTemplateDialogServiceProvider);

function CreateDocumentFromTemplateDialogServiceProvider() {
    this.$get = CreateDocumentFromTemplateDialogService;
    var availableActionItems = [];
    this.addActionItem = addActionItem;
    this.getAvailableActionItems = getAvailableActionItems;

    function addActionItem(labelKey, serviceName, recipientRequired) {
        availableActionItems.push({
            labelKey: labelKey,
            serviceName: serviceName,
            recipientRequired: recipientRequired || false
        });
        return this;
    }

    function getAvailableActionItems() {
        return availableActionItems;
    }

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

        function CreateDocumentFromTemplateDialogController($scope, $injector, $q, $mdDialog, $translate,
                casePartiesService, officeTemplateService, notificationUtilsService, caseId, docsListCtrl) {
            var vm = this;

            $scope.vm = vm;

            vm.template = null;
            vm.parties = [];
            vm.actionItems = getAvailableActionItems();

            vm.actionItems.map(function(item) {
                isActionItemVisible(item).then(function(result) {
                    item.visible = result;
                });
            });

            vm.executeAction = executeAction;
            vm.cancel = cancel;
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

            function executeAction(actionItem) {
                var service = $injector.get(actionItem.serviceName);
                service.execute(vm.template, caseId, vm.fieldData)
                        .then(function(response) {
                            notificationUtilsService.notify($translate.instant('COMMON.SUCCESS'));
                            docsListCtrl.reloadDocuments();
                            $mdDialog.hide();
                        });
            }

            function cancel() {
                $mdDialog.cancel();
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

            function isActionItemVisible(menuItem) {
                var service = $injector.get(menuItem.serviceName);
                if (service.isVisible) {
                    return service.isVisible();
                }
                return $q.resolve(true);
            }
        }
    }
}