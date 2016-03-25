    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomsListController', ProjectRoomsListController);
    
    function ProjectRoomsListController(projectRoomsService){
        var vm = this;
        projectRoomsService.getSites().then(function(projectRooms){
            vm.rooms = projectRooms;
        });
    }