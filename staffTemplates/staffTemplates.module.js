    angular.module('openeApp.staffTemplates', [])
        .config(config);
    
    function config($stateProvider, systemSettingsPagesServiceProvider, languageFilesProvider, 
            caseTemplateDialogServiceProvider, caseCrudDialogServiceProvider, caseTemplatesModulesProvider){
        
        languageFilesProvider.addFile('app/src/modules/staffTemplates/i18n/','-staffTemplates.json');
        
        caseTemplatesModulesProvider.module({
            caseType: 'staff:case',
            moduleTitleKey: 'STAFF_TEMPLATES.ADMIN.SYS_SETTINGS.STAFF_TEMPLATES.TITLE',
            templatesListController: 'StaffTemplatesController',
            templateInfoController: 'StaffTemplateInfoController'
        });
        
        caseTemplateDialogServiceProvider.dialogConfig({
            type: 'staff:case',
            controller: 'StaffTemplateDialogController'
        });
        
        caseCrudDialogServiceProvider.caseCrudExtra({
            type: 'staff:case',
            controller: 'StaffTemplatesSelectorController'
        });
    }