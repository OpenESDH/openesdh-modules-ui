    angular
        .module('openeApp.projectRooms')
        .controller('ProjectRoomInfoController', ProjectRoomInfoController);
    
    // This controller is necessary for project room tabs controls correct working.
    // Otherwise it ends up opening empty tab contents.
    function ProjectRoomInfoController(){}