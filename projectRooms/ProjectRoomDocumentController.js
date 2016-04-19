    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomDocumentController', ProjectRoomDocumentController);
    
    function ProjectRoomDocumentController($stateParams, projectRoomsService, $controller, $scope){
        angular.extend(this, $controller('DocumentDetailsController', {$scope: $scope}));
        var vm = this;
        vm._scope = $scope;
        vm.shortName = $stateParams.shortName;
        vm.activate();
    }