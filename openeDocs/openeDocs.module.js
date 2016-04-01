    angular
        .module('openeApp.openeDocs', [])
        .config(config);

    function config(languageFilesProvider, caseDocumentActionsServiceProvider){
        languageFilesProvider.addFile('app/src/modules/openeDocs/i18n/','-openeDocs.json');
        
        caseDocumentActionsServiceProvider.addAction('/app/src/modules/openeDocs/view/createDocumentAction.html', -1);
    }