    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomController', ProjectRoomController);
    
    function ProjectRoomController($stateParams, projectRoomsService){
        var vm = this;
        
        init();
        
        function init(){
            projectRoomsService.getSite($stateParams.shortName).then(function(site){
                vm.room = site;
            });
        }
    }