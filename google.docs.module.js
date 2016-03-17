angular
        .module('openeApp.google.docs', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(languageFilesProvider, fileListItemActionServiceProvider, caseDocumentEditActionsServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/googledocs/i18n/', '-googledocs.json');
    //add "edit in google docs" actions to file list
    fileListItemActionServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _isUnlockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _isLockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _isLockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _isLockedInGoogleDocs_file, _isDisabled_file);
    //add "edit in google docs" actions to case document edit
    caseDocumentEditActionsServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _isUnlockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _isLockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _isLockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _isLockedInGoogleDocs_casedoc, _isDisabled_casedoc);
}

function _isLockedInGoogleDocs_file(file) {
    return file.gd2 && file.gd2.locked;
}

function _isUnlockedInGoogleDocs_file(file) {
    return !_isLockedInGoogleDocs_file(file);
}

function _isDisabled_file(file) {
    return file.cm.lockType && isUnlockedInGoogleDocs(file);
}

function _isLockedInGoogleDocs_casedoc(doc) {
    return doc && doc.mainDoc && doc.mainDoc.locked && doc.mainDoc.editorURL;
}

function _isUnlockedInGoogleDocs_casedoc(doc) {
    return !_isLockedInGoogleDocs_casedoc(doc);
}

function _isDisabled_casedoc(doc){
    return doc === undefined || ((doc.isLocked || doc.editLockState.isLocked) && _isUnlockedInGoogleDocs_casedoc(doc));
}

