    angular.module('openeApp.staffTemplates', [])
        .config(config);
    
    function config($stateProvider, systemSettingsPagesServiceProvider, languageFilesProvider, caseTemplateDialogServiceProvider, caseCrudDialogServiceProvider){
        
        languageFilesProvider.addFile('app/src/modules/staffTemplates/i18n/','-staffTemplates.json');
        
        systemSettingsPagesServiceProvider.addModulePage('STAFF_TEMPLATES.ADMIN.SYS_SETTINGS.STAFF_TEMPLATES.TITLE', 
                'administration.systemsettings.stafftemplates', 'widgets');
        
        $stateProvider.state('administration.systemsettings.stafftemplates', {
            url: '/stafftemplates',
            data: {
                authorizedRoles: []
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/cases/case_templates/view/caseTemplates.html',
                    controller: 'StaffTemplatesController',
                    controllerAs: 'vm'
                }
            }
        }).state('administration.systemsettings.stafftemplate', {
            url: '/stafftemplate/:storeType/:storeId/:id',
            data: {
                authorizedRoles: []
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/cases/case_templates/view/caseTemplateInfo.html',
                    controller: 'StaffTemplateInfoController',
                    controllerAs: 'vm'
                }
            }
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