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

    function execute() {
        var data = {
            templates: [],
            documents: [],
            model: {
                caseId: $stateParams.caseId,
                template: null,
                receivers: [],
                sequential: false,
                documents: []
            }
        };
        var pTempl = addoService.getSigningTemplates().then(function(templates) {
            data.templates = templates;
        });

        var pDocs = caseDocumentsService.getCaseDocumentsWithAttachments($stateParams.caseId).then(function(documents) {
            data.documents = documents;
        });

        //proceed when all promises are resolved
        $q.all([pTempl, pDocs]).then(function() {
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

    function AddoDialogController($mdDialog, contactsService, personDialogService, templates, documents, model) {
        var addoCtrl = this;
        addoCtrl.model = model;
        addoCtrl.selectedDocs = [];
        addoCtrl.selectedToSign = [];
        addoCtrl.oneSigningDocSelected = false;

        //persons
        addoCtrl.selectedItem = null;
        addoCtrl.searchText = null;
        addoCtrl.querySearch = contactsQuerySearch;
        //data
        addoCtrl.templates = templates;
        addoCtrl.documents = documents;

        addoCtrl.toggleDocument = toggleDocument;
        addoCtrl.send = send;
        addoCtrl.cancel = cancel;
        addoCtrl.newContact = newContact;

        function send() {
            if (!isValidModel()) {
                return;
            }
            addoCtrl.model.sequential = addoCtrl.model.sequential && addoCtrl.model.receivers.length > 1;

            addoService.initiateSigning(addoCtrl.model).then(function() {
                notificationUtilsService.notify($translate.instant('ADDO.DOCUMENT.SENT_SUCCESSFULLY'));
                $mdDialog.hide();
            }, showError);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function toggleDocument(doc) {
            //remove old document
            var index = addoCtrl.selectedDocs.indexOf(doc.nodeRef);
            if (index > -1) {
                addoCtrl.selectedDocs.splice(index, 1);
                addoCtrl.selectedToSign.splice(index, 1);
                addoCtrl.model.documents.splice(index, 1);
            }
            //add document
            if (doc.selected && typeof doc.sign !== 'undefined') {
                addoCtrl.selectedDocs.push(doc.nodeRef);
                addoCtrl.selectedToSign.push(doc.sign);
                addoCtrl.model.documents.push({
                    nodeRef: doc.mainDocNodeRef ? doc.mainDocNodeRef : doc.nodeRef,
                    sign: doc.sign
                });
            }
            addoCtrl.oneSigningDocSelected = addoCtrl.selectedToSign.indexOf(true) > -1;
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
                documents: addoCtrl.documents,
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