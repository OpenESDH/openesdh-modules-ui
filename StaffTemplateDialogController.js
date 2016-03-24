    angular
        .module('openeApp.staffTemplates')
        .controller('StaffTemplateDialogController', StaffTemplateDialogController);
    
    function StaffTemplateDialogController($controller, workflowDefs, template){
        angular.extend(this, $controller('CaseTemplateDialogController', {template: template, workflowDefs: workflowDefs}));
        angular.extend(this, $controller('StaffNodeDialogController', {}));
        var vm = this;
        vm.includeExtra = true;
        vm.extraFieldsUrl = 'app/src/modules/staffTemplates/view/staffTemplateCrudDialog.html';
        vm.commonInitPropsForEdit = vm.initPropsForEdit;
        vm.initPropsForEdit = initPropsForEdit;
        vm.init();
        
        function initPropsForEdit(){
            var vm = this;
            vm.commonInitPropsForEdit();
            vm.initStaffPropsForEdit(template, vm.template);
        }
    }