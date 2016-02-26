    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomsInviteController', ProjectRoomsInviteController);

    function ProjectRoomsInviteController($state, $stateParams, projectRoomsService, $translate, notificationUtilsService){
        var vm = this;
        vm.reject = false;
        vm.rejectSuccess = false;
        vm.accept = false;
        vm.rejectInvite = rejectInvite;
        vm.acceptInvite = acceptInvite;
        init();
        
        function init(){
            if($stateParams.action === 'reject'){
                projectRoomsService.getInvitationByTicket($stateParams.inviteId, $stateParams.inviteTicket, $stateParams.inviteeUserName).then(function(invite){
                    vm.invite = invite;
                    vm.reject = true
                });
            }else if($stateParams.action === 'accept'){
                acceptInvite();
            }
        }
        
        function rejectInvite(){
            projectRoomsService.rejectInvite($stateParams.inviteId, $stateParams.inviteTicket, $stateParams.inviteeUserName).then(function(response){
                vm.reject = false;
                vm.rejectSuccess = true;
            }, 
            processError);
        }
        
        function acceptInvite(){
            projectRoomsService.acceptInvite($stateParams.inviteId, $stateParams.inviteTicket, $stateParams.inviteeUserName).then(function(response){
                vm.reject = false;
                notificationUtilsService.notify($translate.instant('PROJECT_ROOM.INVITATION_ACCEPTED'));
                $state.go('login');
            },
            processError);
        }
        
        function processError(error){
            vm.reject = false;
            if(error.status == 409){
                vm.rejectAcceptFailure = true;
            }
        }
    }
