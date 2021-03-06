angular
        .module('openeApp.doctemplates', ['pascalprecht.translate', 'ngMaterial', 'ngFileSaver'])
        .config(config);

function config($stateProvider, USER_ROLES, languageFilesProvider, caseDocumentActionsServiceProvider,
        systemSettingsPagesServiceProvider, createDocumentFromTemplateDialogServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/doctemplates/i18n/', '-doctemplates.json');

    //register button "create from template"
    caseDocumentActionsServiceProvider.addAction('app/src/modules/doctemplates/view/createDocFromTemplateAction.html', 1);

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
            authorizedRoles: [USER_ROLES.admin]
        }
    });
    
    //create from template dialog actions
    createDocumentFromTemplateDialogServiceProvider.addActionItem('DOC_TEMPLATES.SAVE_RENDERED_TEMPLATE_TO_CASE', 'templateToCaseService');
    createDocumentFromTemplateDialogServiceProvider.addActionItem('DOC_TEMPLATES.DOWNLOAD_RENDERED_FROM_TEMPLATE', 'templateToDownloadService');
    createDocumentFromTemplateDialogServiceProvider.addActionItem('DOC_TEMPLATES.EMAIL_RENDERED_FROM_TEMPLATE', 'templateToEmailService', true);

}