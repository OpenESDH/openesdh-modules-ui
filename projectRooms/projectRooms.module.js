    angular.module('openeApp.projectRooms', [])
        .config(config);
    
    function config($urlRouterProvider, $stateProvider, languageFilesProvider, caseInfoExtrasServiceProvider, 
            caseDocumentDetailsExtrasServiceProvider, dashboardServiceProvider, modulesMenuServiceProvider, taskFormConfigServiceProvider){
        
        $urlRouterProvider
        .when('/project/room/:shortName','/project/room/:shortName/info')
        .otherwise('/');
        
        $stateProvider.state('projectRoom', {
            parent: 'site',
            url: '/project/room/:shortName',
            views: {
                'content@': {
                    templateUrl : 'app/src/modules/projectRooms/view/projectRoom.html',
                    controller : 'ProjectRoomController',
                    controllerAs: 'prCtrl'
                }
            },
            data: {
                authorizedRoles: [],
                selectedTab: 0
            },
            params: {
                subfolder: null
            }
        }).state('projectRoom.info', {
            url: '/info',
            views: {
                'projectRoomInfo': {
                    templateUrl: 'app/src/modules/projectRooms/view/projectRoomInfo.html',
                    controller: 'ProjectRoomInfoController',
                    controllerAs: 'prInfoCtrl'
                }
            },
            data: {
                authorizedRoles: [],
                selectedTab: 0
            }
        }).state('projectRoom.members', {
            url: '/members',
            views: {
                'projectRoomMembers': {
                    templateUrl: 'app/src/modules/projectRooms/view/participants.html',
                    controller: 'ProjectRoomParticipantsController',
                    controllerAs: 'prm'
                }
            },
            data: {
                authorizedRoles: [],
                selectedTab: 1
            }
        }).state('projectRoom.invites', {
            url: '/invites',
            views: {
                'projectRoomInvites': {
                    templateUrl: 'app/src/modules/projectRooms/view/invites.html',
                    controller: 'ProjectRoomInvitesController',
                    controllerAs: 'pri'
                }
            },
            data: {
                authorizedRoles: [],
                selectedTab: 2
            }
        }).state('projectRoomDoc', {
            parent: 'site',
            url: '/project/room/:shortName/doc/:storeType/:storeId/:id',
            views: {
                'content@': {
                    templateUrl : 'app/src/modules/projectRooms/view/document.html',
                    controller : 'ProjectRoomDocumentController',
                    controllerAs: 'docCtrl'
                }
            },
            data: {
                authorizedRoles: []
            },
            params: {
                subfolder: null
            }
        }).state('projectRooms', {
            parent: 'site',
            url: '/project/rooms',
            views: {
                'content@': {
                    templateUrl : 'app/src/modules/projectRooms/view/projectRoomsList.html',
                    controller : 'ProjectRoomsListController',
                    controllerAs: 'prCtrl'
                }
            },
            data: {
                authorizedRoles: []
            }
        }).state('projectRoom.invite', {
            parent: 'site',
            url: '/project/room/:action/invite?inviteId&inviteTicket&inviteeUserName',
            views: {
                'content@': {
                    templateUrl : 'app/src/modules/projectRooms/view/inviteAcceptReject.html',
                    controller : 'ProjectRoomsInviteController',
                    controllerAs: 'vm'
                }
            },
            data: {
                authorizedRoles: []
            }
        });
        
        languageFilesProvider.addFile('app/src/modules/projectRooms/i18n/','-projectRooms.json');
        
        caseInfoExtrasServiceProvider.addExtra({
            controller: 'CaseInfoProjectRoomController'
        });
        
        caseDocumentDetailsExtrasServiceProvider.addExtra({
            controller: 'CaseInfoProjectRoomController'
        });
        
        dashboardServiceProvider.addDashlet({
            templateUrl: 'app/src/modules/projectRooms/view/projectRoomsDashlet.html',
            position: 'right',
            order: 2
        });
        dashboardServiceProvider.addExtUserDashlet({
            templateUrl: 'app/src/modules/projectRooms/view/projectRoomsDashlet.html',
            position: 'left',
            order: 1
        });
        
        modulesMenuServiceProvider.addItem({
            templateUrl: 'app/src/modules/projectRooms/view/menuItem.html',
            order: 5
        });
        
        modulesMenuServiceProvider.addExtUserItem({
            templateUrl: 'app/src/modules/projectRooms/view/menuItem.html',
            order: 1
        });
        
        taskFormConfigServiceProvider.taskForm({
            taskName: 'inwf:activitiInvitePendingTask',
            templateUrl: 'app/src/modules/projectRooms/view/inviteReviewTask.html',
            controller: 'InviteReviewTaskController'
        }).taskForm({
            taskName: 'inwf:acceptInviteTask',
            templateUrl: 'app/src/modules/projectRooms/view/inviteResponseTask.html',
            controller: 'simpleTaskController'
        }).taskForm({
            taskName: 'inwf:rejectInviteTask',
            templateUrl: 'app/src/modules/projectRooms/view/inviteResponseTask.html',
            controller: 'simpleTaskController'
        });
    }