    angular
        .module('openeApp.openeDocs', [])
        .config(config);

    function config($stateProvider, languageFilesProvider, caseDocumentActionsServiceProvider, systemSettingsPagesServiceProvider){
        languageFilesProvider.addFile('app/src/modules/openeDocs/i18n/','-openeDocs.json');
        
        caseDocumentActionsServiceProvider.addAction('/app/src/modules/openeDocs/view/createDocumentAction.html', -1);
        
        systemSettingsPagesServiceProvider.addModulePage('OPENE_DOCS.ADMIN.TITLE', 
                'administration.systemsettings.openedocs', 'widgets');
        
        $stateProvider.state('administration.systemsettings.openedocs', {
            url: '/openedocs',
            data: {
                authorizedRoles: []
            },
            views: {
                'systemsetting-view': {
                    templateUrl: 'app/src/modules/openeDocs/view/docTemplates.html',
                    controller: 'OpeneDocTemplatesController',
                    controllerAs: 'vm'
                }
            }
        })
    }