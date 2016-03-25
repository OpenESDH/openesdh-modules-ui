angular
        .module('openeApp.google.docs', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(languageFilesProvider, fileListItemActionServiceProvider, documentEditActionsServiceProvider,
        documentAttachmentEditActionsServiceProvider, googleDocsServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/googledocs/i18n/', '-googledocs.json');
    //add "edit in google docs" actions to file list
    fileListItemActionServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _isUnlockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _isLockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _isLockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _isLockedInGoogleDocs_file, _isDisabled_file);
    //add "edit in google docs" actions to case document edit
    documentEditActionsServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _isUnlockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _isLockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _isLockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _isLockedInGoogleDocs_casedoc, _isDisabled_casedoc);
    //
    documentAttachmentEditActionsServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _isUnlockedInGoogleDocs_attachment, _isDisabled_attachment)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _isLockedInGoogleDocs_attachment, _isDisabled_attachment)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _isLockedInGoogleDocs_attachment, _isDisabled_attachment)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _isLockedInGoogleDocs_attachment, _isDisabled_attachmentCancel);


    function _isLockedInGoogleDocs_file(file) {
        return file.gd2 && file.gd2.locked;
    }

    function _isUnlockedInGoogleDocs_file(file) {
        return !_isLockedInGoogleDocs_file(file);
    }

    function _isDisabled_file(file) {
        return file.cm.lockType && _isUnlockedInGoogleDocs_file(file);
    }

    function _isLockedInGoogleDocs_casedoc(doc) {
        return doc && doc.mainDoc && doc.mainDoc.locked && doc.mainDoc.editorURL;
    }

    function _isUnlockedInGoogleDocs_casedoc(doc) {
        return !_isLockedInGoogleDocs_casedoc(doc);
    }

    function _isDisabled_casedoc(doc) {
        return doc === undefined || ((doc.isLocked || doc.editLockState.isLocked) && _isUnlockedInGoogleDocs_casedoc(doc));
    }

    function _isLockedInGoogleDocs_attachment(attachment, documentEditable) {
        return !documentEditable || attachment && attachment.locked && attachment.otherProps.gd2_editorURL;
    }

    function _isUnlockedInGoogleDocs_attachment(attachment, documentEditable) {
        return !_isLockedInGoogleDocs_attachment(attachment, documentEditable);
    }

    function _isDisabled_attachment(attachment, documentEditable) {
        return attachment === undefined
                || !documentEditable
                || !googleDocsServiceProvider.$get().isSupportedFormat(attachment.mimetype)
                || (attachment.locked && _isUnlockedInGoogleDocs_attachment(attachment, documentEditable));
    }
    
    function _isDisabled_attachmentCancel(attachment, documentEditable) {
        return attachment === undefined
                || !documentEditable
                || (attachment.locked && _isUnlockedInGoogleDocs_attachment(attachment, documentEditable));
    }

}

