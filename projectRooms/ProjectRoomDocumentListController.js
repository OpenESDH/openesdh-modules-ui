    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomDocumentListController', ProjectRoomDocumentListController);
    
    function ProjectRoomDocumentListController($controller, $stateParams, projectRoomsService, caseDocumentsService){
        
        angular.extend(this, $controller('DocumentsController'));
        
        var vm = this;
        vm.docDetailsState = {
                name: 'projectRoomDoc',
                params: {
                    shortName: $stateParams.shortName
                }
        };
        vm.shortName = $stateParams.shortName;
        vm.init = init;
        vm.init();
        
        function init(){
            var vm = this;
            projectRoomsService.getSite($stateParams.shortName).then(function(site){
                vm.docsFolderNodeRef = site.documentsFolderRef;
                vm.caseId = site.caseId;
                vm.initSuperController();
            });
        }
    }