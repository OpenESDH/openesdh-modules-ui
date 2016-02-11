
    angular
        .module('openeApp.projectRooms')
        .factory('projectRoomDialogService', projectRoomDialogService);
    
    function projectRoomDialogService($mdDialog){
        return {
            createProjectRoom : createProjectRoom
        };
        
        function createProjectRoom(caseId){
            return $mdDialog.show({
                controller: ProjectRoomController,
                controllerAs: 'dlg',
                templateUrl: 'app/src/modules/projectRooms/view/createProjectRoomWizard.html',
                parent: angular.element(document.body),
                targetEvent: null,
                locals: {
                    caseId: caseId
                },
                focusOnOpen: false
            });
        }
        
        function ProjectRoomController($mdDialog, $controller, caseDocumentsService, caseMembersService, 
                casePartiesService, sessionService, projectRoomsService, notificationUtilsService, $translate, caseId){
            angular.extend(this, $controller('GenericWizardController', {}));
            
            var vm = this;            
            vm.caseSite = {};
            vm.selectedParticipants = [];
            vm.participantRoles = ["SiteConsumer", "SiteContributor", "SiteCoordinator", "SiteManager"];
            vm.selectedDocuments = [];
            vm.documents = [];
            vm.submit = submit;
            vm.searchParticipant = searchParticipant;
            vm.participantSelected = participantSelected;
            vm.removeParticipant = removeParticipant;
            vm.onDocSelectionChanged = onDocSelectionChanged;
            vm.displaySelectedDocuments = displaySelectedDocuments;

            init();
            
            function init(){
                caseDocumentsService.getCaseDocumentsWithAttachments(caseId).then(function(documents){
                    vm.documents = documents; 
                });
                caseMembersService.getCaseMembers(caseId).then(function(members){
                    var currentUser = sessionService.getUserInfo().user;
                    members = members.filter(function(item){
                       return item.authority != currentUser.userName; 
                    });
                    casePartiesService.getCaseParties(caseId).then(function(parties){
                        vm.membersParties = members.concat(parties);
                        angular.forEach(vm.membersParties, function(item){
                            delete item.role;
                        });
                    });
                });
            }
            
            function submit(){
                var caseSite = vm.caseSite;
                caseSite.caseId = caseId;
                caseSite.siteDocuments = getSiteDocuments();
                caseSite.siteMembers = getSiteMembers();
                caseSite.siteParties = getSiteParties();
                projectRoomsService.createSite(caseSite).then(function(response){
                    notificationUtilsService.notify($translate.instant('PROJECT_ROOM.CREATED', {shortName: caseSite.shortName}));
                    $mdDialog.hide();
                });
            }
            
            function searchParticipant(){
                var searchText = vm.participantSearchText.toLowerCase();
                return vm.membersParties.filter(function(item){
                    return item.displayName.toLowerCase().indexOf(searchText) != -1 && participantNotSelected(item);
                });
            }
            
            function participantNotSelected(participant){
                for(var i = 0; i < vm.selectedParticipants.length; i++){
                    var selectedParticipant = vm.selectedParticipants[i];
                    if(selectedParticipant.nodeRef == participant.nodeRef){
                        return false;
                    }
                }
                return true;
            }
            
            function participantSelected(){
                vm.selectedParticipants.push(vm.participantSelectedItem);
            }
            
            function removeParticipant(index){
                delete vm.selectedParticipants[index].role;
                vm.selectedParticipants.splice(index, 1);
            }
            
            function onDocSelectionChanged(doc, parent){                
                if(doc.selected === true){
                    addSelectedDocument(doc, parent);
                    return;
                }
                removeSelectedDocument(doc, parent);
            }
            
            function addSelectedDocument(doc, parent){
                if(parent === undefined){
                    vm.selectedDocuments.push(doc);
                    return;
                }
                if(parent.selectedAttachments === undefined){
                    parent.selectedAttachments = [];
                }
                parent.selectedAttachments.push(doc);
                if(!parent.selected){
                    parent.selected = true;
                    vm.selectedDocuments.push(parent);
                }
            }
            
            function removeSelectedDocument(doc, parent){
                if(parent === undefined){
                    if(doc.selectedAttachments != undefined){
                        angular.forEach(doc.selectedAttachments, function(item){
                            item.selected = false;
                        });
                    }
                    doc.selectedAttachments = [];
                    var index = vm.selectedDocuments.indexOf(doc);
                    vm.selectedDocuments.splice(index, 1);
                    return;
                }
                var index = parent.selectedAttachments.indexOf(doc);
                parent.selectedAttachments.splice(index, 1);
            }
            
            function displaySelectedDocuments(){
                return vm.selectedDocuments.map(function(item){
                    return item.name || item.title;
                });
            }
            
            function getSiteMembers(){
                return vm.selectedParticipants.filter(function(item){
                    return item.authority != undefined;
                }).map(function(item){
                    return {
                        authority: item.authority,
                        role: item.role
                    };
                });
            }
            
            function getSiteParties(){
                return vm.selectedParticipants.filter(function(item){
                    return item.contactId != undefined;
                }).map(function(item){
                    return {
                        contactId: item.contactId,
                        nodeRef: item.nodeRef,
                        role: item.role
                    };
                });
            }
            
            function getSiteDocuments(){
                return vm.selectedDocuments.map(function(item){
                    var attachments = item.selectedAttachments === undefined ? [] : 
                        item.selectedAttachments.map(function(attachment){
                            return {
                                nodeRef: attachment.nodeRef
                            };
                    });
                    return {
                        nodeRef: item.nodeRef,
                        mainDocNodeRef: item.mainDocNodeRef,
                        attachments: attachments
                    };
                });
            }
        }
    }