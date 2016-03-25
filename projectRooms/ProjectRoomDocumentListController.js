    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomDocumentListController', ProjectRoomDocumentListController);
    
    function ProjectRoomDocumentListController($controller, $stateParams, projectRoomsService){
        
        angular.extend(this, $controller('DocumentsController'));
        
        var vm = this;
        vm.docDetailsUrl = '#/project/room/' + $stateParams.shortName + '/doc';
        vm.shortName = $stateParams.shortName;
        vm.reloadDocuments = reloadDocuments;
        vm.init = init;
        vm.init();
        
        function init(){
            var vm = this;
            vm.reloadDocuments();
            projectRoomsService.getSite($stateParams.shortName).then(function(site){
                vm.docsFolderNodeRef = site.documentsFolderRef;
                vm.caseId = site.caseId;
            });
        }
        
        function reloadDocuments(){
            var vm = this;
            projectRoomsService.getSiteDocuments(vm.shortName).then(function(documents){
                vm.documents = documents;
                vm.addThumbnailUrl();
            });
        }
        
}