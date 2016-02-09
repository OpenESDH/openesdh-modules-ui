angular
        .module('openeApp.addo', ['pascalprecht.translate'])
        .config(config);

function config(caseDocumentsSendItemsServiceProvider, languageFilesProvider) {
    //case menu item
    caseDocumentsSendItemsServiceProvider.addMenuItem('ADDO.DOCUMENT.SEND_FOR_SIGNING', 'sendToAddoService', true);
    //translations
    languageFilesProvider.addFile('app/src/modules/addo/i18n/','-addo.json');
}