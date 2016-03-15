angular
        .module('openeApp.google.docs', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(languageFilesProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/googledocs/i18n/', '-googledocs.json');
}