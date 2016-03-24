    angular
        .module('openeApp.cases.staff')
        .controller('StaffNodeDialogController', StaffNodeDialogController);
    
    function StaffNodeDialogController(){
        var vm = this;
        vm.initStaffPropsForEdit = initStaffPropsForEdit;
        
        function initStaffPropsForEdit(staffNodeInfo, editNode){
            var vm = this;
            var c = staffNodeInfo.properties;
            angular.extend(editNode, {
                prop_staff_hireDate: this.getDateValue(c['staff:hireDate']),
                prop_staff_resignationDate: this.getDateValue(c['staff:resignationDate']),
                prop_staff_salary: this.getNumberValue(c['staff:salary']),
                prop_staff_employeeInfo: this.getValue(c['staff:employeeInfo'])
            });
            return editNode;
        }
    }