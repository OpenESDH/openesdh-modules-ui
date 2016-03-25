    angular
        .module('openeApp.cases.staff', ['openeApp.cases.common'])
        .config(config);

    function config(caseCrudDialogServiceProvider, languageFilesProvider){
        caseCrudDialogServiceProvider.caseCrudForm({
            type: 'staff:case',
            controller: 'StaffCaseDialogController',
            caseInfoFormUrl: 'app/src/modules/staff/view/caseInfo.html'
        });
        
        languageFilesProvider.addFile('app/src/modules/staff/i18n/','-staff.json');
    }

