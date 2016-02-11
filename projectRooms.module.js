    angular.module('openeApp.projectRooms', [])
        .config(config);
    
    function config($stateProvider, languageFilesProvider, caseInfoExtrasServiceProvider, caseDocumentDetailsExtrasServiceProvider){
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
                authorizedRoles: []
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
            }
        });
        
        languageFilesProvider.addFile('app/src/modules/projectRooms/i18n/','-projectRooms.json');
        
        caseInfoExtrasServiceProvider.addExtra({
            controller: 'CaseInfoProjectRoomController'
        });
        
        caseDocumentDetailsExtrasServiceProvider.addExtra({
            controller: 'CaseInfoProjectRoomController'
        });
    }