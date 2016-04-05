angular
        .module('openeApp.addo')
        .factory('templateToAddoService', TemplateToAddoService);

function TemplateToAddoService($mdDialog, $translate, $q, addoService, notificationUtilsService) {
    var service = {
        execute: execute,
        isVisible: isVisible
    };
    return service;

    function execute(template, caseId, fieldData) {
        var result = $q.defer();
        //preload addo templates, then show dialog
        addoService.getSigningTemplates().then(function(templates) {
            $mdDialog.show({
                templateUrl: 'app/src/modules/addo/view/templateToAddoDialog.html',
                controller: TemplateToAddoController,
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    addoTemplates: templates,
                    caseId: caseId,
                    templateNodeRef: template.nodeRef,
                    fieldData: fieldData
                }
            }).then(function(){
                result.resolve(true);
            }, function(response){
                result.reject(response);
            });
        }, function(error) {
            if (error.domain){
                notificationUtilsService.alert(error.message);
            }
            result.reject(error);
        });
        return result.promise;
    }

    function isVisible() {
        return addoService.isAddoAccountConfigured();
    }

    function TemplateToAddoController(officeTemplateService, addoTemplates, caseId, templateNodeRef, fieldData) {
        var vm = this;

        vm.cancel = cancel;
        vm.fillToAddo = fillToAddo;
        vm.fieldData = fieldData;
        vm.templates = addoTemplates;

        function fillToAddo() {
            officeTemplateService.fillAndSendToAddo(templateNodeRef, caseId, vm.fieldData)
                    .then($mdDialog.hide,
                            function(errResponse) {
                                notificationUtilsService.alert(errResponse.statusText);
                                console.log(errResponse);
                            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
}