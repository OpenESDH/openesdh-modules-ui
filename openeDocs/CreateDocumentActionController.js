    angular
        .module('openeApp.openeDocs')
        .controller('CreateDocumentActionController', CreateDocumentActionController);
    
    function CreateDocumentActionController($scope, $mdDialog, createDocumentActionService, caseDocumentsService, openeDocsService){
        var vm = this;
        vm.createDocument = createDocument;
        vm.menuItems = createDocumentActionService.getMenuItems();
        
        function createDocument(docType){
            openeDocsService.getTemplates(docType.extensions).then(function(templates){
                $mdDialog.show({
                    controller: DocumentFromTemplateDialog,
                    templateUrl: 'app/src/modules/openeDocs/view/createDocumentDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    locals: {
                        templates: templates,
                        docType: docType
                    }  
                }).then(function(props){
                    var docListCtrl = $scope.docCtrl;
                    props.destination = docListCtrl.docsFolderNodeRef;
                    openeDocsService.createDocument(props).then(function(result){
                        docListCtrl.reloadDocuments();
                    });
                });
            });
        }
        
        function DocumentFromTemplateDialog($scope, $mdDialog, templates, docType){
            loadDocumentConstraints($scope);
            var blankTemplate = templates[0];
            $scope.selectedOpeneDocTemplate = {
                    nodeRef: blankTemplate.nodeRef
            };
            $scope.openeDocsTemplates = templates;
            $scope.docType = docType;
            $scope.documentProperties = {};
            
            initDocProps(blankTemplate)
            
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            
            $scope.submit = function(){
                var props = angular.copy($scope.documentProperties);
                props.templateRef = $scope.selectedOpeneDocTemplate.nodeRef;
                $mdDialog.hide(props);
            };
            
            $scope.templateChanged = function(){
                var template = getSelectedTemplate();
                initDocProps(template);
            };
            
            function initDocProps(template){
                if(template.doc != undefined){
                    $scope.documentProperties.doc_type = template.doc.type;
                    $scope.documentProperties.doc_category = template.doc.category;
                }    
            }
            
            function getSelectedTemplate(){
                for(var i=0; i<templates.length; i++){
                    var template = templates[i];
                    if(template.nodeRef == $scope.selectedOpeneDocTemplate.nodeRef){
                        return template;
                    }
                }
            }
        }
        
        function loadDocumentConstraints($scope){
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                $scope.documentConstraints = documentConstraints;
            });
        }
        
    }