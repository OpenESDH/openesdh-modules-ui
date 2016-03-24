    angular
        .module('openeApp.staffTemplates')
        .controller('StaffTemplatesController', StaffTemplatesController);
    
    function StaffTemplatesController($controller){
        angular.extend(this, $controller('CaseTemplatesController'))
        var vm = this;
        vm.headerMessageKey = 'STAFF_TEMPLATES.ADMIN.SYS_SETTINGS.STAFF_TEMPLATES.STAFF_CASE_TEMPLATES';
        vm.caseType = "staff:case";
        vm.templateInfoUrl = '#/admin/system-settings/stafftemplate';
        vm.init();
    }