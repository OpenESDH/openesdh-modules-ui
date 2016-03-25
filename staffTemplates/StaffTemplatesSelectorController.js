    angular
        .module('openeApp.staffTemplates')
        .controller('StaffTemplatesSelectorController', StaffTemplatesSelectorController);
    
    function StaffTemplatesSelectorController($controller, caseInfo){
        angular.extend(this, $controller('CaseTemplatesSelectorController', {caseInfo: caseInfo}));
        var vm = this;
        vm.getCommonTemplateProps = vm.getTemplateProps;
        vm.getTemplateProps = getTemplateProps;
        
        function getTemplateProps(template){
            var vm = this;
            var props = vm.getCommonTemplateProps(template); 
            var staffProps = vm.getStaffPropsForEdit(template);
            angular.extend(props, staffProps);    
            return props;
        }
        
    }