angular
        .module('openeApp.doctemplates', ['pascalprecht.translate', 'ngMaterial', 'ngFileSaver'])
        .config(config);

function config($stateProvider, languageFilesProvider, caseDocumentActionsServiceProvider, systemSettingsPagesServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/doctemplates/i18n/', '-doctemplates.json');
    
    //register button "create from template"
    caseDocumentActionsServiceProvider.addNewButton('DOC_TEMPLATES.CREATE_FROM_TEMPLATE', 'createDocumentFromTemplateDialogService', 'note_add', true);
    
    //register templates system settings page link
    systemSettingsPagesServiceProvider.addPage('DOC_TEMPLATES.TEMPLATE.LABELS.TEMPLATES', 'administration.systemsettings.templates');
    
    //templates system settings page state
    $stateProvider.state('administration.systemsettings.templates', {
        url: '/templates',
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/modules/doctemplates/view/templates.html',
                controller: 'OfficeTemplateController',
                controllerAs: 'tmplCtrl'
            }
        },
        data: {
            authorizedRoles: ['user']
        }
    });

}