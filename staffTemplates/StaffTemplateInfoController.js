    angular
        .module('openeApp.staffTemplates')
        .controller('StaffTemplateInfoController', StaffTemplateInfoController);
    
    function StaffTemplateInfoController($controller){
        angular.extend(this, $controller('CaseTemplateInfoController'));
        var vm = this;
        vm.headerMessageKey = 'STAFF_TEMPLATES.ADMIN.SYS_SETTINGS.STAFF_TEMPLATES.STAFF_CASE_TEMPLATE';
        vm.includeExtra = true;
        vm.extraFieldsUrl = 'app/src/modules/staffTemplates/view/staffTemplateInfo.html';
        vm.caseType = 'staff:case';
        vm.init();
    }