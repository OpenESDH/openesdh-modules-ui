    angular
        .module('openeApp.projectRooms')
        .controller('InviteMembersSelector', InviteMembersSelector);
    
    function InviteMembersSelector(sessionService, caseMembersService, casePartiesService, caseId, projectRoomsService){
        var vm = this;
        vm.selectedParticipants = [];
        vm.participantRoles = projectRoomsService.participantRoles;
        vm.searchParticipant = searchParticipant;
        vm.participantSelected = participantSelected;
        vm.participantNotSelected = participantNotSelected;
        vm.removeParticipant = removeParticipant;
        vm.getSiteMembers = getSiteMembers;
        vm.getSiteParties = getSiteParties;
        vm.init = init;
        
        function init(){
            var vm = this;
            caseMembersService.getCaseMembers(caseId).then(function(members){
                var currentUser = sessionService.getUserInfo().user;
                members = members.filter(function(item){
                   return item.authority != currentUser.userName; 
                });
                casePartiesService.getCaseParties(caseId).then(function(parties){
                    var partiesContacts = parties.map(function(party){
                        return party.contact;
                    });
                    vm.membersParties = members.concat(partiesContacts);
                    angular.forEach(vm.membersParties, function(item){
                        delete item.role;
                    });
                });
            });
        }
        
        function searchParticipant(){
            var vm = this;
            var searchText = vm.participantSearchText.toLowerCase();
            return vm.membersParties.filter(function(item){
                return item.displayName.toLowerCase().indexOf(searchText) != -1 && vm.participantNotSelected(item);
            });
        }
        
        function participantNotSelected(participant){
            var vm = this;
            for(var i = 0; i < vm.selectedParticipants.length; i++){
                var selectedParticipant = vm.selectedParticipants[i];
                if(selectedParticipant.nodeRef == participant.nodeRef){
                    return false;
                }
            }
            return true;
        }
        
        function participantSelected(){
            var vm = this;
            vm.selectedParticipants.push(vm.participantSelectedItem);
        }
        
        function removeParticipant(index){
            var vm = this;
            delete vm.selectedParticipants[index].role;
            vm.selectedParticipants.splice(index, 1);
        }
        
        function getSiteMembers(){
            var vm = this;
            return vm.selectedParticipants.filter(function(item){
                return item.authority != undefined;
            }).map(function(item){
                return {
                    authority: item.authority,
                    role: item.role
                };
            });
        }
        
        function getSiteParties(){
            var vm = this;
            return vm.selectedParticipants.filter(function(item){
                return item.contactId != undefined;
            }).map(function(item){
                return {
                    contactId: item.contactId,
                    nodeRef: item.nodeRef,
                    role: item.role
                };
            });
        }
    }