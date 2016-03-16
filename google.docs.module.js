angular
        .module('openeApp.google.docs', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(languageFilesProvider, fileListItemActionServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/googledocs/i18n/', '-googledocs.json');
    //add "edit in google docs" actions to file list
    fileListItemActionServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', isUnlockedInGoogleDocs, isDisabled)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', isLockedInGoogleDocs, isDisabled)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', isLockedInGoogleDocs, isDisabled)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', isLockedInGoogleDocs, isDisabled);
}

function isLockedInGoogleDocs(file) {
    return file.gd2 && file.gd2.locked;
}

function isUnlockedInGoogleDocs(file) {
    return !isLockedInGoogleDocs(file);
}

function isDisabled(file) {
    return file.cm.lockType && isUnlockedInGoogleDocs(file);
}