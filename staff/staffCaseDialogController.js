    angular
        .module('openeApp.cases.staff')
        .controller('StaffCaseDialogController', StaffCaseDialogController);
    
    function StaffCaseDialogController($controller, contactsService, userService, caseInfo) {
        angular.extend(this, $controller('CaseCommonDialogController', {caseInfo: caseInfo}));
        angular.extend(this, $controller('StaffNodeDialogController', {}));
        
        var vm = this;
        vm.formTemplateUrl = 'app/src/modules/staff/view/staffCaseCrudForm.html';
        vm.employeeSearchText = '';
        
        vm.initCommonCasePropsForEdit = vm.initCasePropsForEdit;
        vm.initCasePropsForEdit = initCasePropsForEdit;
        vm.searchEmployee = searchEmployee;
        vm.setEmployeeInfo = setEmployeeInfo;
        
        vm.init();
        
        function initCasePropsForEdit(){
            var vm = this;
            vm.initCommonCasePropsForEdit();
            vm.initStaffPropsForEdit(caseInfo, vm.case);
        }
        
        function searchEmployee(){
            var vm = this;
            return contactsService.getPersons(vm.employeeSearchText).then(function(result){
                var contacts = result.items.map(function(item){
                    return item.firstName + ' ' + item.lastName + ' CPR: ' + item.cprNumber;
                });
                return userService.getPeople("?filter=" + vm.employeeSearchText).then(function(result){
                    var people = result.people.map(function(item){
                        return item.firstName + ' ' + item.lastName;
                    });
                    return people.concat(contacts);
                });
            });
        }
        
        function setEmployeeInfo(employeeInfo){
            var vm = this;
            vm.case.prop_staff_employeeInfo = employeeInfo;
        }
    }