   angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomInvitesController', ProjectRoomInvitesController);
   
   function ProjectRoomInvitesController($stateParams, projectRoomsService, $mdDialog, $translate){
       var vm = this;
       vm.cancelInvite = cancelInvite;
       init();
       
       function init(){
           projectRoomsService.getPendingInvites($stateParams.shortName).then(function(invites){
               console.log(invites);
               vm.invites = invites;
           });
       }
       
       function cancelInvite(invite){
           var confirm = $mdDialog.confirm()
               .title($translate.instant("COMMON.CONFIRM"))
               .textContent($translate.instant("PROJECT_ROOM.CONFIRM_CANCEL_INVITE"))
               .ariaLabel($translate.instant("COMMON.CONFIRM"))
               .ok($translate.instant("COMMON.OK"))
               .cancel($translate.instant("COMMON.CANCEL"));
           
           $mdDialog.show(confirm).then(function(){
               projectRoomsService.cancelInvite($stateParams.shortName, invite.inviteId).then(function(){
                  init(); 
               });
           });
       }
   }