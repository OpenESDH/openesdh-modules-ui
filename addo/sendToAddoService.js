angular
        .module('openeApp.addo')
        .factory('sendToAddoService', SendToAddoService);

function SendToAddoService($stateParams, $mdDialog, $q, $translate, notificationUtilsService,
        addoService, caseDocumentsService) {
    var service = {
        showDialog: execute,
        isVisible: isVisible
    };
    return service;

    function execute(caseId, docsCtrl) {
        var data = {
            templates: [],
            model: {
                caseId: $stateParams.caseId,
                template: null,
                receivers: [],
                sequential: false,
                docsFolderRef: docsCtrl.rootDocsFolder
            }
        };
        var pTempl = addoService.getSigningTemplates().then(function(templates) {
            data.templates = templates;
            showDialog(data);
        }, showError);
    }

    function showError(error) {
        if (error.domain) {
            notificationUtilsService.alert($translate.instant(error.message));
        }
    }

    function isVisible() {
        return addoService.isAddoAccountConfigured();
    }

    function showDialog(data) {
        $mdDialog.show({
            controller: AddoDialogController,
            controllerAs: "addoDialog",
            templateUrl: 'app/src/modules/addo/view/sendToAddoDialog.html',
            parent: angular.element(document.body),
            focusOnOpen: false,
            clickOutsideToClose: true,
            locals: data
        }).then(function(response) {
        });
    }

    function AddoDialogController($mdDialog, contactsService, personDialogService, templates, model) {
        var addoCtrl = this;
        addoCtrl.model = model;
        addoCtrl.selectedDocuments = [];
        //persons
        addoCtrl.selectedItem = null;
        addoCtrl.searchText = null;
        addoCtrl.querySearch = contactsQuerySearch;
        //data
        addoCtrl.templates = templates;

        addoCtrl.send = send;
        addoCtrl.cancel = cancel;
        addoCtrl.newContact = newContact;
        addoCtrl.isSigningDocSelected = isSigningDocSelected; 

        function send() {
            if (!isValidModel()) {
                return;
            }
            addoCtrl.model.sequential = addoCtrl.model.sequential && addoCtrl.model.receivers.length > 1;
            addoCtrl.model.documents = addoCtrl.selectedDocuments.map(function(doc){
                return {
                    nodeRef: doc.mainDocNodeRef ? doc.mainDocNodeRef : doc.nodeRef,
                    sign: doc.sign
                };
            });
            addoService.initiateSigning(addoCtrl.model).then(function() {
                notificationUtilsService.notify($translate.instant('ADDO.DOCUMENT.SENT_SUCCESSFULLY'));
                $mdDialog.hide();
            }, showError);
        }

        function cancel() {
            $mdDialog.cancel();
        }
        
        function isSigningDocSelected(){
            if(addoCtrl.selectedDocuments.length < 1){
                return false;
            }
            for(var i=0; i<addoCtrl.selectedDocuments.length; i++){
                if(addoCtrl.selectedDocuments[i].sign === undefined){
                    return false;
                }
            }
            return true;
        }
        
        function contactsQuerySearch(query) {
            if (!query) {
                return [];
            }
            return contactsService.getPersons(query).then(function(response) {
                return response.items;
            });
        }

        function isValidModel() {
            //If distribution equal e-mail then e-mail is required
            //If signing method equal NemID then CPR number is required
            //If "Encrypt document" is chosen then CPR number is required
            // - always true

            //If distribution equal SMS then phone no. is required
            //If "Validate by phone" is chosen then phone no. is required
            if (addoCtrl.model.template.MessageType === 'Sms' ||
                    addoCtrl.model.template.SmsVerification === true) {
                return validateRecipientsWithPhones();
            }
            return true;
        }

        function validateRecipientsWithPhones() {
            var noPhones = [];
            for (var r in addoCtrl.model.receivers) {
                var receiver = addoCtrl.model.receivers[r];
                if (!receiver.phone) {
                    noPhones.push(receiver.firstName + ' ' + receiver.lastName);
                }
            }
            if (noPhones.length > 0) {
                notificationUtilsService.alert($translate.instant('ADDO.ERROR.REQUIRED_PHONE_EMPTY_FOR_RECEIVERS', {'receivers': noPhones.join(', ')}));
                return false;
            }
            return true;
        }

        function newContact(ev) {
            var data = {
                templates: addoCtrl.templates,
                model: addoCtrl.model
            };
            personDialogService
                    .showPersonEdit(ev, null, null, false)
                    .then(function(response) {
                        data.model.receivers.push(response);
                        showDialog(data);
                    }, function() {
                        showDialog(data);
                    });
        }
    }
}