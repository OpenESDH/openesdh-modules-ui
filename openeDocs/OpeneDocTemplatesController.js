    angular
        .module('openeApp.openeDocs')
        .controller('OpeneDocTemplatesController', OpeneDocTemplatesController);
    
    function OpeneDocTemplatesController($mdDialog, $translate, openeDocsService, caseDocumentsService, documentPreviewService, alfrescoDocumentService, notificationUtilsService){
        var vm = this;
        vm.uploadTemplate = uploadTemplate;
        vm.docTypeName = docTypeName;
        vm.docCategoryName = docCategoryName;
        vm.preview = preview;
        vm.canDelete = canDelete;
        vm.deleteTemplate = deleteTemplate;
        vm.edit = edit;
        
        init();
        
        function init(){
            loadDocumentConstraints();
            openeDocsService.getTemplatesFolderRef().then(function(nodeRef){
                vm.templatesFolderRef = nodeRef;
            });
            loadTemplates();
        }
        
        function loadTemplates(){
            openeDocsService.getTemplates().then(function(result){
                vm.templates = result;
            });
        }
        
        function uploadTemplate(){
            showDialog('NewCaseDocumentDialogController', {fromFileObject: undefined}).then(function(formData){
                openeDocsService.uploadTemplate(formData.fileToUpload, vm.templatesFolderRef, formData.documentProperties).then(function(result){
                    loadTemplates();
                });
            });
        }
        
        function edit(template){
            showDialog(EditTemplateDialog, {template: template}).then(function(props){
                openeDocsService.updateTemplate(template.nodeRef, props).then(function(result){
                    loadTemplates();
                });
            });
        }
        
        function showDialog(controller, locals){
            return $mdDialog.show({
                controller: controller,
                templateUrl: 'app/src/modules/openeDocs/view/uploadTemplateDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                locals: locals
            });
        }
        
        function EditTemplateDialog($scope, $mdDialog, template){
            $scope.documentConstraints = vm.documentConstraints;
            
            $scope.isEditProperties = true;
            
            var docProps = {
                    title: template.cm.title,
                    description: template.cm.description
            };
            
            if(template.doc != undefined){
                docProps.doc_type = template.doc.type;
                docProps.doc_category = template.doc.category;
            }
            
            $scope.documentProperties = docProps;
            
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
          
            $scope.upload = function(){
                $mdDialog.hide($scope.documentProperties);
            };
        }
        
        function loadDocumentConstraints(){
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                vm.documentConstraints = documentConstraints;
            });
        }
        
        function docTypeName(nodeRef){
            var docTypes = vm.documentConstraints.documentTypes;
            for(var i=0; i<docTypes.length; i++){
                var type = docTypes[i];
                if(nodeRef == type.nodeRef){
                    return type.displayName;
                }
            }
        }
        
        function docCategoryName(nodeRef){
            var categories = vm.documentConstraints.documentCategories;
            for(var i=0; i<categories.length; i++){
                var category = categories[i];
                if(nodeRef == category.nodeRef){
                    return category.displayName;
                }
            }
        }
        
        function preview(template){
            documentPreviewService.previewDocument(template.nodeRef);
        }
        
        function canDelete(template){
            return template.cm.name.indexOf('blank.') !== 0;
        }
        
        function deleteTemplate(template){
            var vm = this;
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('OPENE_DOCS.ADMIN.ARE_YOU_SURE_YOU_WANT_TO_DELETE_TEMPLATE', {title: template.cm.title}))
                    .ariaLabel('')
                    .targetEvent(null)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                alfrescoDocumentService.deleteFile(template.nodeRef).then(function(result) {
                    notificationUtilsService.notify($translate.instant('OPENE_DOCS.ADMIN.DELETE_TEMPLATE_SUCCESS'));
                    loadTemplates();
                }, function(result) {
                    console.log(result);
                    notificationUtilsService.alert($translate.instant('OPENE_DOCS.ADMIN.DELETE_TEMPLATE_FAILURE'));
                });
            });
        }
    }