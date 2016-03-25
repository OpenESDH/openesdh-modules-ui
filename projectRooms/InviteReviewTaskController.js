    angular
        .module('openeApp.projectRooms')
        .controller('InviteReviewTaskController', InviteReviewTaskController);
    
    function InviteReviewTaskController($controller){
        angular.extend(this, $controller('baseTaskController', {}));
        var vm = this;
        
        init();
        
        function init(){
            vm.init();
            vm.reviewOutcomeProperty = 'inwf_inviteOutcome';
            vm.reviewOutcomeApprove = 'accept';
            vm.reviewOutcomeReject = 'reject';
        }
    }