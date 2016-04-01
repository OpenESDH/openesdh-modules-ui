    angular
        .module('openeApp.doctemplates')
        .controller('DocFromTemplateActionController', DocFromTemplateActionController);
    
    function DocFromTemplateActionController($scope, createDocumentFromTemplateDialogService){
        var vm = this;
        vm.execute = execute;
        
        function execute(){
            createDocumentFromTemplateDialogService.showDialog($scope.docCtrl.caseId, $scope.docCtrl);
        }
    }