    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomParticipantsController', ProjectRoomParticipantsController);
    
    function ProjectRoomParticipantsController($stateParams, projectRoomsService, $mdDialog, $translate, notificationUtilsService){
        var vm = this;
        vm.invite = invite;
        vm.remove = remove;
        vm.changeParticipantRole = changeParticipantRole;
        vm.participantRoles = projectRoomsService.participantRoles;
        init();
        
        function init(){
            projectRoomsService.getSite($stateParams.shortName).then(function(site){
                vm.room = site;
            });
            loadSiteMembers();
        }
        
        function loadSiteMembers(){
            projectRoomsService.getSiteMembers($stateParams.shortName).then(function(members){
                console.log("members", members);
                vm.members = members;
            });
        }
        
        function remove(member){
            var confirm = $mdDialog.confirm()
                .title($translate.instant("COMMON.CONFIRM"))
                .textContent($translate.instant("PROJECT_ROOM.CONFIRM_REMOVE_PARTICIPANT"))
                .ariaLabel($translate.instant("COMMON.CONFIRM"))
                .ok($translate.instant("COMMON.OK"))
                .cancel($translate.instant("COMMON.CANCEL"));
        
            $mdDialog.show(confirm).then(function(){
                projectRoomsService.removeMember($stateParams.shortName, member.authority.fullName).then(function(){
                    loadSiteMembers(); 
                });
            });
        }
        
        function changeParticipantRole(member){
            projectRoomsService.changeMemberRole($stateParams.shortName, member.authority.fullName, member.role).then(function(){
                notificationUtilsService.notify($translate.instant('PROJECT_ROOM.PARTICIPANT_ROLE_UPDATED'));
            });
        }
        
        function invite(){
            return $mdDialog.show({
                controller: InviteController,
                controllerAs: 'dlg',
                templateUrl: 'app/src/modules/projectRooms/view/inviteDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                focusOnOpen: false,
                locals: {
                    caseId: vm.room.caseId,
                    siteMembers: vm.members
                }
            });
        }
        
        function InviteController($controller, $stateParams, $mdDialog, projectRoomsService, notificationUtilsService, $translate, caseId, siteMembers){
            angular.extend(this, $controller('InviteMembersSelector', {caseId: caseId}))
            var main = vm;
            var vm = this;
            vm.superParticipantNotSelected = vm.participantNotSelected;
            vm.participantNotSelected = participantNotSelected;
            vm.cancel = cancel;
            vm.submit = submit;
            vm.isInvalid = isInvalid;
            vm.init();
            
            function participantNotSelected(participant){
                var result = vm.superParticipantNotSelected(participant);
                if(result === false){
                    return false;
                }
                
                for(var i=0; i < siteMembers.length; i++){
                    var member = siteMembers[i];
                    if(member.authority.fullName == participant.authority){
                        return false;
                    }
                }
                
                return true;
            }
            
            function cancel(){
                $mdDialog.cancel();
            }
            
            function submit(){
                var site = {
                    shortName: $stateParams.shortName,
                    siteMembers: vm.getSiteMembers(),
                    siteParties: vm.getSiteParties()
                };
                $mdDialog.hide();
                projectRoomsService.inviteParticipants(site).then(function(response){
                    notificationUtilsService.notify($translate.instant('PROJECT_ROOM.PARTICIPANTS_SUCCESSFULLY_INVITED'));
                });
            }
            
            function isInvalid(form){
                if(!form || form.$invalid === true){
                    return true;
                }
                var siteMembers = vm.getSiteMembers();
                return siteMembers.length == 0;
            }
        }
    }