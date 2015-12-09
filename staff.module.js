    angular
        .module('openeApp.cases.staff', ['openeApp.cases.common'])
        .config(config);

    function config(caseCrudDialogServiceProvider){
        caseCrudDialogServiceProvider.caseCrudForm({
            type: 'staff:case',
            controller: 'StaffCaseDialogController',
            caseInfoTemplateUrl: 'app/src/modules/staff/view/caseInfo.html'
        });
    }

