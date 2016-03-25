    angular
        .module('openeApp.projectRooms')
        .controller('CaseInfoProjectRoomController', CaseInfoProjectRoomController);
    
    function CaseInfoProjectRoomController($stateParams, projectRoomDialogService, projectRoomsService){
        var vm = this;
        vm.docLockUrl = 'app/src/modules/projectRooms/view/caseDocDetailsLock.html';
        vm.caseInfoPropsUrl = 'app/src/modules/projectRooms/view/caseInfoProps.html';
        vm.caseInfoActionsUrl = 'app/src/modules/projectRooms/view/caseInfoActions.html';
        vm.hasProjectRoom = false;
        vm.projectRoom = null;
        vm.createProjectRoom = createProjectRoom;
        
        loadProjectRoomInfo();
        
        function createProjectRoom(){
            projectRoomDialogService.createProjectRoom($stateParams.caseId).then(function(){
                loadProjectRoomInfo();
            });
        }
        
        function loadProjectRoomInfo(){
            projectRoomsService.getCaseSites($stateParams.caseId).then(function(sites){
                if(sites.length == 0){
                    vm.hasProjectRoom = false;
                    vm.projectRoom = null;
                    return;
                }
                vm.hasProjectRoom = true;
                vm.projectRoom = sites[0];
            });
        }
    }