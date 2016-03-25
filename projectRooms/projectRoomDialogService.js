
    angular
        .module('openeApp.projectRooms')
        .factory('projectRoomDialogService', projectRoomDialogService);
    
    function projectRoomDialogService($mdDialog, $q){
        return {
            createProjectRoom : createProjectRoom
        };
        
        function createProjectRoom(caseId){
            var deferred = $q.defer();
            $mdDialog.show({
                controller: ProjectRoomDialogController,
                controllerAs: 'dlg',
                templateUrl: 'app/src/modules/projectRooms/view/createProjectRoomWizard.html',
                parent: angular.element(document.body),
                targetEvent: null,
                locals: {
                    caseId: caseId,
                    deferred: deferred
                },
                focusOnOpen: false
            });
            return deferred.promise;
        }
        
        function ProjectRoomDialogController($mdDialog, $controller, caseDocumentsService, caseMembersService, 
                casePartiesService, sessionService, projectRoomsService, notificationUtilsService, $translate, caseId, deferred){
            angular.extend(this, $controller('GenericWizardController', {}));
            angular.extend(this, $controller('ProjectRoomDocumentsSelector', {}));
            angular.extend(this, $controller('InviteMembersSelector', {caseId: caseId}))
            var vm = this;            
            vm.caseSite = {};
            
            vm.documents = [];
            vm.submit = submit;
            
            
            init();
            
            function init(){
                caseDocumentsService.getCaseDocumentsWithAttachments(caseId).then(function(documents){
                    vm.documents = filterOutLockedDocs(documents); 
                });
                vm.init();
            }
            
            function filterOutLockedDocs(docs){
                var nonLockedDocs = docs.filter(function(doc){
                    return doc.locked == false;
                });
                
                angular.forEach(nonLockedDocs, function(doc){
                    doc.attachments = doc.attachments.filter(function(attachment){
                        return attachment.locked == false;
                    });
                });
                
                return nonLockedDocs;
            }
            
            function submit(){
                var caseSite = vm.caseSite;
                caseSite.caseId = caseId;
                caseSite.siteDocuments = vm.getSiteDocuments();
                caseSite.siteMembers = vm.getSiteMembers();
                caseSite.siteParties = vm.getSiteParties();
                $mdDialog.hide();
                projectRoomsService.createSite(caseSite).then(function(response){
                    notificationUtilsService.notify($translate.instant('PROJECT_ROOM.CREATED', {shortName: caseSite.shortName}));
                    deferred.resolve(response);
                });
            }
        }
    }