angular
        .module('openeApp.google.docs', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(languageFilesProvider, fileListItemActionServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/googledocs/i18n/', '-googledocs.json');
    //add "edit in google docs" actions to file list
    fileListItemActionServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', isUnlockedInGoogleDocs)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', isLockedInGoogleDocs)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', isLockedInGoogleDocs)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', isLockedInGoogleDocs);
}

function isLockedInGoogleDocs(file) {
    return file.googledocs && file.googledocs.locked;
}

function isUnlockedInGoogleDocs(file) {
    return !isLockedInGoogleDocs(file);
}