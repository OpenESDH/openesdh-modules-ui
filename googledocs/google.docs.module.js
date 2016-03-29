angular
        .module('openeApp.google.docs', ['ngMaterial', 'pascalprecht.translate'])
        .config(config);

function config(languageFilesProvider, fileListItemActionServiceProvider, documentEditActionsServiceProvider,
        documentAttachmentEditActionsServiceProvider, googleDocsServiceProvider) {
    //translations
    languageFilesProvider.addFile('app/src/modules/googledocs/i18n/', '-googledocs.json');
    //add "edit in google docs" actions to file list
    fileListItemActionServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _showWhenUnlockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _showWhenLockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _showWhenLockedInGoogleDocs_file, _isDisabled_file)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _showWhenLockedInGoogleDocs_file, _isDisabled_file);
    //add "edit in google docs" actions to case document edit
    documentEditActionsServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _showWhenUnlockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _showWhenLockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _showWhenLockedInGoogleDocs_casedoc, _isDisabled_casedoc)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _showWhenLockedInGoogleDocs_casedoc, _isDisabled_casedoc);
    //add "edit in google docs" actions to document attachments list
    documentAttachmentEditActionsServiceProvider
            .addItem('GOOGLE.DOCS.EDIT', 'description', 'googleDocsEditActionService', _showWhenUnlockedInGoogleDocs_attachment, _isDisabled_attachment)
            .addItem('GOOGLE.DOCS.CHECK-IN', 'save', 'googleDocsCheckInActionService', _showWhenLockedInGoogleDocs_attachment, _isDisabled_attachment)
            .addItem('GOOGLE.DOCS.RESUME', 'description', 'googleDocsResumeActionService', _showWhenLockedInGoogleDocs_attachment, _isDisabled_attachment)
            .addItem('GOOGLE.DOCS.CANCEL', 'cancel', 'googleDocsCancelActionService', _isLockedInGoogleDocs_attachment, _isDisabled_attachmentCancel);


    function _isSupportedFormat(mimetype) {
        return googleDocsServiceProvider.$get().isSupportedFormat(mimetype);
    }

    //file
    function _isLockedInGoogleDocs_file(file) {
        return file.gd2 && file.gd2.locked;
    }

    function _showWhenLockedInGoogleDocs_file(file) {
        return file && _isSupportedFormat(file.cm.content.mimetype) && _isLockedInGoogleDocs_file(file);
    }

    function _showWhenUnlockedInGoogleDocs_file(file) {
        return file && _isSupportedFormat(file.cm.content.mimetype) && !_isLockedInGoogleDocs_file(file);
    }

    function _isDisabled_file(file) {
        return file.cm.lockType && _isUnlockedInGoogleDocs_file(file);
    }
    
    //case document
    function _isLockedInGoogleDocs_casedoc(doc) {
        return doc && doc.mainDoc && doc.mainDoc.locked && doc.mainDoc.editorURL;
    }
    
    function _showWhenLockedInGoogleDocs_casedoc(doc) {
        return doc && _isSupportedFormat(doc.fileMimeType) && _isLockedInGoogleDocs_casedoc(doc);
    }

    function _showWhenUnlockedInGoogleDocs_casedoc(doc) {
        return doc && _isSupportedFormat(doc.fileMimeType) && !_isLockedInGoogleDocs_casedoc(doc);
    }

    function _isDisabled_casedoc(doc) {
        return doc === undefined || ((doc.isLocked || doc.editLockState.isLocked) && !_isLockedInGoogleDocs_casedoc(doc));
    }

    //attachments
    function _isLockedInGoogleDocs_attachment(attachment, documentEditable) {
        return !documentEditable || attachment && attachment.locked && attachment.otherProps.gd2_editorURL;
    }
    
    function _showWhenLockedInGoogleDocs_attachment(attachment, documentEditable) {
        return attachment && _isSupportedFormat(attachment.mimetype) && _isLockedInGoogleDocs_attachment(attachment, documentEditable);
    }

    function _showWhenUnlockedInGoogleDocs_attachment(attachment, documentEditable) {
        return attachment && _isSupportedFormat(attachment.mimetype) && !_isLockedInGoogleDocs_attachment(attachment, documentEditable);
    }

    function _isDisabled_attachment(attachment, documentEditable) {
        return attachment === undefined
                || !documentEditable
                || (attachment.locked && _isUnlockedInGoogleDocs_attachment(attachment, documentEditable));
    }

    function _isDisabled_attachmentCancel(attachment, documentEditable) {
        return attachment === undefined
                || !documentEditable
                || !_isSupportedFormat(attachment.mimetype)
                || (attachment.locked && _isUnlockedInGoogleDocs_attachment(attachment, documentEditable));
    }

}

