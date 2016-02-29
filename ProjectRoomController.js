    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomController', ProjectRoomController);
    
    function ProjectRoomController($stateParams, $mdDialog, projectRoomsService, sessionService){
        var vm = this;
        vm.editProjectRoom = editProjectRoom;
        vm.closeProjectRoom = closeProjectRoom;
        vm.isManager = false;
        vm.isExtUser = sessionService.isExternalUser();
        init();
        
        function init(){
            projectRoomsService.getSite($stateParams.shortName).then(function(site){
                vm.room = site;
            });
            projectRoomsService.getSiteMembers($stateParams.shortName).then(function(members){
                vm.members = members;
                vm.isManager = isUserManager();
            });
        }
        
        function isUserManager(){
            var userName = sessionService.getUserInfo().user.userName;
            var member = null;
            for(var i=0; i < vm.members.length; i++){
                member = vm.members[i];
                if(member.authority.userName == userName){
                    break;
                }
            }
            return member.role === 'SiteManager';
        }
        
        function editProjectRoom(){
            return $mdDialog.show({
                controller: EditProjectRoomController,
                controllerAs: 'dlg',
                templateUrl: 'app/src/modules/projectRooms/view/editProjectRoom.html',
                parent: angular.element(document.body),
                targetEvent: null,
                focusOnOpen: false,
                locals: {
                    room : {
                        shortName: vm.room.shortName,
                        title: vm.room.title,
                        description: vm.room.description,
                        visibility: vm.room.visibility
                    }
                }
            });
        }
        
        function EditProjectRoomController($mdDialog, room){
            var dlg = this;
            dlg.room = room;
            dlg.cancel = cancel;
            dlg.submit = submit;
            
            function cancel(){
                $mdDialog.cancel();
            }
            
            function submit(){
                projectRoomsService.updateCaseSite(dlg.room).then(function(){
                    $mdDialog.hide();
                    init();
                });
            }
        }
        
        function closeProjectRoom(){
            closeProjectRoomDialog();
        }
        
        function closeProjectRoomDialog(){
            return $mdDialog.show({
                controller: CloseProjectRoomController,
                controllerAs: 'dlg',
                templateUrl: 'app/src/modules/projectRooms/view/closeProjectRoomWizard.html',
                parent: angular.element(document.body),
                targetEvent: null,
                focusOnOpen: false,
                locals: {
                    room: vm.room
                }
            });
        }
        
        function CloseProjectRoomController($mdDialog, $stateParams, $controller, $location, $translate, notificationUtilsService, projectRoomsService, room){
            angular.extend(this, $controller('GenericWizardController', {}));
            angular.extend(this, $controller('ProjectRoomDocumentsSelector', {}));
            
            var vm = this;
            vm.room = room;
            vm.submit = submit;
            
            projectRoomsService.getSiteDocumentsWithAttachments($stateParams.shortName).then(function(documents){
                vm.documents = documents;
            });
            
            function submit(){
                var site = {
                        shortName: vm.room.shortName,
                        siteDocuments: vm.getSiteDocuments()
                };
                projectRoomsService.closeSite(site).then(function(response){
                    $mdDialog.hide();
                    notificationUtilsService.notify($translate.instant('PROJECT_ROOM.CLOSED', {shortName: site.shortName}));
                    $location.path("/cases/case/" + vm.room.caseId);
                });
            }
        }
    }