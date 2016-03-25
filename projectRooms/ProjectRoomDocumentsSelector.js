    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomDocumentsSelector', ProjectRoomDocumentsSelector);
    
    function ProjectRoomDocumentsSelector(){
        var vm = this;
        vm.selectedDocuments = [];
        vm.onDocSelectionChanged = onDocSelectionChanged;
        vm.displaySelectedDocuments = displaySelectedDocuments;
        vm.addSelectedDocument = addSelectedDocument;
        vm.removeSelectedDocument = removeSelectedDocument;
        vm.getSiteDocuments = getSiteDocuments;
        
        function onDocSelectionChanged(doc, parent){
            var vm = this;
            if(doc.selected === true){
                vm.addSelectedDocument(doc, parent);
                return;
            }
            vm.removeSelectedDocument(doc, parent);
        }
        
        function addSelectedDocument(doc, parent){
            var vm = this;
            if(parent === undefined){
                vm.selectedDocuments.push(doc);
                return;
            }
            if(parent.selectedAttachments === undefined){
                parent.selectedAttachments = [];
            }
            parent.selectedAttachments.push(doc);
            if(!parent.selected){
                parent.selected = true;
                vm.selectedDocuments.push(parent);
            }
        }
        
        function removeSelectedDocument(doc, parent){
            var vm = this;
            if(parent === undefined){
                if(doc.selectedAttachments != undefined){
                    angular.forEach(doc.selectedAttachments, function(item){
                        item.selected = false;
                    });
                }
                doc.selectedAttachments = [];
                var index = vm.selectedDocuments.indexOf(doc);
                vm.selectedDocuments.splice(index, 1);
                return;
            }
            var index = parent.selectedAttachments.indexOf(doc);
            parent.selectedAttachments.splice(index, 1);
        }
        
        function displaySelectedDocuments(){
            var vm = this;
            return vm.selectedDocuments.map(function(item){
                return item.name || item.title;
            });
        }
        
        function getSiteDocuments(){
            var vm = this;
            return vm.selectedDocuments.map(function(item){
                var attachments = item.selectedAttachments === undefined ? [] : 
                    item.selectedAttachments.map(function(attachment){
                        return {
                            nodeRef: attachment.nodeRef
                        };
                });
                return {
                    nodeRef: item.nodeRef,
                    mainDocNodeRef: item.mainDocNodeRef,
                    attachments: attachments
                };
            });
        }
    }