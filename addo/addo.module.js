angular
        .module('openeApp.addo', ['pascalprecht.translate'])
        .config(config);

function config(sendDocumentsActionsServiceProvider, languageFilesProvider, $injector) {
    initCaseDocumentActionItems();
    initDocTemplateToAddoActionItems();
    initI18n();

    function initCaseDocumentActionItems() {
        //case menu item
        sendDocumentsActionsServiceProvider.addMenuItem('ADDO.DOCUMENT.SEND_FOR_SIGNING', 'sendToAddoService', true);
    }

    function initDocTemplateToAddoActionItems() {
        //create from template dialog actions (if template module exists
        if ($injector.has('createDocumentFromTemplateDialogServiceProvider')) {
            $injector.get('createDocumentFromTemplateDialogServiceProvider')
                    .addActionItem('ADDO.DOC_TEMPLATES.SIGN_RENDERED_FROM_TEMPLATE', 'templateToAddoService', true);
        }
    }

    function initI18n() {
        //translations
        languageFilesProvider.addFile('app/src/modules/addo/i18n/', '-addo.json');
    }
}