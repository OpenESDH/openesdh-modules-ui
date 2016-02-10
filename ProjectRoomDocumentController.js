    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomDocumentController', ProjectRoomDocumentController);
    
    function ProjectRoomDocumentController($stateParams, projectRoomsService, $controller){
        angular.extend(this, $controller('DocumentDetailsController'));
        var vm = this;
        vm.shortName = $stateParams.shortName;
        vm.activate();
    }