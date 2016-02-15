
    angular
        .module('openeApp.projectRooms')
        .factory('projectRoomDialogService', projectRoomDialogService);
    
    function projectRoomDialogService($mdDialog){
        return {
            createProjectRoom : createProjectRoom
        };
        
        function createProjectRoom(caseId){
            return $mdDialog.show({
                controller: ProjectRoomDialogController,
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
        
        function ProjectRoomDialogController($mdDialog, $controller, caseDocumentsService, caseMembersService, 
                casePartiesService, sessionService, projectRoomsService, notificationUtilsService, $translate, caseId){
            angular.extend(this, $controller('GenericWizardController', {}));
            angular.extend(this, $controller('ProjectRoomDocumentsSelector', {}));
            var vm = this;            
            vm.caseSite = {};
            vm.selectedParticipants = [];
            vm.participantRoles = ["SiteConsumer", "SiteContributor", "SiteCoordinator", "SiteManager"];
            
            vm.documents = [];
            vm.submit = submit;
            vm.searchParticipant = searchParticipant;
            vm.participantSelected = participantSelected;
            vm.removeParticipant = removeParticipant;
            
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
                caseSite.siteDocuments = vm.getSiteDocuments();
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
        }
    }