
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
        
        function ProjectRoomController($mdDialog, $controller, userService, caseDocumentsService, caseId){
            angular.extend(this, $controller('GenericWizardController', {}));
            
            var vm = this;            
            vm.caseSite = {};
            vm.selectedParticipants = [];
            vm.participantRoles = ["SiteManager", "SiteCoordinator", "SiteContributor", "SiteConsumer"];
            vm.documents = [];
            vm.submit = submit;
            vm.searchParticipant = searchParticipant;
            vm.participantSelected = participantSelected;
            vm.removeParticipant = removeParticipant;
            vm.onDocSelectionChanged = onDocSelectionChanged;

            init();
            
            function init(){
                caseDocumentsService.getCaseDocumentsWithAttachments(caseId).then(function(documents){
                   vm.documents = documents; 
                });
            }
            
            function submit(){
                $mdDialog.hide();
                //notificationUtilsService.notify("'" + workflow.message + "' " + $translate.instant('WORKFLOW.STARTED'));
            }
            
            function searchParticipant(){
                return userService.getPersons(vm.participantSearchText).then(function(result){
                    return result.filter(function(item){
                        return participantNotSelected(item);
                    });
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
                vm.selectedParticipants.splice(index, 1);
            }
            
            function onDocSelectionChanged(){
                
            }
        }
    }