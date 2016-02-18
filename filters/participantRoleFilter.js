    
    angular
        .module('openeApp.projectRooms')
        .filter('participantRole', participantRoleFilterFactory);
    
    function participantRoleFilterFactory($translate){
        function participantRoleFilter(value) {
            return $translate.instant('PROJECT_ROOM.PARTICIPANT_ROLES.' + value);
        }
        return participantRoleFilter;
    }