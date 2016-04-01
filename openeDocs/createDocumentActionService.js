    angular
        .module('openeApp.openeDocs')
        .provider('createDocumentActionService', createDocumentActionServiceProvider);
    
    function createDocumentActionServiceProvider(){
        
        var menuItems = [{
            docType: "word",
            labelKey: "OPENE_DOCS.CREATE_DOC.MS_WORD",
            extensions: ["docx", "doc"]
        },
        {
            docType: "excel",
            labelKey: "OPENE_DOCS.CREATE_DOC.MS_EXCEL",
            extensions: ["xlsx", "xls"]
        },
        {
            docType: "ppt",
            labelKey: "OPENE_DOCS.CREATE_DOC.MS_POWERPOINT",
            extensions: ["pptx", "ppt"]
        }];
        
        this.$get = createDocumentActionService;
        this.addMenuItem = addMenuItem;
        
        function addMenuItem(docType, labelKey, extensions){
            menuItems.push({
                docType: docType,
                labelKey: labelKey,
                extensions: extensions
            });
        }
        
        function createDocumentActionService(){
            return {
                getMenuItems: getMenuItems
            };
            
            function getMenuItems(){
                return menuItems;
            }
        }
    }